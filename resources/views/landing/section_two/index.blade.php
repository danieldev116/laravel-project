@extends('layouts.app')
@section('title')
    {{ __('messages.landing_cms.section_two') }}
@endsection
@section('content')
<section id="features">
    <div class="container-fluid">
        <div class="d-flex flex-column">
            @include('flash::message')
            @include('layouts.errors')
            {{ Form::open(['route' => ['super.admin.section.two.update'],' method' => 'POST', 'files' => true]) }}
            @method('PUT')
            @include('landing.section_two.field')
            {{ Form::close() }}
        </div>
    </div>
</section>
@endsection
