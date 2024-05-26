<?php

namespace App\Http\Controllers;


use App\Mail\MailService;
use App\Models\DetailTransaction;
use App\Models\HeaderPayment;
use App\Models\HeaderTransaction;
use App\Models\Product;
use App\Models\Transaction;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;


class OrderController extends Controller
{
    //


    public function getAllOrders(Request $request)
    {
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);
        $query = Transaction::with('headerTransaction.customer', 'headerTransaction.headerPayment');
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                $query->whereHas('headerTransaction.customer', function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%");
                })
                    ->orWhere('order_number', 'like', "%$search%");

            });

        }
        if ($request->filled('order')) {
            $order = $request->input('order');
            $query->orderBy($order[0]['field'], $order[0]['sort']);
        } else {
            $query->orderByRaw("
            CASE status
                WHEN 'CREATED' THEN 1
                WHEN 'ON PROGRESS' THEN 2
                WHEN 'ON DELIVERY' THEN 3
                WHEN 'COMPLETED' THEN 4
                ELSE 5
            END ASC
        ")->orderBy('id', 'desc');
        }
        $orders = $query->paginate($perPage, ['*'], 'page', $page);
        $orders->getCollection()->transform(function ($order, $key) use ($orders) {
            return [
                'no' => $key + 1 + (($orders->currentPage() - 1) * $orders->perPage()),
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => optional($order->headerTransaction->customer)->name,
                'date' => $order->date,
                'status' => $order->status,
                'totalPrice' => "Rp. " . optional($order->headerTransaction)->total_price,
                'payment_status' => optional($order->headerTransaction->headerPayment)->payment_status,
            ];
        });
        return response()->json($orders);

    }


    public function createNewOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customerId' => 'required',
            'orderDate' => 'required',
            'products' => 'required|array',
            'products.*.productId' => 'required',
            'products.*.color' => 'required',
            'products.*.size' => 'required',
            'products.*.quantity' => 'required|numeric|min:1',

        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $data = $request->all();

        DB::beginTransaction();
        try {

            $totalPrice = 0;
            $headerTransaction = HeaderTransaction::create([
                'customer_id' => $data['customerId'],
                'created_by' => $data['user']
            ]);
            $transaction = Transaction::create([
                'order_number' => "#" . time() . mt_rand(),
                'header_id' => $headerTransaction->id,
                'date' => Carbon::createFromFormat('Y-m-d', $data['orderDate']),
                'status' => 'CREATED'
            ]);
            foreach ($data['products'] as $product) {
                $productDetail = Product::find($product['productId']);
                $totalPrice += $productDetail->price * $product['quantity'];
                $detailTransaction = DetailTransaction::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product['productId'],
                    'color' => $product['color'],
                    'size' => $product['size'],
                    'quantity' => $product['quantity'],
                    'notes' => $product['notes'],
                ]);
            }

            $headerTransaction->update(['total_price' => $totalPrice]);
            $headerPayment = HeaderPayment::create([
                'header_transaction_id' => $headerTransaction->id,
                'payment_remaining_amount' => $totalPrice,
                'payment_status' => 'NOT PAID',
                'created_by' => $data['user']
            ]);
            DB::commit();
            return response()->json(['message' => "Successfully create order", 'data' => $data], 200);

        } catch (\Throwable $th) {
            //throw $th;
            DB::rollback();
            return response()->json(['message' => 'Failed create order :' . $th->getMessage()], 500);
        }

    }
    public function getOrderDetailById($id)
    {
        $order = Transaction::with('headerTransaction.customer', 'shipment', 'headerTransaction.headerPayment', 'headerTransaction.headerPayment.payments')->findOrFail($id);
        return response()->json($order);
    }

    public function getOrderedProduct($id)
    {
        $detailTransaction = Transaction::with('detailTransaction.product')->findOrFail($id);
        $products = [];
        $index = 1;
        foreach ($detailTransaction->detailTransaction as $item) {
            $productsData = [
                'no' => $index,
                'id' => $item->id,
                'productId' => $item->product_id,
                'color' => $item->color,
                'size' => $item->size,
                'notes' => $item->notes,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'productName' => $item->product->name,
                'imageUrl' => "/storage/images/" . $item->product->image,

            ];
            $products[] = $productsData;
            $index++;

        }
        return response()->json($products);

    }
    public function updateStatusOrder(Request $request)
    {
        $data = $request->all();
        $order = Transaction::findOrFail($data['id']);
        $order->update(['status' => $data['status']]);
        return response()->json($order);
    }

    public function changeCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customerId' => 'required',

        ]);
        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }

        $headerTransaction = HeaderTransaction::findOrFail($request->headerId);
        $headerTransaction->update(['customer_id' => $request->customerId]);
        return response()->json(['message' => "Successfully change customer", 'data' => $headerTransaction], 200);
    }

    public function addOrderProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'products.*.productId' => 'required',
            'products.*.color' => 'required',
            'products.*.size' => 'required',
            'products.*.quantity' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $totalPrice = 0;
        $products = Product::whereIn('id', array_column($request->products, 'productId'))->get()->keyBy('id');
        $transaction = Transaction::findOrFail($request->transactionId);
        $headerTransaction = $transaction->headerTransaction;
        $headerPayment = $headerTransaction->headerPayment;
        foreach ($request->products as $product) {
            $productModel = $products[$product['productId']];
            $detailTransaction = DetailTransaction::create([

                'transaction_id' => $request->transactionId,
                'product_id' => $product['productId'],
                'color' => $product['color'],
                'size' => $product['size'],
                'quantity' => $product['quantity'],
                'notes' => $product['notes'],
                'price' => $productModel->price,
            ]);
            $totalPrice += $detailTransaction->price * $product['quantity'];

        }
        $headerTransaction->update(['total_price' => $headerTransaction->total_price += $totalPrice, 'updated_by' => 'System']);
        $headerPayment->update(['payment_remaining_amount' => $headerPayment->payment_remaining_amount += $totalPrice, 'updated_by' => 'System']);

        return response()->json(['message' => "Successfully add product", 'data' => $detailTransaction], 200);

    }
    public function updateOrderProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'productId' => 'required',
            'color' => 'required',
            'size' => 'required',
            'quantity' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $detailTransaction = DetailTransaction::findOrFail($request->detailId);
        $newProduct = Product::findOrFail($request->productId);
        $headerTransaction = $detailTransaction->transaction->headerTransaction;
        $headerPayment = $headerTransaction->headerPayment;

        $headerTransaction->update(['total_price' => ($headerTransaction->total_price - $detailTransaction->price * $detailTransaction->quantity) + $newProduct->price * $request->quantity]);
        $headerPayment->update(['payment_remaining_amount' => ($headerPayment->payment_remaining_amount - $detailTransaction->product->price * $detailTransaction->quantity) + $newProduct->price * $request->quantity]);
        $detailTransaction->update([
            'product_id' => $request->productId,
            'color' => $request->color,
            'size' => $request->size,
            'quantity' => $request->quantity,
            'notes' => $request->notes,
            'price' => $newProduct->price,
        ]);

        return response()->json(['message' => "Successfully update product", 'data' => $detailTransaction], 200);
    }

    public function deleteOrderProduct($id)
    {

        $detailTransaction = DetailTransaction::findOrFail($id);
        $headerTransaction = $detailTransaction->transaction->headerTransaction;
        $headerPayment = $headerTransaction->headerPayment;
        $headerTransaction->update(['total_price' => ($headerTransaction->total_price - ($detailTransaction->price * $detailTransaction->quantity))]);
        $headerPayment->update(['payment_remaining_amount' => ($headerPayment->payment_remaining_amount - ($detailTransaction->price * $detailTransaction->quantity))]);
        $detailTransaction->delete();
        return response()->json(['message' => "Successfully delete product", 'data' => $detailTransaction], 200);
    }

    public function deleteOrderById($id)
    {
        try {

            $transaction = Transaction::findOrFail($id);
            $transaction->shipment()->delete();

            $transaction->headerTransaction->headerPayment->payments()->delete();
            $transaction->headerTransaction->headerPayment->delete();
            $transaction->detailTransaction()->delete();
            $transaction->delete();
            $transaction->headerTransaction->delete();


            return response()->json(['message' => "Successfully delete order", 'data' => $transaction], 200);
        } catch (\Exception $e) {
            // Menangkap dan mengirimkan pesan error jika transaksi tidak ditemukan
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function sendInvoiceByEmail($id)
    {
        try {

            $headerTransaction = HeaderTransaction::findOrFail($id);

            Mail::to($headerTransaction->customer->email)->send(
                new MailService(
                    $headerTransaction->customer->name,
                    optional($headerTransaction->transaction->shipment)->price,
                    optional($headerTransaction->transaction->shipment)->shipping_address,
                    $headerTransaction->transaction->order_number,
                    $headerTransaction->total_price,
                    $headerTransaction->total_price - $headerTransaction->headerPayment->payment_remaining_amount,
                    $headerTransaction->headerPayment->payment_remaining_amount,
                    $headerTransaction->headerPayment->payment_status === "PAID" ? "LUNAS" : "BELUM LUNAS",
                    $headerTransaction->transaction->detailTransaction,
                    true
                )
            );


            return response()->json(['message' => "Successfully sent invoice", 'data' => $headerTransaction], 200);

        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], $th->getCode());
        }

    }
    public function downloadInvoice($id)
    {
        $headerTransaction = HeaderTransaction::findOrFail($id);
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $data = [
            'customerName' => $headerTransaction->customer->name,
            'shippingPrice' => optional($headerTransaction->transaction->shipment)->price,
            'address' => optional($headerTransaction->transaction->shipment)->shipping_address,
            'orderId' => $headerTransaction->transaction->order_number,
            'total' => $headerTransaction->total_price,
            'paid' => $headerTransaction->total_price - $headerTransaction->headerPayment->payment_remaining_amount,
            'remaining' => $headerTransaction->headerPayment->payment_remaining_amount,
            'paymentStatus' => $headerTransaction->headerPayment->payment_status === "PAID" ? "LUNAS" : "BELUM LUNAS",
            'items' => $headerTransaction->transaction->detailTransaction,
            'isEmail' => false
        ];
        $dompdf = new Dompdf($options);
        $dompdf->setPaper('A3', 'potrait');
        $dompdf->loadHtml(view('emails.email-template', $data));
        $dompdf->render();
        $output = $dompdf->output();
        $pdfFileName = "orderReceipt" . '.pdf';
        Storage::put('public/invoices/' . $pdfFileName, $output);

        $pdfBytes = Storage::get('public/invoices/' . $pdfFileName);

        Storage::delete('public/invoices/' . $pdfFileName);

        return response($pdfBytes)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $pdfFileName . '"');

    }
    public function downloadVendorForm(Request $request)
    {
        $transactions = Transaction::with('detailTransaction')->whereIn('id', $request->transactionIds)->get();

        $data = $transactions->flatMap(function ($transaction) {
            return $transaction->detailTransaction->map(function ($detail) {
                return [
                    'productName' => $detail->product->name,
                    'color' => $detail->color,
                    'size' => $detail->size,
                    'notes' => $detail->notes,
                    'quantity' => $detail->quantity,
                    'customerName' => $detail->transaction->headerTransaction->customer->name,
                    'image' => $detail->product->image,
                ];
            });
        });

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);
        $dompdf->setPaper('A4', 'potrait');
        $dompdf->loadHtml(view('vendor-form', ['allData' => $data]));
        $dompdf->render();
        $output = $dompdf->output();
        $pdfFileName = "Surat Pemesanan " . Carbon::now()->format('d M Y') . '.pdf';
        Storage::put('public/invoices/' . $pdfFileName, $output);

        $pdfBytes = Storage::get('public/invoices/' . $pdfFileName);

        Storage::delete('public/invoices/' . $pdfFileName);

        return response($pdfBytes)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $pdfFileName . '"');
    }
}
