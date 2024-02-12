@extends('layouts.app')
@section('title')
    {{ __('messages.purchases.edit_purchase') }}
@endsection
@section('header_toolbar')
@endsection
@section('content')
    <div class="container-fluid">
        <div class="d-flex flex-column">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-end mb-5">
                    <h1>@yield('title')</h1>
                    <a class="btn btn-outline-primary float-end"
                       href="{{ url()->previous() }}">{{ __('messages.common.back') }}</a>
                </div>
                <div class="col-12">
                    @include('layouts.errors')
                </div>
                <div class="card">
                    <div class="card-body">
                        {{ Form::model($purchase, ['route' => ['purchases.update', $purchase->id], 'id' => 'purchaseEditForm']) }}
                        @method('put')
                        @include('purchases.fields')
                        {{ Form::close() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('purchases.purchase-modal')
@endsection
