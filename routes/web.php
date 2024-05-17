<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ShippingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/token', function () {
    return csrf_token();
});

// AUTH
Route::get('/login', [PageController::class,'loginPage'])->name('login-page')->middleware('guest');
Route::post('/login', [AuthController::class,'login'])->name('login');
Route::get('change/user/page',[PageController::class,'mainPage'])->name('change_user_page')->middleware('auth');
Route::put('change/user', [AuthController::class,'changeUserData'])->middleware('auth');
Route::get('/logout', [AuthController::class,'logout'])->name('logout');

// DASHBOARD
Route::get('/dashboard', [PageController::class,'dashboardPage'])->name('dashboard')->middleware('auth');

// CUSTOMER
Route::get('/customer', [PageController::class,'mainPage'])->name('customers')->middleware('auth');
Route::get('/customer/all', [CustomerController::class,'getAllCustomer'])->name('customers_data')->middleware('auth');
Route::get('/customers/data', [CustomerController::class,'getAllCustomerData'])->name('customers_data')->middleware('auth');
Route::post('/customers', [CustomerController::class,'createCustomer'])->name('add_customer')->middleware('auth');
Route::get('/customers/export', [CustomerController::class,'exportCustomersData'])->name('export_customers')->middleware('auth');
Route::put('/customers/update', [CustomerController::class,'updateCustomer'])->name('update_customer')->middleware('auth');
Route::delete('/customers/{id}', [CustomerController::class,'deleteCustomer'])->name('delete_customer')->middleware('auth');

// PRODUCT
Route::get('/product', [PageController::class,'mainPage'])->name('products')->middleware('auth');
Route::get('/product/all', [ProductController::class,'getAllProducts'])->name('products_data')->middleware('auth');
Route::get('/products/data', [ProductController::class,'getAllProductsData'])->name('products_data')->middleware('auth');
Route::get('/product/{id}', [ProductController::class,'getProductById'])->name('products_details')->middleware('auth');
Route::get('/products/export', [ProductController::class,'exportProductData'])->name('export_products')->middleware('auth');
Route::post('/product', [ProductController::class,'createNewProduct'])->name('add_product')->middleware('auth');
Route::post('/product/update', [ProductController::class,'updateProduct'])->name('update_products')->middleware('auth');
Route::delete('/product/delete/{id}', [ProductController::class,'deleteProductById'])->name('delete_products')->middleware('auth');

//Order
Route::get('/orders', [PageController::class,'mainPage'])->name('orders')->middleware('auth');
Route::get('/order/detail-page/{id}', [PageController::class,'orderDetailPage'])->name('detail_page')->middleware('auth');
Route::get('order/detail/{id}', [OrderController::class,'getOrderDetailById'])->middleware('auth')->name('order_detail');
Route::get('/order', [OrderController::class,'getAllOrders'])->name('orders_data')->middleware('auth');
Route::get('/order/{id}/products', [OrderController::class,'getOrderedProduct'])->name('order_products_data')->middleware('auth');
Route::post('/order/vendor/download', [OrderController::class,'downloadVendorForm'])->middleware('auth');
Route::post('/order', [OrderController::class,'createNewOrder'])->name('new_orders')->middleware('auth');
Route::post('order/add/product',[OrderController::class,'addOrderProduct'])->name('add_order_product')->middleware('auth');
Route::put('order/update/status',[OrderController::class,'updateStatusOrder'])->name('status')->middleware('auth');
Route::put('order/update/customer',[OrderController::class,'changeCustomer'])->name('customer_change')->middleware('auth');
Route::put('order/update/product',[OrderController::class,'updateOrderProduct'])->name('update_order_product')->middleware('auth');
Route::delete('order/delete/product/{id}',[OrderController::class,'deleteOrderProduct'])->name('delete_order_product')->middleware('auth');
Route::delete('order/delete/{id}', [OrderController::class,'deleteOrderById'])->name('delete_order')->middleware('auth');
// Shipping
Route::get('/order/shipping/{transactionId}', [ShippingController::class,'getShipmentByTransactionId'])->name('shipping')->middleware('auth');
Route::post('/order/shipping', [ShippingController::class,'createNewShipment'])->name('create_shipping')->middleware('auth');
Route::put('order/shipping/update', [ShippingController::class,'updateShipment'])->name('shipping_update')->middleware('auth');
Route::delete('order/shipping/delete/{id}', [ShippingController::class,'deleteShipment'])->name('shipping_delete')->middleware('auth');

// Payment
Route::post('order/payment',[PaymentController::class,'createPayment'])->name('add_payment')->middleware('auth');
Route::delete('order/payment/delete/{id}',[PaymentController::class,'deletePayment'])->name('delete_payment')->middleware('auth');
// invoice
Route::get('order/invoice/{id}/send',[OrderController::class,'sendInvoiceByEmail'])->name('send_inovoice')->middleware('auth');
Route::get('order/invoice/{id}/download',[OrderController::class,'downloadInvoice'])->name('download_inovoice')->middleware('auth');

//Report
Route::get('/reports', [PageController::class,'mainPage'])->name('reports')->middleware('auth');
Route::get('/report/data', [ReportController::class,'getReport'])->name('reports_data')->middleware('auth');
Route::get('/report/download', [ReportController::class,'generateReport'])->name('download_report')->middleware('auth');

