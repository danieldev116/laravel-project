<footer class="border-top w-100 pt-4 mt-7">
    <div class="container-fluid d-flex align-items-center justify-content-between">
    @role('super_admin')
    <p class="fs-6 text-gray-600">All Rights Reserved ©{{ \Carbon\Carbon::now()->year }} <a href="#" class="text-decoration-none">{{ $settingValue['app_name']['value'] }}</a></p>
    @endrole 
    @role('admin|client')
    <p class="fs-6 text-gray-600">All Rights Reserved ©{{ \Carbon\Carbon::now()->year }} <a href="#" class="text-decoration-none">{{ getAppName() }}</a></p>
    @endrole
    @role('super_admin|admin')
    @endrole
    </div>
</footer>

