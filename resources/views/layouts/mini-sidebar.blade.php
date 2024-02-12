@php
    $notifications = getNotification();
    $notificationCount = count($notifications);
    $styleCss = 'style';
@endphp
<div class="mini-sidebar-top">

    <div class="mini-sidebar-item">
        <!--<button type="button" class="btn-sidebar"><i class="fas fa-moon"></i></button>-->
        @if (Auth::user()->dark_mode)
                <a class="btn-sidebar btn-moon" href="javascript:;" data-turbo="false" title="{{ __('messages.switch_to_light_mode') }}">
                    <i class="las la-moon apply-dark-mode"></i>
                </a>
        @else
            <a class="btn-sidebar btn-moon" href="javascript:;" data-turbo="false" title="{{ __('messages.switch_to_dark_mode') }}">
                <i class="las la-moon apply-dark-mode"></i></a>
        @endif
        
        
    </div>
    <div class="mini-sidebar-item">
        <button type="button" class="btn-sidebar open-link"><i class="las la-search"></i></button>
        <div class="search-box open-box">
            Search form here
        </div>
    </div>
    
    <div class="mini-sidebar-item">
        <button type="button" id="fullscreen-button" class="btn-sidebar"><i class="las la-compress"></i></button>
    </div>
    
    <div class="mini-sidebar-item">
        <button type="button" class="btn-sidebar open-link">
        	<i class="las la-bell"></i>
        	@if (count(getNotification()) != 0)
                <span
                    class="position-absolute top-0 start-100 translate-middle badge badge-circle bg-danger notification-count"
                    id="counter">
                    {{ count(getNotification()) }}
                    <span class="visually-hidden">unread messages</span>
                </span>
            @endif
        </button>
        <div class="sidebar-notification open-box">
        	<h4>Notification</h4>
            
            <div class="p-0 inner-scroll scroll-height">
                @if ($notificationCount > 0)
                    @foreach ($notifications as $notification)
                        <a data-turbo="false" href="#" data-id="{{ $notification->id }}"
                            class="notification text-hover-primary text-decoration-none" id="notification">
            
                            <div class="d-flex position-relative mb-2 text-hover-primary">
                                @php
                                    $datework = Carbon\Carbon::parse($notification->created_at);
                                    $now = Carbon\Carbon::now();
                                    $diff = $datework->diffForHumans($now);
                                @endphp
                                <span class="me-5 text-primary fs-2 icon-label"><i
                                        class="fa-solid {{ getNotificationIcon($notification->type) }}"></i></span>
                                <div>
                                    <h5 class="text-gray-800 fs-6 mb-2">{{ $notification->title }}</h5>
                                    <h6 class="text-gray-600 fs-small fw-light mb-0">{{ $diff }}</h6>
                                </div>
                            </div>
                        </a>
                    @endforeach
                @else
                    <div class="empty-state fs-6 text-gray-800 fw-bold text-center mt-5" data-height="400">
                        <p>{{ __('messages.notification.you_don`t_have_any_new_notification') }}</p>
                    </div>
                @endif
                <div class="empty-state fs-6 text-gray-800 fw-bold text-center mt-5 d-none" data-height="400">
                    <p>{{ __('messages.notification.you_don`t_have_any_new_notification') }}</p>
                </div>
            </div>
            
            
            @if (count(getNotification()) > 0)
                <div class="text-center border-top p-1">
                    <a href="#"
                        class="read-all-notification text-primary mb-0 fs-5 text-decoration-none"
                        id="readAllNotification">
                        {{ __('messages.notification.mark_all_as_read') }}</a>
                </div>
            @endif
            
            
                        
        </div>
    </div>
    
    <div class="mini-sidebar-item">
        <button type="button" class="btn-sidebar"><i class="las la-headset"></i></button>
    </div>
    
