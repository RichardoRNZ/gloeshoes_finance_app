<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShippingController extends Controller
{
    //

    public function getShipmentByTransactionId($transactionId)
    {
        $shipment = Shipment::where('transaction_id', $transactionId)->get();
        return response()->json($shipment);
    }
    public function createNewShipment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'price' => 'required|numeric|min:1000',
            'receiptNumber' => 'required',
            'address' => 'required'

        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $shipment = [
            'name' => $request->name,
            'price' => $request->price,
            'receipt_number' => $request->receiptNumber,
            'shipping_address' => $request->address,
            'transaction_id' => $request->transactionId,
            'created_by' => $request->createdBy,
        ];

        Shipment::create($shipment);
        $transaction = Transaction::find($request->transactionId);
        $header = $transaction->headerTransaction;
        $header->total_price += $request->price;
        $header->updated_by = $request->createdBy;
        $header->save();
        $headerPayment = $header->headerPayment;
        $headerPayment->payment_remaining_amount += $request->price;
        $headerPayment->updated_by = $request->createdBy;
        $headerPayment->save();

        return response()->json(['message' => "Successfully create", 'shipment' => $shipment], 200);

    }

    public function updateShipment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'required',
            'price' => 'required|numeric|min:1000',
            'receiptNumber' => 'required',
            'address' => 'required'

        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $shipment = [
            'name' => $request->name,
            'price' => $request->price,
            'receipt_number' => $request->receiptNumber,
            'shipping_address' => $request->address,
            'updated_by' => $request->updatedBy,
        ];

        $existingShipment = Shipment::findOrFail($request->id);
        $transaction = $existingShipment->transaction;
        $header = $transaction->headerTransaction;
        $header->total_price = ($header->total_price - $existingShipment->price) + $request->price;
        $header->updated_by = $request->updatedBy;
        $header->save();
        $headerPayment = $header->headerPayment;
        $headerPayment->payment_remaining_amount = ($headerPayment->payment_remaining_amount - $existingShipment->price) + $request->price;
        $headerPayment->updated_by = $request->updatedBy;
        $headerPayment->save();
        $existingShipment->update($shipment);
        return response()->json(['message' => "Successfully update", 'shipment' => $shipment], 200);
    }

    public function deleteShipment($id)
    {
        $shipment = Shipment::findOrFail($id);
        $transaction = Transaction::find($shipment->transaction_id);
        $header = $transaction->headerTransaction;
        $header->total_price = $header->total_price - $shipment->price;
        $header->updated_by = "System";
        $header->save();
        $headerPayment = $header->headerPayment;
        $headerPayment->payment_remaining_amount -= $shipment->price;
        $headerPayment->updated_by = "System";
        $headerPayment->save();
        $shipment->delete();
        return response()->json(['message' => "Successfully delete", 'shipment' => $shipment], 200);
    }
}
