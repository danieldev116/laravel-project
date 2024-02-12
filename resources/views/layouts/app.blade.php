<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    @php
        $settingValue = getSuperAdminSettingValue();
    @endphp
    @role('super_admin')
    <title>@yield('title') | {{ $settingValue['app_name']['value'] }}</title>
    <link rel="icon" href="{{ asset($settingValue['favicon_icon']['value']) }}" type="image/png">
    @else
        <title>@yield('title') | {{ getAppName() }}</title>
        <link rel="icon" href="{{ getFaviconUrl() }}" type="image/png">
        @endrole
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700"/>
        <!-- General CSS Files -->
        <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/third-party.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ mix('assets/css/page.css') }}">
        <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
        @if(!Auth::user()->dark_mode)
            <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/style.css') }}">
            <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/plugins.css') }}">
        @else
            <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/style.dark.css') }}">
            <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/plugins.dark.css') }}">
            <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/phone-number-dark.css') }}">
            <link rel="stylesheet" type="text/css" href="https://npmcdn.com/flatpickr/dist/themes/dark.css">
            
        @endif
        @livewireStyles
        @livewireScripts
        <script src="https://cdn.jsdelivr.net/gh/livewire/turbolinks@v0.1.x/dist/livewire-turbolinks.js"
                data-turbolinks-eval="false" data-turbo-eval="false"></script>
        <script src="https://js.stripe.com/v3/" async></script>
        <script src="https://checkout.razorpay.com/v1/checkout.js" data-turbolinks-eval="false"
                data-turbo-eval="false"></script>
        <script src="{{ asset('assets/js/third-party.js') }}"></script>
        <script src="{{ asset('messages.js') }}"></script>
        <script data-turbo-eval="false">
            let defaultCountryCodeValue = "{{ getDefaultCountryFromSetting(getLogInUser()->tenant_id) }}"
            let decimalsSeparator = "{{ getSettingValue('decimal_separator') }}"
            let thousandsSeparator = "{{ getSettingValue('thousand_separator') }}"
            let changePasswordUrl = "{{ route('user.changePassword') }}"
            let currentDateFormat = "{{ currentDateFormat() }}"
            let momentDateFormat = "{{ momentJsCurrentDateFormat() }}"
            let ajaxCallIsRunning = false
            var phoneNo = ''
            let makePaymentURL = "{{ route('purchase-subscription') }}"
            let subscribeText = "{{ __('choose plan') }}"
            @if(getSuperAdminStripeKey())
            let stripe = Stripe('{{ getSuperAdminStripeKey() }}')
            @endif
            let subscriptionPlans = "{{ route('subscription.pricing.plans.index') }}"
            let toastData = JSON.parse('@json(session('toast-data'))')
            let makeRazorpayURl = "{{ route('admin.razorpay.init') }}"
            let razorpayPaymentFailed = "{{ route('admin.razorpay.failed') }} "
            let cashPaymentUrl = "{{ route('subscription.cash-payment') }}"
            let razorpayPaymentFailedModal = "{{ route('admin.razorpay.failed.modal') }}"
            let sweetAlertIcon = "{{ asset('assets/images/remove.png') }}"
            let getUserLanguages = "{{getCurrentLanguageName()}}"
            let selectPaymentTypeLang = "{{ __('messages.payment.select_payment_type') }}"
            let selectPaymentModeLang = "{{ __('messages.payment.select_payment_mode') }}"
            Lang.setLocale(getUserLanguages)
            let options = {
                'key': "{{ getSuperAdminRazorpayKey() }}",
                'amount': 1, //  100 refers to 1
                'currency': 'INR',
                'name': "{{getAppName()}}",
                'order_id': '',
                'description': '',
                'image': '{{ getLogoUrl() }}', // logo here
                'callback_url': "{{ route('admin.razorpay.success') }}",
                'prefill': {
                    'email': '', // recipient email here
                    'name': '', // recipient name here
                },
                'readonly': {
                    'name': 'true',
                    'email': 'true',
                },
                'modal': {
                    'ondismiss': function () {
                        $.ajax({
                            type: 'POST',
                            url: razorpayPaymentFailedModal,
                            success: function (result) {
                                if (result.url) {
                                    window.location.href = result.url
                                }
                            },
                            error: function (result) {
                                displayErrorMessage(result.responseJSON.message)
                            },
                        })
                    },
                },
            }
        </script>
        @routes
        <script src="{{ mix('assets/js/pages.js') }}"></script>
        @yield('phone_js')
</head>
<body class="main-body" id="fullscreen-container">
<span class="overlay-sidebar"></span>
<div class="d-flex flex-column flex-root">
    <div class="d-flex flex-row flex-column-fluid">
    	<!-- new html -->
    	<div class="mini-sidebar">
        	@include('layouts.mini-sidebar')

        </div>
        <!-- new html end -->
        @include('layouts.sidebar')
        <div class="wrapper d-flex flex-column flex-row-fluid custom-overflow-x-hidden">
            <div class='container-fluid d-flex align-items-stretch justify-content-between px-0'>
                @include('layouts.header')
            </div>
            <div class='content d-flex flex-column flex-column-fluid'>
                @yield('header_toolbar')
                <div class='d-flex flex-wrap flex-column-fluid'>
                    @yield('content')
                </div>
            </div>
            <div class='container-fluid'>
                @include('layouts.footer')
            </div>
        </div>
    </div>
</div>
@include('profile.changePassword')
@include('profile.changeLanguage')



<script>
  var buttons = document.querySelectorAll('.open-link');
  var targetDivs = document.querySelectorAll('.open-box');
  var overlay = document.querySelector('.overlay-sidebar');

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Remove "active" class from all target divs
      targetDivs.forEach(div => {
        div.classList.remove('active');
      });

      // Add "active" class to the target div corresponding to the clicked button
      targetDivs[index].classList.add('active');

      // Activate the overlay
      overlay.classList.add('active');
    });
  });

  // Add an event listener to the overlay to deactivate it when clicked

  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
	targetDivs.forEach(div => {
        div.classList.remove('active');
      });
  });


</script>
<script>
  var fullscreenToggleButton = document.getElementById('fullscreen-button');
  var isFullscreen = false; // Track the full-screen state

  fullscreenToggleButton.addEventListener('click', () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  });

  function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // Internet Explorer
      document.documentElement.msRequestFullscreen();
    }

    isFullscreen = true;
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    isFullscreen = false;
  }
</script>
</body>
</html>
