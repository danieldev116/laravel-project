<div class="aside-menu-container" id="sidebar">
    <div class="aside-menu-container__aside-logo flex-column-auto h-auto justify-content-center">
    	<div class="d-flex flex-column text-center">
        	@role('super_admin')
            <a data-turbo="false" href="{{ url('/') }}"
                class="text-decoration-none sidebar-logo d-flex align-items-center justify-content-center" data-bs-toggle="tooltip"
                title="{{ $settingValue['app_name']['value'] }}">
                <div class="sidebar-main-logo">
                    <img src="{{ asset($settingValue['app_logo']['value']) }}" class="img-fluid object-contain"
                        alt="profile image">
                </div>
                <!--<span class="text-gray-900 fs-4">{{ strlen($settingValue['app_name']['value']) > 15 ? substr($settingValue['app_name']['value'], 0, 15) . '...' : $settingValue['app_name']['value'] }}</span>-->
            </a>
        	@endrole
            
            @role('admin|client')
            <a data-turbo="false" href="{{ url('/') }}" class="text-decoration-none sidebar-logo d-flex align-items-center justify-content-center" data-bs-toggle="tooltip"
               title="{{ getAppName() }}">
                <div class="sidebar-main-logo">
                    <img src="{{  asset('/assets/images/infyom.png') }}"
                         class="img-fluid object-contain" alt="profile image">
                </div>
                <!--<span class="text-gray-900 fs-4">{{ (strlen(getAppName()) > 15 ) ? substr(getAppName(), 0,15).'...' : getAppName() }}</span>-->
            </a>
            @endrole
            
            <div class="user-profile-img">
                <a href="{{ route('profile.setting') }}"><img src="{{ getLogInUser()->profile_image }}" class="img-fluid" alt="profile image"></a>
            </div>
            <h5 class="text-white pt-2">{{ getLogInUser()->full_name }}</h5>
            <h4 class="mb-3 fw-400 text-gray-600 fs-6">{{ getLogInUser()->email }}</h4>
        </div>
        @php
            $settingValue = getSuperAdminSettingValue();
        @endphp
        
        
        
    </div>
    
    <div class="aside-menu-container__sidebar-scrolling overflow-auto" data-simplebar>
        <ul class="aside-menu-container__aside-menu nav flex-column ">
            @include('layouts.menu')
            <div class="no-record text-center d-none">No matching records found</div>
        </ul>
    </div>

    @if (!session('impersonated_by'))
        <a class="text-decoration-none text-gray-900 d-flex cursor-pointer text-center logout-btn">
            <form id="logout-form" action="{{ route('logout') }}" method="post">
                @csrf
            </form>
            <span class="text-center text-white w-100" onclick="event.preventDefault();localStorage.clear();document.getElementById('logout-form').submit();">Logout</span>
        </a>
    @endif  
</div>
<div class="bg-overlay" id="sidebar-overly"></div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-scrollbar@latest/simple-scrollbar.css">
<script src="https://cdn.jsdelivr.net/npm/simple-scrollbar@latest/simple-scrollbar.min.js"></script>
<script>
  var el = document.querySelector('.aside-menu-container__sidebar-scrolling');
  SimpleScrollbar.initEl(el);
</script>
