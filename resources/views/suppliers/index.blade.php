@extends('layouts.app')
@section('title')
    {{__('messages.suppliers.suppliers')}}
@endsection
@section('content')
<div class="container-fluid">
    <div class="card p-4">
        <div class="d-flex flex-column ">
            @include('flash::message')
            <livewire:suppliers-table/>
        </div>
    </div>
</div>
{{-- @include('quotes.templates.templates') --}}
{{-- {{ Form::hidden('currency', getCurrencySymbol(),['id' => 'currency']) }}
{{ Form::hidden('status',  $status,['id' => 'status']) }} --}}

@endsection