</div>
<div class="mini-sidebar-bottom">
    @role('super_admin')
    <!--<div class="mini-sidebar-item {{ !Request::is('super-admin/section-one*', 'super-admin/section-two*', 'super-admin/section-three*', 'super-admin/faqs*', 'super-admin/admin-testimonial*') ? 'd-none' : '' }}">-->
    <div class="mini-sidebar-item">
        <button type="button" class="btn-sidebar setting-btn open-link"><i class="las la-cog"></i></button>
        <div class="sidebar-setting open-box">
        	<h4>CMS Pages</h4>
        	<ul class="nav flex-column landing-cms-nav mt-3">
            	<li class="nav-item {{ Request::is('super-admin/section-one*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('super.admin.section.one') }}">{{ __('messages.landing_cms.section_one') }}</a>
                </li>
                <li class="nav-item {{ Request::is('super-admin/section-two*') ? 'active' : '' }}	">
                	<a class="nav-link" href="{{ route('super.admin.section.two') }}">{{ __('messages.landing_cms.section_two') }}</a>
                </li>
                <li class="nav-item {{ Request::is('super-admin/section-three*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('super.admin.section.three') }}">{{ __('messages.landing_cms.section_three') }}</a>
                </li>
                <li class="nav-item {{ Request::is('super-admin/faqs*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('faqs.index') }}">{{ __('messages.faqs.faqs') }}</a>
                </li>
                <li class="nav-item" {{ Request::is('super-admin/admin-testimonial*') ? 'active' : '' }}>
                	<a class="nav-link" href="{{ route('admin-testimonial.index') }}">{{ __('messages.testimonials') }}</a>
                </li>
            </ul>
        </div>
    </div>
    @endrole
    
    
    <div class="mini-sidebar-item">
        <button type="button" class="btn-sidebar open-link mini-profile">
            <img src="{{ getLogInUser()->profile_image }}" class="" alt="profile image">
        </button>
        
       
           
        <div class="sidebar-setting open-box">
        	<h4>Setting</h4>
        	<ul class="nav flex-column landing-cms-nav mt-3">
            	@role('super_admin')
                <li class="nav-item {{ Request::is('super-admin/general-settings*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('super.admin.settings.edit') }}">{{ __('messages.settings') }}</a>
                </li>
                <li class="nav-item {{ Request::is('super-admin/currencies*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('super.admin.currencies.index') }}">{{ __('messages.setting.currencies') }}</a>
                </li>
                <li class="nav-item {{ Request::is('super-admin/footer-settings*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('super.admin.footer.settings.edit') }}">{{ __('messages.footer_setting.footer_settings') }}</a>
                </li>
                <li class="nav-item {{ Request::is('super-admin/new-user-settings*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('new-user-settings.edit') }}">{{ __('messages.new_user_settings.new_user_settings') }}</a>
                </li>
                
                
                @endrole
                
                @role('admin')
                <li class="nav-item {{ isset($sectionName) ? ($sectionName == 'general' ? 'active' : '') : '' }}">
                	<a class="nav-link" href="{{ route('settings.edit', ['section' => 'general']) }}">{{ __('messages.general') }}</a>
                </li>
                <li class="nav-item {{ Request::is('admin/currencies*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('currencies.index') }}">{{ __('messages.setting.currencies') }}</a>
                </li>
                <li class="nav-item {{ Request::is('admin/payment-gateway*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('payment-gateway.show') }}">{{ __('messages.setting.payment-gateway') }}</a>
                </li>
                <li class="nav-item {{ Request::is('admin/invoice-settings*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('settings.invoice-settings') }}">{{ __('messages.setting.invoice_settings') }}</a>
                </li>
                
                <li class="nav-item {{ Request::is('admin/invoice-settings*') ? 'active' : '' }}">
                	<a class="nav-link" href="{{ route('subscription.pricing.plans.index') }}">{{ __('messages.subscription_plans.subscription_plans') }}</a>
                </li>
                
                @endrole
                
                @if (!session('impersonated_by'))
                <li class="nav-item">
                	<a id="changePassword" class="nav-link" href="javascript:;">{{ __('messages.user.change_password') }}</a>
                </li>
                @endif
                
                @if (session('impersonated_by'))
                <li class="nav-item">
                	<a class="nav-link" href="{{ route('impersonate.userLogout') }}">{{ __('messages.back_to_super_admin') }}</a>
                </li>
                @endif
                
                <li class="nav-item">
                	<a id="changeLanguage" class="nav-link" href="javascript:;">{{ __('messages.user.change_language') }}</a>
                </li>
                
                
            </ul>
        </div>
    </div>
    
    <div class="mini-sidebar-item">
        @if (!session('impersonated_by'))
            <a class="btn-sidebar text-gray-900 d-flex cursor-pointer">
                <form id="logout-form" action="{{ route('logout') }}" method="post">
                    @csrf
                </form>
                <span onclick="event.preventDefault();localStorage.clear();document.getElementById('logout-form').submit();"><i class="las la-power-off"></i></span>
            </a>
        @endif        
        
    </div>
</div>