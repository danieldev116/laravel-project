@extends('layouts.app')
@section('title')
    {{__('messages.sales.sales')}}
@endsection
@section('content')
<div class="container-fluid">
    <div class="card p-4">
        <div class="d-flex flex-column ">
            @include('flash::message')
            <livewire:sales-table/>
        </div>
    </div>
</div>
@endsection
