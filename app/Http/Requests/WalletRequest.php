<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WalletRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:cash,bank,ewallet'],
            'name' => ['required', 'string', 'max:80'],
            'account_number' => ['nullable', 'string', 'max:80'],
            'balance' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
