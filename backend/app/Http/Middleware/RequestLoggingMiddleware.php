<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequestLoggingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Log para arquivo usando error_log
        error_log("REQUEST: " . $request->getMethod() . " " . $request->getPathInfo());
        error_log("BODY: " . $request->getContent());
        
        try {
            $response = $next($request);
            error_log("RESPONSE: " . $response->getStatusCode());
            return $response;
        } catch (\Exception $e) {
            error_log("ERROR: " . $e->getMessage());
            error_log("FILE: " . $e->getFile() . " LINE: " . $e->getLine());
            throw $e;
        }
    }
}
