@php
    $styleCss = 'style';
    $settingValue = getSuperAdminSettingValue();
@endphp

<section class="footer-section">
	<div class="text-center">
		<img src="public/img/unifyd_logo.png" height="100">
	</div>
	<div class="container-md">
		<div class="inner">
			<div><span>©</span> 2023 unifyd llc.</div>
			<div>
				<nav class="navbar">
					<ul class="nav">
						<li class="nav-item"><a class="navbar-link" href="/terms_and_conditions.html">Terms and Conditions.</a></li>
						<li class="nav-item"><a class="navbar-link" href="/privacy_policy.html">Privacy Policy.</a></li>
						<li class="nav-item"><a class="navbar-link" href="/int_pr_policy.html">Intellectual Property Policy.</a></li>
					</ul>
				</nav>
			</div>
			<div>
				@php $styleCss = 'style'; @endphp
				<div class="dropdown">
					<a class="lang dropdown-toggle" href="javascript:void(0)" role="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">{{ __('messages.language') }}</a>
					<ul class="dropdown-menu" {{ $styleCss }}="min-width: 200px" aria-labelledby="languageDropdown">
						@foreach(getLanguages() as $key => $value)
						<li class="languageSelection {{ (checkLanguageSession() == $key) ? 'active' : '' }}" data-prefix-value="{{ $key }}" {{ $styleCss }}="max-height: 40px">
							<a class="dropdown-item {{ (checkLanguageSession() == $key) ? 'active' : '' }}" href="javascript:void(0)">{{ $value }}</a>
						</li>
						@endforeach
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>
