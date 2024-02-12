@extends('layouts.app')
@section('title')
    {{ __('messages.suppliers.supplier_details')}}
@endsection
@section('header_toolbar')
    <div class="container-fluid">
        <div class="d-md-flex align-items-center justify-content-between mb-5">
            <h1 class="mb-0">@yield('title')</h1>
            <div class="text-end mt-4 mt-md-0">
                @if($supplier->status != \App\Models\supplier::CONVERTED)
                    <a href="{{ route('suppliers.edit', ['supplier' => $supplier->id]) }}"
                       class="btn btn-primary me-4" data-turbo="false">{{__('messages.common.edit')}}</a>
                @endif
                <a href="{{ url()->previous() }}"
                   class="btn btn-outline-primary">{{ __('messages.common.back') }}</a>
            </div>
        </div>
    </div>
@endsection
@section('content')
    <div class="container-fluid">
        <div class="d-flex flex-column">
            @include('flash::message')
            @include('suppliers.show_fields',['isPublicView'=> true])
        </div>
    </div>
@endsection
