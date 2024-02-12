@extends('layouts.app')
@section('title')
    Transactions
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column">
                @include('flash::message')
                <livewire:transaction-table/>
            </div>
        </div>
    </div>
    @include('transactions.payment-notes-modal')
    {{ Form::hidden('currency', getCurrencySymbol(),['id' => 'currency']) }}
@endsection
