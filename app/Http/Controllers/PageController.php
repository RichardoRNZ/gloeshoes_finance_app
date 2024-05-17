<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaction;
use App\Models\HeaderPayment;
use App\Models\HeaderTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PageController extends Controller
{
    //
    public function mainPage()
    {
        return Inertia::render('Home');
    }
    public function loginPage()
    {
        return Inertia::render('Login');
    }
    public function dashboardPage()
    {
        $currentMonthStartDate = Carbon::now()->startOfMonth();
        $currentMonthEndDate = Carbon::now()->endOfMonth();

        // Query untuk mendapatkan pesanan aktif
        $activeOrder = Transaction::whereNotIn('status', ['COMPLETED', 'CREATED'])
            ->with('headerTransaction.customer', 'headerTransaction.headerPayment')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'orderNumber' => $item->order_number,
                    'customerName' => optional($item->headerTransaction)->customer->name,
                    'date' => $item->date,
                    'orderStatus' => $item->status,
                    'paymentStatus' => optional(optional($item->headerTransaction)->headerPayment)->payment_status,
                ];
            });

        // Query untuk mendapatkan total transaksi per bulan
        $currentMonthRevenue = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->selectRaw('WEEK(transactions.date, 1) - WEEK(DATE_SUB(transactions.date, INTERVAL DAYOFMONTH(transactions.date) - 1 DAY), 1) + 1 as week')
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) as total_amount')
            ->whereMonth('transactions.date', Carbon::now()->month)
            ->whereYear('transactions.date', Carbon::now()->year)
            ->groupByRaw('week')
            ->orderByRaw('week')
            ->get();

        $lastMonthRevenue = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->selectRaw('WEEK(transactions.date, 1) - WEEK(DATE_SUB(transactions.date, INTERVAL DAYOFMONTH(transactions.date) - 1 DAY), 1) + 1 as week')
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) as total_amount')
            ->whereMonth('transactions.date', Carbon::now()->month - 1)
            ->whereYear('transactions.date', Carbon::now()->year)
            ->groupByRaw('week')
            ->orderByRaw('week')
            ->get();

        // Query untuk mendapatkan jumlah transaksi yang sudah selesai
        $completeTransaction = Transaction::where('status', 'COMPLETED')
            ->whereBetween('date', [$currentMonthStartDate, $currentMonthEndDate])
            ->count();

        // Query untuk mendapatkan produk yang terjual
        $soldProducts = DetailTransaction::join('products', 'detail_transactions.product_id', '=', 'products.id')
            ->selectRaw('SUM(detail_transactions.quantity) AS total_sold, products.name')
            ->groupBy('products.name')
            ->get();

        // Query untuk mendapatkan total pendapatan bulanan
        $totalRevenue = Transaction::whereBetween('date', [$currentMonthStartDate, $currentMonthEndDate])
            ->get()
            ->sum(function ($transaction) {
                return $transaction->headerTransaction->total_price - optional($transaction->shipment)->price;
            });

        // Query untuk mendapatkan total produk yang terjual
        $totalSellProduct = DetailTransaction::join('transactions', 'detail_transactions.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.date', [$currentMonthStartDate, $currentMonthEndDate])
            ->sum('quantity');

        // Query untuk mendapatkan jumlah transaksi yang belum dibayar
        $notPaidTransaction = HeaderPayment::where('payment_status', 'NOT PAID')->count();

        // Data yang akan dikirim ke tampilan
        $data = [
            'activeOrder' => $activeOrder,
            'totalRevenue' => $totalRevenue,
            'completeTransaction' => $completeTransaction,
            'totalSellProduct' => $totalSellProduct,
            'notPaidTransaction' => $notPaidTransaction,
            'currentMonthRevenue' => $currentMonthRevenue,
            'soldProducts' => $soldProducts,
            'lastMonthRevenue' => $lastMonthRevenue,
        ];

        return Inertia::render('Home', $data);
    }

    public function orderDetailPage($id)
    {

        $ordercontroller = new OrderController();
        $dataOrder = $ordercontroller->getOrderDetailById($id);
        return Inertia::render('Home', ['data' => $dataOrder]);
    }
}
