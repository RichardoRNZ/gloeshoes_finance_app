<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    //

    public function login(Request $request)
    {
        try {
            $credentials = [
                'username' => $request->username,
                'password' => $request->password,
            ];
            if (auth()->attempt($credentials)) {
                Session::put('user', $request->username);
                Cookie::queue('user', $request->username, 120);
                return response()->json(['success' => "Login Success"], 200);
            }

            // if($request->cookie('user')){
            //     return response()->json(['success' => "Login Success"], 200);
            // }
            throw new \Exception('Incorrect username or password');
        } catch (\Exception $th) {
            return response()->json(['error' => $th->getMessage()], 401);
        }


    }

    public function logout(){
        Auth::logout();
        Cookie::queue(Cookie::forget('user'));
        Session::flush();
        return redirect()->route('login');
    }
}
