@php
    $notifications = getNotification();
    $notificationCount = count($notifications);
    $styleCss = 'style';
@endphp
<header class='header p-4 d-flex align-items-start w-100'>
    <div class="d-flex align-items-center justify-content-between flex-grow-1 w-100">
        <div class="m-0 d-flex align-items-center ">
            <button type="button" class="btn burger-menu px-0 aside-menu-container__aside-menubar d-block sidebar-btn">
                <i class="fas fa-exchange-alt"></i>
            </button>
           <div class="page-hedding ps-3">
                <h3 class="mb-0 text-white">@yield('title')</h3>
                <p class="mb-0">Welcome To UNIFY Admin Panel</p>
           </div>
        </div>
        <div class="m-0 ps-4 d-flex align-items-center ">
            <nav class="navbar navbar-expand-xl navbar-light top-navbar d-xl-flex d-block px-3 px-xl-0 py-4 py-xl-0 "
                id="nav-header">
                <div class="container-fluid pe-0">
                    @role('admin')
                        <div class="d-sm-flex d-none align-items-stretch dropdown me-2">
                            <button class="btn btn btn-icon btn-primary text-white dropdown-toggle hide-arrow ps-2 pe-0"
                                type="button" data-bs-auto-close="outside" data-bs-toggle="dropdown" aria-expanded="false"
                                id="quickLinksID">
                                <span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="{{ __('messages.quick_links') }}">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </button>
                            <div x-placement="bottom-start" aria-labelledby="quickLinksID"
                                class="shortcut-menu dropdown-menu px-3 py-3" data-popper-reference-hidden="false"
                                data-popper-escaped="false" data-popper-placement="bottom-start"
                                style="position: absolute; inset: 0px auto auto 0px; transform: translate(0px, 44px);">
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('invoices.index') }}">
                                    <a class="nav-link px-4" href="{{ route('invoices.index') }}">
                                        <span class="dropdown-icon me-4">
                                            <i class="fa-solid far fa-file-alt pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.invoices') }}</span>
                                    </a>
                                </a>
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('quotes.index') }}">
                                    <a class="nav-link px-4" href="{{ route('quotes.index') }}">
                                        <span class="dropdown-icon me-4">
                                            <i class="fa-solid fas fa-quote-left pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.quotes') }}</span>
                                    </a>
                                </a>
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('products.index') }}">
                                    <a class="nav-link px-4" href="{{ route('products.index') }}">
                                        <span class="dropdown-icon me-4">
                                            <i class="fa-solid fas fa-cube pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.products') }}</span>
                                    </a>
                                </a>
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('taxes.index') }}">
                                    <a class="nav-link px-4" href="{{ route('taxes.index') }}">
                                        <span class="dropdown-icon me-4">
                                            <i class="fa-solid fas fa-percentage pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.taxes') }}</span>
                                    </a>
                                </a>
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('clients.index') }}">
                                    <a class="nav-link px-4" href="{{ route('clients.index') }}">
                                        <span class="dropdown-icon me-3">
                                            <i class="fa-solid fas fa-users pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.clients') }}</span>
                                    </a>
                                </a>
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('payment-qr-codes.index') }}">
                                    <a class="nav-link px-4" href="{{ route('payment-qr-codes.index') }}">
                                        <span class="dropdown-icon me-4">
                                            <i class="fa-solid fa-qrcode pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.payment_qr_codes.payment_qr_codes') }}</span>
                                    </a>
                                </a>
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('transactions.index') }}">
                                    <a class="nav-link px-4" href="{{ route('transactions.index') }}">
                                        <span class="dropdown-icon me-3">
                                            <i class="fa-solid fas fa-list-ol pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.transactions') }}</span>
                                    </a>
                                </a>
                                {{-- <a class="py-0 fs-4 dropdown-item" href="{{ route('accounts.index') }}">
                                    <a class="nav-link px-4" href="{{ route('accounts.index') }}">
                                        <span class="dropdown-icon me-4">
                                            <i class="fa-solid fa-building-columns pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.accounts.accounts') }}</span>
                                    </a>
                                </a> --}}
                                <a class="py-0 fs-4 dropdown-item" href="{{ route('payments.index') }}">
                                    <a class="nav-link px-4" href="{{ route('payments.index') }}">
                                        <span class="dropdown-icon me-3">
                                            <i class="fa-solid fas fa-money-check pe-2"></i>
                                        </span>
                                        <span>{{ __('messages.payments') }}</span>
                                    </a>
                                </a>
                            </div>
                        </div>
                    @endrole
                    <div class="navbar-collapse">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            @include('layouts.sub_menu')
                        </ul>
                    </div>
                </div>
            </nav>
            <ul class="nav align-items-center">
            @hasrole('admin')
                <li class="px-xxl-3 px-2">
                    <a class="btn btn-primary createInvoiceBtn nowrap" href="{{ route('invoices.create') }}"
                        data-turbo="false">{{ __('messages.invoice.new_invoice') }}</a>
                </li>
            @endrole
            @hasrole('client')
                @if (count(getLoginTenantNames()) > 1)
                    <li class="px-xxl-3 px-2">
                        <div class="switch-tenant-wise-client">
                            {{ Form::select('client', getLoginTenantNames(), getLogInUser()->tenant_id, ['class' => 'form-control change-tenant-client', 'data-control' => 'select2']) }}
                        </div>
                    </li>
                @endif
            @endrole
            
            
            <li>
                <button type="button" class="btn px-0 d-block d-xl-none header-btn pb-2">
                    <i class="fa-solid fa-bars fs-1"></i>
                </button>
            </li>
            </ul>
        </div>
    </div>
</header>
<div class="bg-overlay" id="nav-overly"></div>
