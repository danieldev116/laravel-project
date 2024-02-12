@extends('layouts.app')
@section('title')
    {{ __('messages.units.units') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:units-table/>
            </div>
        </div>
    </div>
@include('units.create_modal')
@include('units.edit_modal')
@endsection
