<?php

namespace App\Http\Controllers;

use App\Exports\OrderReportExport;
use App\Exports\SalesReport;
use App\Models\DetailTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    //
    public function getReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'startDate' => 'required|date',
            'endDate' => 'required|date',
            'type' =>'required',
        ]);
        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $startDate = Carbon::createFromFormat('Y-m-d', $request->input('startDate'));
        $endDate = Carbon::createFromFormat('Y-m-d', $request->input('endDate'));
        $type = $request->input('type');

        $dataByType = [];
        $totalTransactionData = [];
        $soldProducts = [];

        if ($type === 'Monthly Revenue' || $type === 'Annual Revenue') {
            [$totalTransactionData, $soldProducts, $dataByType] = $this->getRevenueData($startDate, $endDate, $type);
        } elseif ($type === 'Monthly Gross Profit' || $type === 'Annual Gross Profit') {
            [$totalTransactionData, $soldProducts, $dataByType] = $this->getProfitData($startDate, $endDate, $type);
        }

        $data = [
            'totalTransactionData' => $totalTransactionData,
            'soldProducts' => $soldProducts,
            'dataByType' => $dataByType
        ];
        // print_r(['start'=> Carbon::parse($startDate->copy()->subMonths())->format('Y-m-d'), 'end'=> Carbon::parse($endDate->copy()->subMonths())->format('Y-m-d')]);

        return response()->json($data);
    }
    private function getRevenueData($startDate, $endDate, $type)
    {
        $groupBy = $type === 'Monthly Revenue' ? "CONCAT('Week ',WEEK(transactions.date, 1) - WEEK(DATE_SUB(transactions.date, INTERVAL DAYOFMONTH(transactions.date) - 1 DAY), 1)+1)" : 'MONTHNAME(transactions.date)';
        // $groupBy = $type === 'Monthly Revenue' ? 'WEEKOFYEAR(transactions.date)' : 'MONTHNAME(transactions.date)';

        $totalTransactionData = Transaction::select(DB::raw("COUNT(id) AS totalTransaction, $groupBy as groupByColumn"))
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('groupByColumn')
            ->orderBy('groupByColumn')
            ->get();

        $soldProducts = DetailTransaction::join('products', 'detail_transactions.product_id', '=', 'products.id')
            ->join('transactions', 'detail_transactions.transaction_id', '=', 'transactions.id')
            ->selectRaw('SUM(detail_transactions.quantity) AS total_sold, products.name')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('products.name')
            ->get();
        $currentRevenue = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->selectRaw("$groupBy as groupByColumn")
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) as total_amount')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupByRaw('groupByColumn')
            ->orderByRaw('groupByColumn')
            ->get();

        $lastRevenue = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->selectRaw("$groupBy as groupByColumn")
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) as total_amount')
            ->whereBetween('date', [$type === 'Monthly Revenue' ? $startDate->copy()->subMonths() : $startDate->copy()->subYear(), $type === 'Monthly Revenue' ? $endDate->copy()->subMonths() : $endDate->copy()->subYear()])
            ->groupByRaw('groupByColumn')
            ->orderByRaw('groupByColumn')
            ->get();

        $completeTransaction = Transaction::where('status', 'COMPLETED')
            ->whereBetween('date', [$startDate, $endDate])
            ->count();

        $totalCurrentRevenue = $currentRevenue->sum('total_amount');
        $lastRevenueSum = $lastRevenue->sum('total_amount');
        $totalPecentage = $lastRevenueSum !== 0 ? (($totalCurrentRevenue - $lastRevenueSum) / $lastRevenueSum) * 100 : 100;

        $detailType = [
            'Complete Transaction' => $completeTransaction,
            'Total Current Revenue' => $totalCurrentRevenue,
            'Revenue Pecentage' => round($totalPecentage, 2),
        ];

        $dataByType = [
            'currentRevenue' => $currentRevenue,
            'lastRevenue' => $lastRevenue,
            'detailCardData' => $detailType,

        ];

        $detailType = [
            'Complete Transaction' => $completeTransaction,
            'Total CurrentRevenue' => $totalCurrentRevenue,
            'Total Pecentage' => round($totalPecentage, 2),
        ];

        $totalCurrentRevenue = $currentRevenue->sum('total_amount');
        $lastRevenueSum = $lastRevenue->sum('total_amount');
        $totalPecentage = $lastRevenueSum !== 0 ? (($totalCurrentRevenue - $lastRevenueSum) / $lastRevenueSum) * 100 : 100;
        $dataByType = [
            'currentData' => $currentRevenue,
            'lastData' => $lastRevenue,
            'detailCardData' => $detailType,
        ];

        return [$totalTransactionData, $soldProducts, $dataByType];
    }
    private function getProfitData($startDate, $endDate, $type)
    {
        $groupBy = $type === 'Monthly Gross Profit' ? "CONCAT('Week ',WEEK(transactions.date, 1) - WEEK(DATE_SUB(transactions.date, INTERVAL DAYOFMONTH(transactions.date) - 1 DAY), 1)+1)" : 'MONTHNAME(transactions.date)';

        $totalTransactionData = Transaction::select(DB::raw("COUNT(id) AS totalTransaction, $groupBy as groupByColumn"))
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('groupByColumn')
            ->orderBy('groupByColumn')
            ->get();

        $soldProducts = DetailTransaction::join('products', 'detail_transactions.product_id', '=', 'products.id')
            ->join('transactions', 'detail_transactions.transaction_id', '=', 'transactions.id')
            ->selectRaw('SUM(detail_transactions.quantity) AS total_sold, products.name')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('products.name')
            ->get();

        $currentGrossProfit = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->join('detail_transactions', 'transactions.id', '=', 'detail_transactions.transaction_id')
            ->join('products', 'detail_transactions.product_id', '=', 'products.id')
            ->selectRaw("$groupBy as groupByColumn")
            ->selectRaw('SUM(products.cost * detail_transactions.quantity) AS total_cost')
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) - SUM(products.cost * detail_transactions.quantity) AS gross_profit')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupByRaw('groupByColumn')
            ->orderByRaw('groupByColumn')
            ->get();

        $lastGrossProfit = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->join('detail_transactions', 'transactions.id', '=', 'detail_transactions.transaction_id')
            ->join('products', 'detail_transactions.product_id', '=', 'products.id')
            ->selectRaw("$groupBy as groupByColumn")
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) - SUM(products.cost * detail_transactions.quantity) AS gross_profit')
            ->whereBetween('date', [$type === 'Monthly Gross Profit' ? $startDate->copy()->subDays(30) : $startDate->copy()->subYear(), $startDate])
            ->groupByRaw('groupByColumn')
            ->orderByRaw('groupByColumn')
            ->get();

        $totalCost = $currentGrossProfit->sum('total_cost');
        $lastGrossProfitSum = $lastGrossProfit->sum('gross_profit');
        $totalPecentage = $lastGrossProfitSum !== 0 ? (($currentGrossProfit->sum('gross_profit') - $lastGrossProfitSum) / $lastGrossProfitSum) * 100 : 100;

        $detailType = [
            'Total Cost' => $totalCost,
            'Total Gross Profit' => $currentGrossProfit->sum('gross_profit'),
            'Profit Pecentage' => round($totalPecentage, 2),
        ];

        $dataByType = [
            'currentData' => $currentGrossProfit,
            'lastData' => $lastGrossProfit,
            'detailCardData' => $detailType
        ];
        return [$totalTransactionData, $soldProducts, $dataByType];
    }
    private function downloadTransactionReport($startDate, $endDate)
    {

        // return Transaction::whereBetween('date', [$startDate, $endDate])->with(['headerTransaction', 'detailTransaction', 'headerTransaction.headerPayment', 'detailTransaction.product', 'headerTransaction.customer'])->get();
        return Excel::download(new OrderReportExport($startDate, $endDate), "OrderReport.xlsx");
    }
    private function downloadProfitReport($startDate, $endDate, $type)
    {
        $groupBy = $type === 'Monthly Gross Profit' ? "CONCAT('Minggu ',WEEK(transactions.date, 1) - WEEK(DATE_SUB(transactions.date, INTERVAL DAYOFMONTH(transactions.date) - 1 DAY), 1)+1)" : 'MONTHNAME(transactions.date)';
        $grossProfit = Transaction::join('header_transactions', 'transactions.header_id', '=', 'header_transactions.id')
            ->leftJoin('shipments', 'transactions.id', '=', 'shipments.transaction_id')
            ->join('detail_transactions', 'transactions.id', '=', 'detail_transactions.transaction_id')
            ->join('products', 'detail_transactions.product_id', '=', 'products.id')
            ->selectRaw("$groupBy as groupByColumn")
            ->selectRaw('SUM(detail_transactions.quantity) AS total_sales')
            ->selectRaw('SUM(products.price) AS price')
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) as total_amount')
            ->selectRaw('SUM(products.cost * detail_transactions.quantity) AS total_cost')
            ->selectRaw('SUM(header_transactions.total_price - IFNULL(shipments.price, 0)) - SUM(products.cost * detail_transactions.quantity) AS gross_profit')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupByRaw('groupByColumn')
            ->orderByRaw('groupByColumn')
            ->get();
        $totalSales =  DetailTransaction::join('products', 'detail_transactions.product_id', '=', 'products.id')
        ->join('transactions', 'detail_transactions.transaction_id', '=', 'transactions.id')
        ->selectRaw('products.name,SUM(detail_transactions.quantity) AS total_sold')
        ->selectRaw('products.price')
        ->selectRaw('SUM(detail_transactions.quantity*products.price) AS total_revenue')
        ->whereBetween('date', [$startDate, $endDate])
        ->groupBy('products.name','products.price')
        ->get();

        $grossProfit->push(['groupByColumn' => 'Total', 'total_sales' => $grossProfit->sum('total_sales'),'price'=>$grossProfit->sum('price'), 'total_amount' =>  $grossProfit->sum('total_amount'), 'total_cost' =>  $grossProfit->sum('total_cost'), 'gross_profit' =>  $grossProfit->sum('gross_profit')]);
        $totalSales->push(['Total Pendapatan'=>$totalSales->sum('Total Revenue')]);
        return Excel::download(new SalesReport($grossProfit, $totalSales,$startDate,$endDate), "ProfitReport.xlsx");
    }
    public function generateReport(Request $request)
    {
        $startDate = Carbon::createFromFormat('Y-m-d', $request->input('startDate'));
        $endDate = Carbon::createFromFormat('Y-m-d', $request->input('endDate'));
        if ($request->input('type') === 'Monthly Revenue' || $request->input('type') === 'Annuall Revenue') {
            return $this->downloadTransactionReport($startDate, $endDate);
        } else {
            return $this->downloadProfitReport($startDate, $endDate, $request->input('type'));
        }
    }

}
