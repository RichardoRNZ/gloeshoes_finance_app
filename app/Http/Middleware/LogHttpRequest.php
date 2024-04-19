<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogHttpRequest
{
    public function handle($request, Closure $next)
    {
        Log::info('HTTP request:', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'parameters' => $request->all(),
            // And any other information you want to log
        ]);

        return $next($request);
    }
}
