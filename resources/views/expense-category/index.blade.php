@extends('layouts.app')
@section('title')
    {{ __('messages.expenses.create_expense_category') }}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card p-4">
            <div class="d-flex flex-column ">
                @include('flash::message')
                <livewire:expense-category-table/>
            </div>
        </div>
    </div>
@include('expense-category.create_modal')
@include('expense-category.edit_modal')
@endsection
