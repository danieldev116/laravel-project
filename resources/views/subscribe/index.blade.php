@extends('layouts.app')
@section('title')
    {{ __('messages.subscribe.subscribers') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card py-4 px-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:subscriber-table/>
            </div>
        </div>
    </div>
@endsection
