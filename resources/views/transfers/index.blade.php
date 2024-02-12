@extends('layouts.app')
@section('title')
    {{__('messages.transfers.transfers')}}
@endsection
@section('content')
<div class="container-fluid">
    <div class="card p-4">
        <div class="d-flex flex-column ">
            @include('flash::message')
            <livewire:transfers-table/>
        </div>
    </div>
</div>

@endsection
