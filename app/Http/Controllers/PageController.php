<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    //
    public function mainPage(){
        return Inertia::render('Home');
    }
    public function loginPage(){
        return Inertia::render('Login');
    }
    public function orderDetailPage($id){

        $ordercontroller = new OrderController();
        $dataOrder = $ordercontroller->getOrderDetailById($id);
        return Inertia::render('Home',['data'=>$dataOrder]);
    }
}
