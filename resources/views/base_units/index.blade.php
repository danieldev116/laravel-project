@extends('layouts.app')
@section('title')
    {{ __('messages.units.base_units') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:base-units-table/>
            </div>
        </div>
    </div>
@include('base_units.create_modal')
@include('base_units.edit_modal')
@endsection
