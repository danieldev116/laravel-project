@extends('layouts.app')
@section('title')
    {{ __('messages.taxes') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:tax-table />
            </div>
        </div>
    </div>
    @include('taxes.create_modal')
    @include('taxes.edit_modal')
@endsection
