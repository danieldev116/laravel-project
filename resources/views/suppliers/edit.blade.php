@extends('layouts.app')
@section('title')
    {{ __('messages.supplier.edit_supplier') }}
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
                        {{ Form::model($supplier, ['route' => ['suppliers.update', $supplier->id], 'id' => 'supplierEditForm']) }}
                        @include('suppliers.edit_fields')
                        {{ Form::close() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('suppliers.templates.templates')
    {{ Form::hidden('supplier_update_url',route('suppliers.update', ['supplier' => $supplier->id]),['id' => 'supplierUpdateUrl']) }}
    {{ Form::hidden('supplier_url',route('suppliers.index'),['id' => 'supplierUrl']) }}
    {{ Form::hidden('supplier_id',$supplier->id,['id' => 'supplierId']) }}
    {{ Form::hidden('clients',json_encode($clients, true),['id' => 'clients']) }}
    {{ Form::hidden('products',json_encode($associateProducts, true),['id' => 'products']) }}
    {{ Form::hidden('unique_id',$supplier->supplierItems->count() + 1 ,['id' => 'uniqueId']) }}
    {{ Form::hidden('supplier_note',isset($supplier->note) ? true : false ,['id' => 'supplierNoteData']) }}
    {{ Form::hidden('supplier_term',isset($supplier->term) ? true : false ,['id' => 'supplierTermData']) }}
    {{ Form::hidden('supplier_recurring',isset($supplier->recurring) ? true : false ,['id' => 'invoiceRecurring']) }}
    {{ Form::hidden('thousand_separator',getSettingValue('thousand_separator') ,['id' => 'thousandSeparator']) }}
    {{ Form::hidden('decimal_separator',getSettingValue('decimal_separator') ,['id' => 'decimalSeparator']) }}
    {{ Form::hidden('edit_due_date',$supplier->supplier_date ,['id' => 'editsupplierDateAdmin']) }}
    {{ Form::hidden('edit_due_date',$supplier->due_date ,['id' => 'editsupplierDueDateAdmin']) }}
@endsection
