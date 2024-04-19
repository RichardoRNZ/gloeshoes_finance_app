<?php

namespace App\Http\Controllers;

use App\Models\HeaderPayment;
use App\Models\HeaderTransaction;
use App\Models\Payment;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    //
    public function getAllPaymentsByTransaction($headerTransactionId){
        $header = HeaderPayment::where('header_transaction_id', $headerTransactionId)->get();
        $payments =  $header->payments;
        return response()->json($payments);
    }
    private function handleFileUpload(Request $request)
    {
        if ($request->hasFile('transferReceipt')) {
            $fileObj = $request->file('transferReceipt');
            $name = $fileObj->getClientOriginalName();
            $ext = $fileObj->getClientOriginalExtension();
            $newFileName = $name . time() . '.' . $ext;
            $fileObj->storeAs('public/images', $newFileName);
            return $newFileName;
        }
        return null;
    }

    public function createPayment(Request $request){
        $validator = Validator::make($request->all(), [
            'paymentAmount'=>'required|numeric|min:1000',
            'description' => 'required',
            'transferReceipt' => 'required|image',
            'paymentDate' => 'required'

        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $headerTransaction = HeaderTransaction::findOrFail($request->headerId);
        $headerPayment = $headerTransaction->headerPayment;
        $transaction = $headerTransaction->transaction;

        if($request->paymentAmount> $headerPayment->payment_remaining_amount){
            return response()->json("Payment amount must lower than remaining amount", 500);
        }
        $payment = [
            'payment_amount' => $request->paymentAmount,
            'description' => $request->description,
            'transfer_receipt' => $this->handleFileUpload($request),
            'payment_date' =>  Carbon::createFromFormat('Y-m-d', $request->paymentDate),
            'header_id'=> $headerPayment->id,
            'created_by' => $request->createdBy,

        ];
        Payment::create($payment);
        $headerPayment->payment_remaining_amount -=$request->paymentAmount;
        $headerPayment->payment_status =$headerPayment->payment_remaining_amount >0 ? 'NOT PAID' : 'PAID';
        $headerPayment->updated_by = $request->createdBy;
        $headerPayment->save();
        $transaction->status = $transaction->status === "CREATED" ? "ON PROGRESS" : $transaction->status;
        $transaction->save();
        $headerTransaction->updated_by = $request->createdBy;
        $headerTransaction->save();

        return response()->json(['message' => "Successfully create", 'shipment' => $payment], 200);
    }

    public function deletePayment($id){
        $payment = Payment::findOrFail($id);
        $header = $payment->headerPayment;
        $header->payment_remaining_amount += $payment->payment_amount;
        $header->payment_status ="NOT PAID";
        $header->updated_by = "system";
        $header->save();
        $payment->delete();
        return response()->json(['message' => "Successfully delete",'shipment' => $payment], 200);
    }
}
