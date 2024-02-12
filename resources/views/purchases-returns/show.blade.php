@extends('layouts.app')
@section('title')
    {{ __('messages.purchases.details_return')}}
@endsection
@section('header_toolbar')
    <div class="container-fluid">
        <div class="d-md-flex align-items-center justify-content-between mb-5">
            <h1 class="mb-0">@yield('title')</h1>
            <div class="text-end mt-4 mt-md-0">
                <a href="{{ url()->previous() }}"
                   class="btn btn-outline-primary">{{ __('messages.common.back') }}</a>
            </div>
        </div>
    </div>
@endsection
@section('content')
<div class="container-fluid">
    <div class="d-flex flex-column">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                   <div class="row">
                    <div class="col-12"><h4 class="font-weight-bold text-center mb-5">Purchase Return Details : {{ $purchase_return->reference_code}}</h4></div>
                   </div>
                   <div class="custom-line-height row">
                    <div class="col-md-4">
                        <h5 class="text-gray-600 bg-light p-4 mb-0 text-uppercase">Supplier Info</h5>
                        <div class="p-4">
                            <div class="d-flex align-items-center pb-1">
                                <i class="text-primary fa fa-user"></i>&nbsp; {{ $purchase_return->supplier->name}}
                            </div>
                            <div class="d-flex align-items-center pb-1">
                                <i class="text-primary fa fa-envelope"></i>&nbsp; {{ $purchase_return->supplier->email}}
                            </div>
                            <div class="d-flex align-items-center pb-1">
                                <i class="text-primary fa fa-mobile-alt"></i>&nbsp; {{ $purchase_return->supplier->phone}}
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="text-primary fa fa-location-dot"></i>&nbsp; {{ $purchase_return->supplier->address}}
                            </div>
                        </div>
                    </div>
                    <div class="m-md-0 m-4 col-md-4">
                        <h5 class="text-gray-600 bg-light p-4 mb-0 text-uppercase">Company Info</h5>
                        <div class="p-4">
                            <div class="d-flex align-items-center pb-1">
                                <i class="text-primary fa fa-user"></i>&nbsp; {{ $purchase_return->company_info['company_name'] ?? '' }}
                            </div>
                            <div class="d-flex align-items-center pb-1">
                                <i class="text-primary fa fa-envelope"></i>&nbsp; {{ $purchase_return->company_info['company_email'] ?? '' }}
                            </div>
                            <div class="d-flex align-items-center pb-1">
                                <i class="text-primary fa fa-mobile-alt"></i>&nbsp; {{ $purchase_return->company_info['company_phone'] ?? '' }}
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="text-primary fa fa-location-dot"></i>&nbsp; {{ $purchase_return->company_info['company_address'] ?? '' }}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h5 class="text-gray-600 bg-light p-4 mb-0 text-uppercase">Purchase Info</h5>
                        <div class="p-4">
                            <div class="pb-1">
                                <span class="me-2">Reference :</span><span>{{ $purchase_return->reference_code}}</span>
                            </div>
                            <div class="pb-1">
                                @php 
                                    $class = "success";
                                    if($purchase_return->status === 2) {
                                        $class = "info";
                                    } else if($purchase_return->status === 3) {
                                        $class = "warning";
                                    }
                                @endphp
                                <span class="me-2">Status :</span>
                                <span class="badge bg-light-{{$class}}">
                                    <span>{{ $purchase_return->status_label}}</span>
                                </span>
                            </div>
                            <div class="pb-1">
                                <span class="me-2">Warehouse :</span>
                                <span>{{ $purchase_return->Warehouse->name}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5">
                    <h5 class="text-gray-600 bg-light p-4 mb-4 text-uppercase">Order Summary</h5>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th  class="ps-3">{{ __('messages.purchases.purchase_product') }}</th>
                                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_net_unit_cost') }}</th>
                                    <th  class="ps-3">{{ __('messages.purchases.purchase_quantity') }}</th>
                                    <th  class="ps-3">{{ __('messages.purchases.purchase_unit_cost') }}</th>
                                    <th  class="ps-3">{{ __('messages.purchases.purchase_discount') }}</th>
                                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_tax') }}</th>
                                    <th colspan="2">{{ __('messages.purchases.purchase_column_subtotal') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($purchase_return->purchaseReturnItems as $pitem)
                                <tr class="align-middle">
                                    <td class="ps-3">{{ $pitem->product->name }}</td>
                                    <td> {{ getCurrencySymbol() }} {{ numberFormat($pitem->net_unit_cost) }}</td>
                                    <td>{{ $pitem->quantity }}</td>
                                    <td> {{ getCurrencySymbol() }} {{ numberFormat($pitem->product_cost) }}</td>
                                    <td> {{ getCurrencySymbol() }} {{ numberFormat($pitem->discount_amount) }}</td>
                                    <td> {{ getCurrencySymbol() }} {{ numberFormat($pitem->tax_amount) }}</td>
                                    <td> {{ getCurrencySymbol() }} {{ numberFormat($pitem->sub_total) }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-xxl-5 col-lg-6 col-md-6 col-12 float-end">
                    <div class="card">
                        <div class="card-body pt-7 pb-2">
                            <div class="table-responsive">
                                <table class="table border">
                                    <tbody>
                                        <tr>
                                            <td class="py-3">{{ __('messages.purchases.purchase_order_tax') }}</td>
                                            <td class="py-3">
                                                {{ getCurrencySymbol() }} {{ number_format($purchase_return->tax_amount, 2) }}
                                    ({{ number_format($purchase_return->tax_rate,2) }}) %
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="py-3">{{ __('messages.purchases.purchase_discount') }}</td>
                                            <td class="py-3">{{ getCurrencySymbol() }} {{ number_format($purchase_return->discount, 2) }}</td>
                                        </tr>
                                        <tr>
                                            <td class="py-3">{{ __('messages.purchases.purchase_shipping') }}</td>
                                            <td class="py-3">{{ getCurrencySymbol() }} {{ number_format($purchase_return->shipping,2) }}</td>
                                        </tr>
                                        <tr>
                                            <td class="py-3 text-primary">{{ __('messages.purchases.purchase_grand_total') }}</td>
                                            <td class="py-3 text-primary">{{ getCurrencySymbol() }} {{ number_format($purchase_return->grand_total,2) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
