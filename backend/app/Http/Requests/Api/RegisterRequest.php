<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name'                  => 'required|string|max:255',
            'phone'                 => ['nullable', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
            'email'                 => 'required|string|email|max:255|unique:users',
            'password'              => 'required|string|min:8|confirmed',
            'role'                  => 'required|in:عروس,مزود خدمة,إدارة',
            // حقول مزود الخدمة (اختيارية لتتوافق مع التسجيل العادي)
            'business_name'         => 'nullable|string|max:255',
            'service_type'          => 'nullable|string|max:100',
            'description'           => 'nullable|string|max:1000',
        ];

        // إجبارية فقط عند التسجيل كمزود خدمة
        if ($this->input('role') === 'مزود خدمة') {
            $rules['business_name'] = 'required|string|max:255';
            $rules['service_type']  = 'required|string|max:100';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'business_name.required' => 'اسم النشاط التجاري مطلوب.',
            'service_type.required'  => 'نوع الخدمة مطلوب.',
        ];
    }
}
