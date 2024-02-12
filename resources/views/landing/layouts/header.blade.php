@php
    $styleCss = 'style';
    $settingValue = getSuperAdminSettingValue();
@endphp

<header class="header">
	<div id="exclusive">a cloud inventory management solution from UNIFYD</div>
	<div class="container-md">
		<div class="inner">
			<div>
				<a href="{{ route('landing.home') }}"><img src="public/img/unifyd_logo.png"></a>
			</div>
			<div id="navbar" class="navbar-menu navbar-scroll">
				<nav class="navbar" role="navigation" aria-label="main navigation">

					<div class="navbar-start">
						<ul class="nav">
							<li class="nav-item"><a class="navbar-link" href="#unify">{{ __('messages.landing.home') }}</a></li>
							<li class="nav-item"><a class="navbar-link" href="#features">Features</a></li>
							<li class="nav-item"><a class="navbar-link" href="#pricing">Pricing</a></li>
							<li class="nav-item"><a class="navbar-link" href="#faq">FAQ</a></li>
						</ul>
					</div>
				</nav>
			</div>
			<div>
				<ul class="nav">
					<li class="nav-item"><a class="opt inverse ms-sm-2 ms-5" href="{{ route('login') }}">{{ \Illuminate\Support\Facades\Auth::check() ? __('messages.landing.dashboard') : 'Sign in' }}</a></li>
					<li class="nav-item"><a class="waviy opt ms-sm-2 ms-5" href="{{ route('login') }}"><span>Try it Free</span></a></li>
				</ul>
			</div>
		</div>
	</div>
</header>
