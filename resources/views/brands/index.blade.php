@extends('layouts.app')
@section('title')
    {{ __('messages.brands.brands') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:brands-table/>
            </div>
        </div>
    </div>
@include('brands.create_modal')
@include('brands.edit_modal')
@endsection
