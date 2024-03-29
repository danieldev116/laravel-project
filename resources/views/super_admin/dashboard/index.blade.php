@extends('layouts.app')
@section('title')
    {{ __('messages.dashboard') }}
@endsection
@section('content')
<div class="container-fluid">
    <div class="d-flex flex-column">
        <div class="row">
            <div class="col-12">
                <div class="row g-4">
                    <div class="col-xxl-3 col-xl-4 col-sm-6 widget">
                        <a href="{{ route('users.index') }}" class="mb-xl-8 text-decoration-none">
                            <div class="card shadow-md rounded-10 p-xxl-10 p-10 d-flex flex-row align-items-center justify-content-between my-3">
                                <div class="text-white">
                                    <h3 class="fs-6 fw-light fw-bolder text-dark">{{ __('messages.total_users') }}</h3>
                                    <h2 class="mb-0 fs-1-xxl text-dark"> {{ formatTotalAmount($data['users']) }}</h2>
                                </div>
                                <div class="bg-cyan-300 widget-icon rounded-circle round-shadow p-4 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-user card-icon text-white"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="col-xxl-3 col-xl-4 col-sm-6 widget">
                        <a href="{{ route('subscriptions.transactions.index') }}" class="mb-xl-8 text-decoration-none">
                            <div class="card shadow-md rounded-10 p-xxl-10 p-10 d-flex flex-row align-items-center justify-content-between my-3">
                                <div class="text-white">
                                    <h3 class="fs-6 fw-light fw-bolder text-dark">{{ __('messages.total_revenue') }}</h3>
                                    <h2 class="mb-0 fs-1-xxl text-dark">{{ formatTotalAmount($data['revenue']) }}</h2>
                                </div>
                                <div class="bg-green-300 widget-icon rounded-circle round-shadow p-4 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-rupee-sign card-icon text-white"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="col-xxl-3 col-xl-4 col-sm-6 widget">
                        <a href="{{ route('subscription-plans.index') }}" class="mb-xl-8 text-decoration-none">
                            <div class="card shadow-md rounded-10 p-xxl-10 p-10 d-flex flex-row align-items-center justify-content-between my-3">
                                <div class="text-white">
                                    <h3 class="fs-6 fw-light fw-bolder text-dark">{{ __('messages.total_active_user_plan') }}</h3>
                                    <h2 class="mb-0 fs-1-xxl text-dark">{{ formatTotalAmount($data['activeUserPlan']) }}</h2>
                                </div>
                                <div class="bg-blue-300 widget-icon rounded-circle round-shadow p-4 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-toggle-on card-icon text-white"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-12 mb-4">
                <div class="">
                    <div class="card mt-1">
                        <div class="card-body p-5">
                            <div class="card-header border-0 pt-5">
                                <h3 class="mb-0">{{  __('messages.admin_dashboard.revenue_overview') }}</h3>
                                <div class="ms-auto">
                                    <div id="rightData" class="date-picker-space">
                                        <input class="form-control removeFocus" id="super_admin_time_range">
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-lg-6 p-0">
                                <div class="">
                                    <div id="revenue_overview-container" class="pt-2">
                                        <canvas id="revenue_chart_canvas" height="200" width="905"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
    {{ Form::hidden('currency',  getCurrencySymbol(),['id' => 'currency']) }}
    {{ Form::hidden('currency_position',  superAdminCurrencyPosition(),['id' => 'currency_position']) }}
@endsection
