@role('super_admin')
    <li class="nav-item {{ Request::is('super-admin/dashboard*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('super.admin.dashboard') }}">
            <span class="menu-icon">
                <i class="las la-rocket pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.dashboard') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('super-admin/super-admins*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('super-admins.index') }}">
            <span class="menu-icon">
                <i class="las la-user-shield pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.super_admins') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('super-admin/users*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('users.index') }}">
            <span class="menu-icon">
                <i class="las la-users pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.users') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('super-admin/subscription-plan*', 'super-admin/transactions*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page"
            href="{{ route('subscription-plans.index') }}">
            <span class="menu-icon">
                <i class="las la-shopping-bag pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.subscription_plan') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('super-admin/enquiries*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page"
            href="{{ route('super.admin.enquiry.index') }}">
            <span class="menu-icon">
                <i class="las la-exclamation-circle pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.enquiries') }}</span>
        </a>
    </li>

    {{-- Subscribers --}}
    <li class="nav-item {{ Request::is('super-admin/subscribers*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page"
            href="{{ route('super.admin.subscribe.index') }}">
            <span class="menu-icon">
                <i class="las la-thumbs-up pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.subscribe.subscribers') }}</span>
        </a>
    </li>

   
@endrole
@role('admin')
    <li class="nav-item {{ Request::is('admin/dashboard*','admin/currency-reports*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('admin.dashboard') }}">
            <span class="menu-icon">
                <i class="las la-rocket pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.dashboard') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('admin/client*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('clients.index') }}">
            <span class="menu-icon">
                <i class="las la-user pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.clients') }}</span>
        </a>
    </li>

    

    <li class="nav-item {{ Request::is('admin/taxes*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('taxes.index') }}">
            <span class="menu-icon">
                <i class="las la-percentage pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.taxes') }}</span>
        </a>
    </li>

 
    <li class="nav-item sidebar-menu-item sidebar-dropdown">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="javascript:;">
            <span class="menu-icon">
                <i class="lab la-wpforms pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.products') }}</span>
            <span class="dropdown-arrow"><i class="bi bi-chevron-down"></i></span>
        </a>
        <ul class="sidebar-submenu collapse">
            
            <li class="nav-item {{ Request::is('admin/products*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('products.index') }}">
                    <span class="menu-icon">
                        <i class="las la-cube pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.products') }}</span>
                </a>
            </li>
            <li class="nav-item {{ Request::is('admin/categories*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('category.index') }}">
                    <span class="menu-icon">
                        <i class="las la-file-alt pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.categories') }}</span>
                </a>
            </li>
            <li class="nav-item {{ Request::is('admin/brands*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('brand.index') }}">
                    <span class="menu-icon">
                        <i class="las la-cube pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.brands.brands') }}</span>
                </a>
            </li>
            <li class="nav-item {{ Request::is('admin/units*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('unit.index') }}">
                    <span class="menu-icon">
                        <i class="las la-cube pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.units.units') }}</span>
                </a>
            </li>
            <li class="nav-item {{ Request::is('admin/base-units*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('base-units.index') }}">
                    <span class="menu-icon">
                        <i class="las la-cube pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.units.base_units') }}</span>
                </a>
            </li>
            <li class="nav-item {{ Request::is('admin/products*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('products.index') }}">
                    <span class="menu-icon">
                        <i class="las la-cube pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.barcode.print_barcode') }}</span>
                </a>
            </li>
        </ul>
    </li>
    <li class="nav-item {{ Request::is('admin/transfers*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('transfers.index') }}">
            <span class="menu-icon">
                <i class="las la-cube pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.transfers.transfers') }}</span>
        </a>
    </li>
    <li class="nav-item {{ Request::is('admin/adjustments*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('adjustments.index') }}">
            <span class="menu-icon">
                <i class="las la-cube pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.adjustments.adjustments') }}</span>
        </a>
    </li>
    <li class="nav-item {{ Request::is('admin/warehouse*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('warehouse.index') }}">
            <span class="menu-icon">
                <i class="las la-cube pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.warehouse.warehouse') }}</span>
        </a>
    </li>
    <li class="nav-item {{ Request::is('admin/currency*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('currencies.index') }}">
            <span class="menu-icon">
                <i class="las la-cube pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.currency.currency') }}</span>
        </a>
    </li>
    <li class="nav-item sidebar-menu-item sidebar-dropdown">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="javascript:;">
            <span class="menu-icon">
                <i class="lab la-wpforms pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.purchases.purchases') }}</span>
            <span class="dropdown-arrow"><i class="bi bi-chevron-down"></i></span>
        </a>
        <ul class="sidebar-submenu collapse">
            
            <li class="nav-item {{ Request::is('admin/purchases*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('purchases.index') }}">
                    <span class="menu-icon">
                        <i class="lab la-wpforms pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.purchases.purchases') }}</span>
                </a>
            </li>

            
            
            <li class="nav-item {{ Request::is('admin/purchases-return*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('purchases-returns.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.purchases.purchases_returns') }}</span>
                </a>
            </li>
        </ul>
    </li>
    <li class="nav-item sidebar-menu-item sidebar-dropdown">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="javascript:;">
            <span class="menu-icon">
                <i class="lab la-wpforms pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.common.peoples') }}</span>
            <span class="dropdown-arrow"><i class="bi bi-chevron-down"></i></span>
        </a>
        <ul class="sidebar-submenu collapse">
            
            <li class="nav-item {{ Request::is('admin/suppliers*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('suppliers.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.suppliers.suppliers') }}</span>
                </a>
            </li>
            <li class="nav-item {{ Request::is('admin/customers*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('customers.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.customers.customers') }}</span>
                </a>
            </li>
            
            
            <li class="nav-item {{ Request::is('admin/customers*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('customers.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.employees.employees') }}</span>
                </a>
            </li>
        </ul>
    </li>
     <li class="nav-item sidebar-menu-item sidebar-dropdown">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="javascript:;">
            <span class="menu-icon">
                <i class="lab la-wpforms pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.sales.sales') }}</span>
            <span class="dropdown-arrow"><i class="bi bi-chevron-down"></i></span>
        </a>
        <ul class="sidebar-submenu collapse">
            
            <li class="nav-item {{ Request::is('admin/sales*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('sales.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.sales.sales') }}</span>
                </a>
            </li>
            
            <li class="nav-item {{ Request::is('admin/sales-return*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('sales-returns.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.sales.sales_returns') }}</span>
                </a>
            </li>
        </ul>
    </li>
    <li class="nav-item sidebar-menu-item sidebar-dropdown">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="javascript:;">
            <span class="menu-icon">
                <i class="lab la-wpforms pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.expenses.expenses') }}</span>
            <span class="dropdown-arrow"><i class="bi bi-chevron-down"></i></span>
        </a>
        <ul class="sidebar-submenu collapse">
            
            <li class="nav-item {{ Request::is('admin/expenses*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('expenses.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.expenses.expenses') }}</span>
                </a>
            </li>
            
            <li class="nav-item {{ Request::is('admin/expense_category*') ? 'active' : '' }}">
                <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('expense_category.index') }}">
                    <span class="menu-icon">
                        <i class="las la-arrow-left pe-3"></i>
                    </span>
                    <span class="aside-menu-title">{{ __('messages.expenses.expense_categories') }}</span>
                </a>
            </li>
        </ul>
    </li>
    
    <li class="nav-item {{ Request::is('admin/quotes*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('quotes.index') }}">
            <span class="menu-icon">
                <i class="las la-quote-left pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.quotes') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('admin/invoices*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('invoices.index') }}">
            <span class="menu-icon">
                <i class="las la-file-invoice pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.invoices') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('admin/payment-qr-codes*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page"
            href="{{ route('payment-qr-codes.index') }}">
            <span class="menu-icon">
                <i class="las la-qrcode pe-3"></i>
            </span>
            <span class="aside-menu-title">{!! __('messages.payment_qr_codes.payment_qr_codes') !!}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('admin/transactions*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('transactions.index') }}">
            <span class="menu-icon">
                <i class="las la-file-invoice-dollar pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.transactions') }}</span>
        </a>
    </li>

    {{-- <li class="nav-item {{ Request::is('admin/accounts*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('accounts.index') }}">
            <span class="menu-icon">
                <i class="las la-building pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.accounts.accounts') }}</span>
        </a>
    </li> --}}

    <li class="nav-item {{ Request::is('admin/payments*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('payments.index') }}"
            data-turbo="false">
            <span class="menu-icon">
                <i class="las la-credit-card pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.payments') }}</span>
        </a>
    </li>

    <li class="nav-item {{ Request::is('admin/template-setting*') ? 'active' : '' }}">
        <a class="nav-link d-flex align-items-center py-3" aria-current="page" href="{{ route('invoiceTemplate') }}">
            <span class="menu-icon">
                <i class="las la-copy pe-3"></i>
            </span>
            <span class="aside-menu-title">{{ __('messages.invoice_templates') }}</span>
        </a>
    </li>
    
@endrole

@role('client')
    @include('client_panel.layouts.menu')
@endrole

<script>
    document.querySelectorAll('.nav-link').forEach(function(element){
   
   element.addEventListener('click', function (e) {
     let nextEl = element.nextElementSibling;
     let parentEl  = element.parentElement;	
     $(this).toggleClass("active");
     if(nextEl) {
       e.preventDefault();	
       let mycollapse = new bootstrap.Collapse(nextEl);
       
         if(nextEl.classList.contains('show')){
           mycollapse.hide();
         } else {
           mycollapse.show();
           // find other submenus with class=show
           var opened_submenu = parentEl.parentElement.querySelector('.sidebar-submenu.show');
           // if it exists, then close all of them
         if(opened_submenu){
           new bootstrap.Collapse(opened_submenu);
         }

         }
       }

   });
 })
</script>