<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $status = $request->role === 'مزود خدمة' ? 'pending' : 'active';

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'status'   => $status,
        ]);

        // إنشاء سجل Vendor إذا كان المستخدم مزود خدمة
        if ($request->role === 'مزود خدمة') {
            Vendor::create([
                'user_id'       => $user->id,
                'business_name' => $request->business_name ?? $request->name,
                'service_type'  => $request->service_type ?? 'عام',
                'description'   => $request->description,
                'status'        => 'pending',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user->load('vendor'),
        ]);
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email'    => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['البريد الإلكتروني أو كلمة المرور غير صحيحة.'],
                ]);
            }

            if ($user->role === 'مزود خدمة' && $user->status === 'pending') {
                throw ValidationException::withMessages([
                    'email' => ['حسابك قيد المراجعة حالياً. يرجى الانتظار حتى يتم تفعيله.'],
                ]);
            }

            if ($user->status === 'rejected') {
                throw ValidationException::withMessages([
                    'email' => ['تم رفض حسابك. يرجى التواصل مع الإدارة.'],
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user->load('vendor'),
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ تقني أثناء تسجيل الدخول: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح.'
        ]);
    }

    public function user(Request $request)
    {
        return $request->user()->load('vendor');
    }
}
