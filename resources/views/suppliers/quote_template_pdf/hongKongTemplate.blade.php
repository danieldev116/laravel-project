<!DOCTYPE HTML>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <link rel="icon" href="{{ asset('web/media/logos/favicon.ico') }}" type="image/png">
    <title>{{ __('messages.supplier.supplier_pdf') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/invoice-pdf.css') }}" rel="stylesheet" type="text/css" />
    <style>
        * {
            font-family: DejaVu Sans, Arial, "Helvetica", Arial, "Liberation Sans", sans-serif;
        }

        @if (getCurrencySymbol($supplier->tenant_id) == '€')
            .euroCurrency {
                font-family: Arial, "Helvetica", Arial, "Liberation Sans", sans-serif;
            }
        @endif
    </style>
</head>

<body>
    @php $styleCss = 'style'; @endphp
    <table width="100%">
        <tr>
            <td>
                <div class="logo"><img width="150px" src="{{ getLogoUrl($supplier->tenant_id) }}" alt=""></div>
            </td>
        </tr>
        <tr>
            <td>
                <span {{ $styleCss }}="">{{ html_entity_decode(getAppName($supplier->tenant_id)) }}</span><br>
                <b>{{ __('messages.common.address') . ':' }}&nbsp;</b>{{ $setting['company_address'] }}<br>
                <b>{{ __('messages.user.phone') . ':' }}&nbsp;</b>{{ $setting['company_phone'] }}<br>
                <div class="main-heading my-2"
                    {{ $styleCss }}="color: {{ $supplier_template_color }}; font-size: 30px">
                    {{ __('messages.supplier.supplier_name') }}</div>
                <strong>{{ __('messages.supplier.supplier_id') . ':' }}&nbsp;</strong>#{{ $supplier->supplier_id }}<br>
                <strong>{{ __('messages.supplier.supplier_date') . ':' }}
                    &nbsp;</strong>{{ \Carbon\Carbon::parse($supplier->supplier_date)->translatedFormat(currentDateFormat()) }}
                <br>
                <strong>{{ __('messages.supplier.due_date') . ':' }}
                    &nbsp;</strong>{{ \Carbon\Carbon::parse($supplier->due_date)->translatedFormat(currentDateFormat()) }}
                <br><br>
                <strong class="to-font-size">{{ __('messages.common.to') }}</strong><br>
                <b>{{ __('messages.common.name') . ':' }}&nbsp;</b>{{ $client->user->full_name }}
                <br>
                <b>{{ __('messages.common.email') . ':' }}&nbsp;</b>{{ $client->user->email }}
                @if (!empty($client->address))
                    <br><b>{{ __('messages.common.address') . ':' }}&nbsp;</b>{{ $client->address }}
                @endif
            </td>
        </tr>
    </table>
    <table width="100%">
        <tr class="invoice-items">
            <td colspan="2">
                <table class="items-table">
                    <thead>
                        <tr class="tu">
                            <th {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }};padding: 5px;">#
                            </th>
                            <th {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                {{ __('messages.product.product') }}</th>
                            <th class="number-align"
                                {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                {{ __('messages.invoice.qty') }}</th>
                            <th class="number-align"
                                {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                {{ __('messages.product.unit_price') }}</th>
                            <th class="number-align"
                                {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                {{ __('messages.invoice.amount') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if (isset($supplier) && !empty($supplier))
                            @foreach ($supplier->supplierItems as $key => $supplierItems)
                                <tr>
                                    <td
                                        {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                        {{ $key + 1 }}</td>
                                    <td
                                        {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                        {{ isset($supplierItems->product->name) ? $supplierItems->product->name : $supplierItems->product_name ?? __('messages.common.n/a') }}
                                        @if (
                                            !empty($supplierItems->product->description) &&
                                                (isset($setting['show_product_description']) && $setting['show_product_description'] == 1))
                                            <br><span
                                                style="font-size: 12px; word-break: break-all">{{ $supplierItems->product->description }}</span>
                                        @endif
                                    </td>
                                    <td class="number-align"
                                        {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                        {{ $supplierItems->quantity }}</td>
                                    <td class="number-align"
                                        {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                        <b
                                            class="euroCurrency">{{ isset($supplierItems->price) ? getCurrencyAmount($supplierItems->price, true) : __('messages.common.n/a') }}</b>
                                    </td>
                                    <td class="number-align"
                                        {{ $styleCss }}="border: 1px solid {{ $supplier_template_color }}; padding: 5px;">
                                        <b
                                            class="euroCurrency">{{ isset($supplierItems->total) ? getCurrencyAmount($supplierItems->total, true) : __('messages.common.n/a') }}</b>
                                    </td>
                                </tr>
                            @endforeach
                        @endif
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <table class="invoice-footer">
                    <tr>
                        <td class="font-weight-bold tu">{{ __('messages.supplier.amount') . ':' }}</td>
                        <td class="text-nowrap">
                            <b class="euroCurrency">{{ getCurrencyAmount($supplier->amount, true) }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold tu">{{ __('messages.supplier.discount') . ':' }}</td>
                        <td class="text-nowrap">
                            @if ($supplier->discount == 0)
                                <span>{{ __('messages.common.n/a') }}</span>
                            @else
                                @if (isset($supplier) && $supplier->discount_type == \App\Models\supplier::FIXED)
                                    <b
                                        class="euroCurrency">{{ isset($supplier->discount) ? getCurrencyAmount($supplier->discount, true) : __('messages.common.n/a') }}</b>
                                @else
                                    {{ $supplier->discount }}<span
                                        {{ $styleCss }}="font-family: DejaVu Sans">&#37;</span>
                                @endif
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold tu">{{ __('messages.supplier.total') . ':' }}</td>
                        <td class="text-nowrap">
                            <b class="euroCurrency">{{ getCurrencyAmount($supplier->final_amount, true) }}</b>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table class="w-100">
                    <tr>
                        <td>
                            <strong>{{ __('messages.client.notes') }} :</strong>
                            <p class="font-color-gray">{!! nl2br($supplier->note ?? __('messages.common.n/a')) !!}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>{{ __('messages.supplier.terms') }} :</strong><br>
                            <p class="font-color-gray">{!! nl2br($supplier->term ?? __('messages.common.n/a')) !!}</p>
                        </td>
                    </tr>
                </table>
                <br>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="vertical-align-bottom">
                <strong>{{ __('messages.common.regards') . ':' }}</strong><br>
                <br><span
                    {{ $styleCss }}="color: {{ $supplier_template_color }}">{{ getAppName($supplier->tenant_id) }}</span>
            </td>
        </tr>
    </table>
</body>

</html>
