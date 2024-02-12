@extends('layouts.app')
@section('title')
    {{ __('messages.purchases.create_purchase_return') }}
@endsection
@section('header_toolbar')
    <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-between mb-5">
            <h1 class="mb-0">@yield('title')</h1>
            <div class="text-end">
                <a class="btn btn-outline-primary float-end"
                   href="{{ route('purchases-returns.index') }}">{{ __('messages.common.back') }}</a>
            </div>
        </div>
    </div>
@endsection
@section('content')
    <div class="container-fluid">
        <div class="d-flex flex-column">
            <div class="row">
                <div class="col-12">
                    @include('layouts.errors')
                    <div class="alert alert-danger display-none hide" id="validationErrorsBox"></div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    {{ Form::open(['route' => 'purchases-returns.store', 'id' => 'purchaseReturnForm', 'name' => 'purchaseReturnForm']) }}
                    @include('purchases-returns.fields')
                    {{ Form::close() }}
                </div>
            </div>
        </div>
    </div>
    @include('purchases-returns.purchase-return-modal')
@endsection
