<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VendorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->role === 'مزود خدمة' || $user->role === 'إدارة')) {
            if ($user->status !== 'active' && $user->role !== 'إدارة') {
                return response()->json([
                    'message' => 'حسابك لا يزال قيد المراجعة. يرجى الانتظار حتى يتم تفعيله من قبل الإدارة.'
                ], 403);
            }
            return $next($request);
        }

        return response()->json([
            'message' => 'عذراً، هذه الصفحة مخصصة لمزودي الخدمات فقط.'
        ], 403);
    }
}
