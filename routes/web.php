<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
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
Route::get('/login', [AuthController::class,'loginIndex'])->name('login-page')->middleware('guest');
Route::post('/login', [AuthController::class,'login'])->name('login');
Route::get('/logout', [AuthController::class,'logout'])->name('logout');

// DASHBOARD
Route::get('/dashboard', [DashboardController::class,'index'])->name('dashboard')->middleware('auth');

// CUSTOMER
Route::get('/customer', [CustomerController::class,'index'])->name('customers')->middleware('auth');
Route::get('/customer/all', [CustomerController::class,'getAllCustomer'])->name('customers_data')->middleware('auth');
Route::post('/customers', [CustomerController::class,'createCustomer'])->name('add_customer')->middleware('auth');
Route::put('/customers/update', [CustomerController::class,'updateCustomer'])->name('update_customer')->middleware('auth');
Route::delete('/customers/{id}', [CustomerController::class,'deleteCustomer'])->name('delete_customer')->middleware('auth');

// PRODUCT
Route::get('/product', [ProductController::class,'index'])->name('products')->middleware('auth');
Route::get('/product/all', [ProductController::class,'getAllProducts'])->name('products_data')->middleware('auth');
Route::get('/product/{id}', [ProductController::class,'getProductById'])->name('products_details')->middleware('auth');
Route::post('/product', [ProductController::class,'createNewProduct'])->name('add_product')->middleware('auth');
Route::post('/product/update', [ProductController::class,'updateProduct'])->name('update_products')->middleware('auth');
Route::delete('/product/delete/{id}', [ProductController::class,'deleteProductById'])->name('delete_products')->middleware('auth');
