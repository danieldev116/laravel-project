@extends('layouts.app')
@section('title')
    {{ __('messages.expenses.edit_expense') }}
@endsection
@section('header_toolbar')
@endsection
@section('content')
    <div class="container-fluid">
        <div class="d-flex flex-column">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-end mb-5">
                    <h1>@yield('title')</h1>
                    <a class="btn btn-outline-primary float-end"
                       href="{{ url()->previous() }}">{{ __('messages.common.back') }}</a>
                </div>
                <div class="col-12">
                    @include('layouts.errors')
                </div>
                <div class="card">
                    <div class="card-body">
                        {{ Form::model($expense, ['route' => ['expenses.update', $expense->id], 'id' => 'edit_expenseForm']) }}
                        @include('expense.edit_fields')
                        {{ Form::close() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{ Form::hidden('expense_update_url',route('expenses.update', ['expense' => $expense->id]),['id' => 'expenseUpdateUrl']) }}
@endsection
