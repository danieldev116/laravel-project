@extends('layouts.app')
@section('title')
    {{__('messages.super_admins')}}
@endsection
@section('content')
    <div class="container-fluid">
        <div class="card d-flex flex-column py-3 px-4">
            @include('flash::message')
            <livewire:super-admin-table/>
        </div>
    </div>
@endsection
