@extends('layouts.app')
@section('title')
    {{__('messages.purchases.purchases_returns')}}
@endsection
@section('content')
<div class="container-fluid">
    <div class="card p-4">
        <div class="d-flex flex-column ">
            @include('flash::message')
            <livewire:purchases-returns-table/>
        </div>
    </div>
</div>
@endsection
