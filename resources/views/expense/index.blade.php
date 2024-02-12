@extends('layouts.app')
@section('title')
    {{ __('messages.expenses.create_expense') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:expense-table/>
            </div>
        </div>
    </div>

@endsection
