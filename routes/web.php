<?php
use App\Http\Controllers\AdjustmentsController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\API\ReportAPIController;
use App\Http\Controllers\API\RoleAPIController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\SettingAPIController;
use App\Http\Controllers\API\SmsSettingAPIController;
use App\Http\Controllers\API\LanguageAPIController;
use App\Http\Controllers\API\ProductAPIController;
use App\Http\Controllers\BaseUnitController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\BrandsController;

use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\API\ManageStockAPIController;
use App\Http\Controllers\API\SaleReturnAPIController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleReturnController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExpenseCategoryController;


use App\Http\Controllers\AdminCurrencyController;
use App\Http\Controllers\AdminPaymentController;
use App\Http\Controllers\AdminPaypalController;
use App\Http\Controllers\AdminRazorpayController;
use App\Http\Controllers\Auth\ClientNewPasswordController;
use App\Http\Controllers\CashController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Client as Client;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceTemplateController;
use App\Http\Controllers\Landing as Landing;
use App\Http\Controllers\UserSettingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentGatewayController;
use App\Http\Controllers\PaymentQrCodeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\SubscriptionPricingPlanController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\SuperAdminEnquiryController;
use App\Http\Controllers\TaxController;
use App\Http\Controllers\UserController;
use App\Models\ExpenseCategory;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['xss'])->group(function () {
    Route::get('/', function () {
        return redirect(route('landing.home'));
    });

    // client reset password routes
    Route::get('/client-onboard/{id}', [ClientNewPasswordController::class, 'create'])->name('client.password.reset');
    Route::post('/reset-password', [ClientNewPasswordController::class, 'store'])->name('clientpassword.update');
    // client reset password routes end

    Route::post('update-language', [UserController::class, 'updateLanguage'])->name('change-language');
    Route::get('language/', [UserController::class, 'getAllLanguage'])->name('get.all.language');
    //Notification routes
    Route::get(
        '/notification/{notification}/read',
        [NotificationController::class, 'readNotification']
    )->name('read.notification')->middleware('multi_tenant');
    Route::post(
        '/read-all-notification',
        [
            NotificationController::class, 'readAllNotification',
        ]
    )->name('read.all.notification')->middleware('multi_tenant');
    //update darkMode Field
    Route::get('update-dark-mode', [UserController::class, 'updateDarkMode'])->name('update-dark-mode');
    Route::get('invoice/{invoiceId}', [InvoiceController::class, 'showPublicInvoice'])->name('invoice-show-url');
    Route::get(
        'invoice-pdf/{invoice}',
        [InvoiceController::class, 'getPublicInvoicePdf']
    )->name('public-view-invoice.pdf');
    Route::get('quote/{quoteId}', [QuoteController::class, 'showPublicQuote'])->name('quote-show-url');
    Route::get(
        'quote-pdf/{quote}',
        [QuoteController::class, 'getPublicQuotePdf']
    )->name('public-view-quote.pdf');

    Route::post('payments', [Client\PaymentController::class, 'store'])->name('client.payments.store');
    Route::post('stripe-payment', [Client\StripeController::class, 'createSessionForPublic'])->name('stripe-payment');
    Route::get('stripe-payment-success', [Client\StripeController::class, 'paymentSuccess'])->name('client.payment-success');
    Route::get(
        'stripe-failed-payment',
        [Client\StripeController::class, 'handleFailedPayment']
    )->name('client.failed-payment');

    Route::get('paypal-onboard', [Client\PaypalController::class, 'onBoardForPublic'])->name('public.paypal.init');
    Route::get('paypal-payment-success', [Client\PaypalController::class, 'success'])->name('public.paypal.success');
    Route::get('paypal-payment-failed', [Client\PaypalController::class, 'failed'])->name('public.paypal.failed');

    // razorpay payment
    Route::get('razorpay-onboard', [Client\RazorpayController::class, 'onBoard'])->name('public.razorpay.init');
    Route::post('razorpay-payment-success', [Client\RazorpayController::class, 'paymentSuccess'])
        ->name('public.razorpay.success');
    Route::post('razorpay-payment-failed', [Client\RazorpayController::class, 'paymentFailed'])
        ->name('public.razorpay.failed');
    Route::get('razorpay-payment-webhook', [Client\RazorpayController::class, 'paymentSuccessWebHook'])
        ->name('public.razorpay.webhook');
    Route::post('razorpay-payment-failed-modal', [AdminRazorpayController::class, 'paymentFailedModal'])
        ->name('public.razorpay.failed.modal');
});

Route::prefix('admin')->middleware(['auth', 'xss', 'role:admin', 'check_subscription', 'checkUserStatus', 'multi_tenant', 'verified'])->group(function () {
    // Admin dashboard route
    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    )->name('admin.dashboard');
    Route::get('payment-overview', [DashboardController::class, 'paymentOverview'])->name('payment-overview');
    Route::get('invoices-overview', [DashboardController::class, 'invoiceOverview'])->name('invoices-overview');
    Route::get(
        'yearly-income-chart',
        [DashboardController::class, 'getYearlyIncomeChartData']
    )->name('yearly-income-chart');
    // User route
    Route::resource('users', UserController::class);
    // Client route
    Route::resource('clients', ClientController::class)->except(['show']);
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store')->middleware('checkClientLimit');

    //client total invoice view route
    Route::get('clients/{clientId}/{active?}', [ClientController::class, 'show'])->name('clients.show');
    Route::get('states-list', [ClientController::class, 'getStates'])->name('states-list');
    Route::get('cities-list', [ClientController::class, 'getCities'])->name('cities-list');
    //Adjustment route
    Route::resource('adjustments',AdjustmentsController::class);
    Route::get('adjustments/get-product/{productId}', [AdjustmentsController::class, 'getProduct'])->name('adjustments.get-product');
    //Transfers route
    Route::resource('transfers', TransferController::class);
    Route::get('transfers/get-product/{productId}', [TransferController::class, 'getProduct'])->name('transfers.get-product');


    // warehouses route
    Route::resource('warehouse', WarehouseController::class);
    
    //expense route
    Route::resource('expenses', ExpenseController::class);
    // Route::get('warehouse-details/{id}', [WarehouseAPIController::class, 'warehouseDetails']);
    // Route::get('warehouses', [WarehouseAPIController::class, 'index']);
    // Route::post(
    //     'payment-gateway/store',
    //     [PaymentGatewayController::class, 'store']
    // )->name('payment-gateway.store');
     // get all permission
     Route::get('/permissions', [PermissionController::class, 'getPermissions'])->name('get-permissions');
     Route::resource('roles', RoleAPIController::class);
     Route::get('roles', [RoleAPIController::class, 'index']);

     //suppliers route
    //    Route::middleware('permission:manage_suppliers')->group(function () {
    Route::resource('suppliers', SupplierController::class);
    //    });
    // Route::get('suppliers', [SupplierAPIController::class, 'index']);
    // Route::post('import-suppliers', [SupplierAPIController::class, 'importSuppliers']);

    //sale
    Route::resource('sales', SaleController::class);
    Route::resource('sales-returns', SaleReturnController::class);
     // warehouse report
    Route::get('sales-report-excel',
        [ReportAPIController::class, 'getWarehouseSaleReportExcel'])->name('report-getSaleReportExcel');
    Route::get('purchases-report-excel',
        [ReportAPIController::class, 'getWarehousePurchaseReportExcel']);
    Route::get('sales-return-report-excel',
        [ReportAPIController::class, 'getWarehouseSaleReturnReportExcel'])->name('report-getSaleReturnReportExcel');
    Route::get('purchases-return-report-excel',
        [
            ReportAPIController::class, 'getWarehousePurchaseReturnReportExcel',
        ])->name('report-getPurchaseReturnReportExcel');
    Route::get('expense-report-excel',
        [ReportAPIController::class, 'getWarehouseExpenseReportExcel'])->name('report-getExpenseReportExcel');

    //sale report
    Route::get('total-sale-report-excel',
        [ReportAPIController::class, 'getSalesReportExcel'])->name('report-getSalesReportExcel');

    // purchase report
    Route::get('total-purchase-report-excel',
        [ReportAPIController::class, 'getPurchaseReportExcel']);
    // top-selling product report
    Route::get('top-selling-product-report-excel',
        [ReportAPIController::class, 'getSellingProductReportExcel']);
    Route::get('top-selling-product-report',
        [ReportAPIController::class, 'getSellingProductReport']);

    Route::get('supplier-report', [ReportAPIController::class, 'getSupplierReport']);

    Route::get('supplier-purchases-report/{supplier_id}', [ReportAPIController::class, 'getSupplierPurchasesReport']);
    Route::get('supplier-purchases-return-report/{supplier_id}',
        [ReportAPIController::class, 'getSupplierPurchasesReturnReport']);
    Route::get('supplier-report-info/{supplier_id}', [ReportAPIController::class, 'getSupplierInfo']);

    // profit loss report
    Route::get('profit-loss-report', [ReportAPIController::class, 'getProfitLossReport']);

    // best customers report

    Route::get('best-customers-report', [ReportAPIController::class, 'getBestCustomersReport']);
    Route::get('best-customers-pdf-download', [CustomerController::class, 'bestCustomersPdfDownload']);

    //customer all report
    Route::get('customer-report', [ReportAPIController::class, 'getCustomerReport']);
    Route::get('customer-payments-report/{customer}', [ReportAPIController::class, 'getCustomerPaymentsReport']);
    Route::get('customer-info/{customer}', [ReportAPIController::class, 'getCustomerInfo']);
    Route::get('customer-pdf-download/{customer}', [CustomerController::class, 'pdfDownload']);
    Route::get('customer-sales-pdf-download/{customer}', [CustomerController::class, 'customerSalesPdfDownload']);
    Route::get('customer-quotations-pdf-download/{customer}',
        [CustomerController::class, 'customerQuotationsPdfDownload']);
    Route::get('customer-returns-pdf-download/{customer}',
        [CustomerController::class, 'customerReturnsPdfDownload']);
    Route::get('customer-payments-pdf-download/{customer}',
        [CustomerController::class, 'customerPaymentsPdfDownload']);

    //Warehouse Products alert Quantity Report
    Route::get('product-stock-alerts/{warehouse_id?}', [ReportAPIController::class, 'stockAlerts']);

    //stock report
    Route::get('stock-report', [ManageStockAPIController::class, 'stockReport'])->name('report-stockReport');
    Route::get('stock-report-excel', [ReportAPIController::class, 'stockReportExcel'])->name('report-stockReportExcel');

    Route::get('get-sale-return-product-report',
        [SaleReturnAPIController::class, 'getSaleReturnProductReport']);


    Route::get('today-sales-overall-report', [ReportAPIController::class, 'getTodaySalesOverallReport']);

    // stock report excel
    Route::get('get-product-sale-report-excel', [ReportAPIController::class, 'getProductSaleReportExport']);
    Route::get('get-product-purchase-report-excel', [ReportAPIController::class, 'getPurchaseProductReportExport']);
    Route::get('get-product-sale-return-report-excel',
        [ReportAPIController::class, 'getSaleReturnProductReportExport']);
    Route::get('get-product-purchase-return-report-excel',
        [ReportAPIController::class, 'getPurchaseReturnProductReportExport']);
    Route::get('get-product-count', [ReportAPIController::class, 'getProductQuantity']);

    //setting route
    Route::post('settings', [SettingAPIController::class, 'update']);
    Route::get('states/{id}', [SettingAPIController::class, 'getStates']);
    Route::get('mail-settings', [SettingAPIController::class, 'getMailSettings']);
    Route::post('mail-settings/update', [SettingAPIController::class, 'updateMailSettings']);
    Route::resource('languages', LanguageAPIController::class);
    Route::get('languages/translation/{language}', [LanguageAPIController::class, 'showTranslation']);
    Route::post('languages/translation/{language}/update', [LanguageAPIController::class, 'updateTranslation']);
    Route::resource('sms-settings', SmsSettingAPIController::class);
    Route::post('sms-settings', [SmsSettingAPIController::class, 'update']);
    Route::get('settings', [SettingAPIController::class, 'index']);

    //language
    Route::resource('languages', LanguageAPIController::class);
    Route::get('languages/translation/{language}', [LanguageAPIController::class, 'showTranslation']);
    Route::post('languages/translation/{language}/update', [LanguageAPIController::class, 'updateTranslation']);

    //purchase routes
    Route::resource('purchases', PurchaseController::class);
    Route::get('purchases/download-pdf/{purchase}',[PurchaseController::class, 'pdfDownload'])->name('purchases.download-pdf');

    //purchase return routes
    Route::resource('purchases-returns', PurchaseReturnController::class);
    Route::get('purchases-returns/download-pdf/{purchase_return}',[PurchaseReturnController::class, 'pdfDownload'])->name('purchases-returns.download-pdf');

    // customers route
    Route::resource('customers', CustomerController::class);


        //Category Route
    Route::resource('categories', CategoryController::class)->names([
        'index' => 'category.index',
        'create' => 'category.create',
        'show' => 'category.show',
        'store' => 'category.store',
        'edit' => 'category.edit',
        'update' => 'category.update',
        'destroy' => 'category.destroy',
    ]);
    Route::resource('base-units', BaseUnitController::class)->names([
        'index' => 'base-units.index',
        'create' => 'base-units.create',
        'show' => 'base-units.show',
        'store' => 'base-units.store',
        'edit' => 'base-units.edit',
        'update' => 'base-units.update',
        'destroy' => 'base-units.destroy',
    ]);
    Route::resource('brands', BrandsController::class)->names([
        'index' => 'brand.index',
        'create' => 'brand.create',
        'show' => 'brand.show',
        'store' => 'brand.store',
        'edit' => 'brand.edit',
        'update' => 'brand.update',
        'destroy' => 'brand.destroy',
    ]);
    Route::resource('units', UnitController::class)->names([
        'index' => 'unit.index',
        'create' => 'unit.create',
        'show' => 'unit.show',
        'store' => 'unit.store',
        'edit' => 'unit.edit',
        'update' => 'unit.update',
        'destroy' => 'unit.destroy',
    ]);
    Route::resource('expense_category', ExpenseCategoryController::class)->names([
        'index' => 'expense_category.index',
        'create' => 'expense_category.create',
        'show' => 'expense_category.show',
        'store' => 'expense_category.store',
        'edit' => 'expense_category.edit',
        'update' => 'expense_category.update',
        'destroy' => 'expense_category.destroy',
    ]);
    //Product Route
    Route::resource('products', ProductController::class);

    //quote
    Route::resource('quotes', QuoteController::class);
    Route::get('quotes/{quote}/pdf', [QuoteController::class, 'convertToPdf'])->name('quotes.pdf');
    Route::get('convert-to-invoice', [QuoteController::class, 'convertToInvoice'])->name('quotes.convert-to-invoice');

    //Invoice
    Route::resource('invoices', InvoiceController::class);
    Route::post(
        'invoices',
        [InvoiceController::class, 'store']
    )->name('invoices.store')->middleware('checkInvoiceLimit');
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'convertToPdf'])->name('invoices.pdf');
    Route::get('invoices/{productId}/product', [InvoiceController::class, 'getProduct'])->name('invoices.get-product');
    Route::get(
        'invoices/{currencyId}/currency',
        [InvoiceController::class, 'getInvoiceCurrency']
    )->name('invoices.get-currency');
    Route::post(
        'change-invoice-status/{invoice}/{status}',
        [InvoiceController::class, 'updateInvoiceStatus']
    )->name('send-invoice');
    Route::Post(
        'invoice-payment-reminder/{invoiceId}',
        [InvoiceController::class, 'invoicePaymentReminder']
    )->name('invoice.payment-reminder');
    Route::post(
        '/turn-off-recurring/{invoice}',
        [InvoiceController::class, 'updateRecurringStatus']
    )->name('update-recurring-status');

    //Tax
    Route::resource('taxes', TaxController::class);
    Route::post('taxes/{tax}/default-status', [TaxController::class, 'defaultStatus'])->name('taxes.default-status');

    //Payment Qr-Codes
    Route::resource('payment-qr-codes', PaymentQrCodeController::class);
    Route::post('payment-qr-codes/{paymentQrCode}', [PaymentQrCodeController::class, 'update'])->name('payment-update');
    Route::post('payment-qr-codes/{paymentQrCode}/default-status', [PaymentQrCodeController::class, 'defaultStatus'])->name('payment-qr-codes.default-status');

    //Accounts
    // Route::resource('accounts', AccountController::class);

    //Payment
    Route::get('transactions', [PaymentController::class, 'index'])->name('transactions.index');
    Route::resource('payments', AdminPaymentController::class);
    Route::get(
        'get-current-date-format',
        [AdminPaymentController::class, 'getCurrentDateFormat']
    )->name('get-current-date-format');
    
    //Setting Route
    Route::get('settings', [SettingController::class, 'edit'])->name('settings.edit');
    Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
    Route::post('invoice-settings', [SettingController::class, 'invoiceUpdate'])->name('invoice-settings.settings');
    Route::get(
        'invoice-template/{key}',
        [SettingController::class, 'editInvoiceTemplate']
    )->name('invoice-template.edit');
    Route::get('invoice-settings', [SettingController::class, 'invoiceSettings'])->name('settings.invoice-settings');
    //invoice template
    Route::get(
        'template-setting',
        [InvoiceTemplateController::class, 'invoiceTemplateView']
    )->name('invoiceTemplate');
    Route::post(
        'change-invoice-template',
        [
            InvoiceTemplateController::class, 'invoiceTemplateUpdate',
        ]
    )->name('invoiceTemplate.update');

    // Currency
    Route::resource('currencies', CurrencyController::class);

    Route::post('user/{user}/change-status', [UserController::class, 'changeUserStatus'])->name('users.change-status');

    //getInvoiceDueAmount
    Route::get(
        'payments.get-invoiceAmount/{id}',
        [AdminPaymentController::class, 'getInvoiceDueAmount']
    )->name('payments.get-invoiceAmount');

    //get  Excel file
    Route::get('invoices-excel', [InvoiceController::class, 'exportInvoicesExcel'])->name('admin.invoicesExcel');
    Route::get('quotes-excel', [QuoteController::class, 'exportQuotesExcel'])->name('admin.quotesExcel');
    // Export quotes pdf for admin route
    Route::get('quotes-pdf', [QuoteController::class, 'exportQuotesPdf'])->name('admin.quotes.pdf');
    Route::get(
        'transactions-excel',
        [PaymentController::class, 'exportTransactionsExcel']
    )->name('admin.transactionsExcel');
    // export transactions pdf admin route
    Route::get('transactions-pdf', [paymentController::class, 'exportTransactionsPdf'])->name('admin.export.transactions.pdf');
    // export payments excel admin route
    Route::get('admin-payments-excel', [AdminPaymentController::class, 'exportAdminPaymentsExcel'])->name('admin.paymentsExcel');

    // export payments pdf admin route
    Route::get('admin-payments-pdf', [AdminPaymentController::class, 'exportAdminPaymentsPDF'])->name('admin.payments.pdf');

    //payment-gateway
    Route::post(
        'payment-gateway/store',
        [PaymentGatewayController::class, 'store']
    )->name('payment-gateway.store')->middleware('multi_tenant');
    Route::get(
        'payment-gateway',
        [PaymentGatewayController::class, 'show']
    )->name('payment-gateway.show')->middleware('multi_tenant');

    //Clear cache
    Route::get('clear-caches', [DashboardController::class, 'clearCache'])->name('clear-cache');
    // export invoices pdf admin route
    Route::get('invoices-pdf', [InvoiceController::class, 'exportInvoicesPdf'])->name('admin.invoices.pdf');

    //search client email
    Route::get('/search-email/{search_email}', [UserController::class, 'searchUsers'])->name('search.users');

    Route::get('get-user/{userId}', [UserController::class, 'getUser'])->name('get.user');

    Route::get('currency-reports', [DashboardController::class, 'currencyReports'])->name('currency.reports');
});

Route::prefix('admin')->middleware(['auth', 'xss', 'role:admin', 'checkUserStatus'])->group(function () {
    // paypal subscription transaction
    Route::get('paypal-onboard', [AdminPaypalController::class, 'onBoard'])->name('admin.paypal.init');
    Route::get('paypal-payment-success', [AdminPaypalController::class, 'success'])->name('admin.paypal.success');
    Route::get('paypal-payment-failed', [AdminPaypalController::class, 'failed'])->name('admin.paypal.failed');

    // Razor Pay Routes
    Route::post(
        'razorpay-onboard',
        [AdminRazorpayController::class, 'onBoard']
    )->name('admin.razorpay.init');
    Route::post('razorpay-payment-success', [AdminRazorpayController::class, 'paymentSuccess'])
        ->name('admin.razorpay.success');
    Route::post('razorpay-payment-failed', [AdminRazorpayController::class, 'paymentFailed'])
        ->name('admin.razorpay.failed');
    Route::post('razorpay-payment-failed-modal', [AdminRazorpayController::class, 'paymentFailedModal'])
        ->name('admin.razorpay.failed.modal');

    //payment-gateway
    Route::post(
        'payment-gateway/store',
        [PaymentGatewayController::class, 'store']
    )->name('payment-gateway.store');
    Route::get(
        'payment-gateway',
        [PaymentGatewayController::class, 'show']
    )->name('payment-gateway.show');

    // manual payment route
    Route::post('cash-payment', [CashController::class, 'pay'])->name('subscription.cash-payment');
    Route::get(
        'change-transaction-status/{id}',
        [PaymentController::class, 'changeTransactionStatus']
    )->name('change-transaction-status');
});

// Impersonate Logout
Route::get(
    '/users/impersonate-logout',
    [UserController::class, 'userImpersonateLogout']
)->name('impersonate.userLogout');

Route::prefix('super-admin')->middleware(['auth', 'xss', 'role:super_admin'])->group(function () {
    Route::get('/impersonate/{user}', [UserController::class, 'impersonate'])->name('impersonate');

    //super Admin dashboard route
    Route::get(
        '/dashboard',
        [DashboardController::class, 'SuperAdminDashboardData']
    )->name('super.admin.dashboard');
    Route::get(
        'revenue-chart',
        [DashboardController::class, 'getRevenueChartData']
    )->name('super-admin.revenue-chart');
    // Super Admin route
    Route::resource('super-admins', SuperAdminController::class);

    // User route
    Route::resource('users', UserController::class);
	// Route::resource('users', UserController::class);

    Route::post('users/{id}/is-verified', [UserController::class, 'isVerified'])->name('users.verified');
    Route::post(
        'users/{id}/active-deactive',
        [UserController::class, 'activeDeactiveStatus']
    )->name('users.status');
    Route::resource('subscription-plans', SubscriptionPlanController::class);
    Route::post(
        'subscription-plans/{user}/make-plan-as-default',
        [SubscriptionPlanController::class, 'makePlanDefault']
    )->name('make.plan.default');

    // Transactions routes
    Route::get(
        'transactions',
        [SubscriptionPlanController::class, 'showTransactionsLists']
    )->name('subscriptions.transactions.index');
    Route::get(
        'transactions/{subscription}',
        [SubscriptionPlanController::class, 'viewTransaction']
    )->name('subscriptions.transactions.show');
    Route::get(
        'change-payment-status/{id}',
        [SubscriptionPlanController::class, 'changePaymentStatus']
    )->name('change-payment-status');

    Route::name('super.admin.')->group(function () {
        Route::resource('currencies', AdminCurrencyController::class);
    });
    Route::get('new-user-settings', [UserSettingController::class, 'edit'])->name('new-user-settings.edit');
    Route::post('new-user-settings/update', [UserSettingController::class, 'update'])->name('new-user-settings.update');

    //enquires
    Route::get('enquiries', [SuperAdminEnquiryController::class, 'index'])->name('super.admin.enquiry.index');
    Route::delete(
        'enquiries/{enquiry}',
        [SuperAdminEnquiryController::class, 'destroy']
    )->name('super.admin.enquiry.destroy');
    Route::get(
        'enquiries/{enquiry}',
        [SuperAdminEnquiryController::class, 'show']
    )->name('super.admin.enquiry.show');

    //Landing CMS
    Route::get('section-one', [Landing\SectionOneController::class, 'index'])->name('super.admin.section.one');
    Route::put(
        'section-one/update',
        [Landing\SectionOneController::class, 'update']
    )->name('super.admin.section.one.update');
    Route::get('section-two', [Landing\SectionTwoController::class, 'index'])->name('super.admin.section.two');
    Route::put(
        'section-two/update',
        [Landing\SectionTwoController::class, 'update']
    )->name('super.admin.section.two.update');
    Route::get(
        'section-three',
        [Landing\SectionThreeController::class, 'index']
    )->name('super.admin.section.three');
    Route::put(
        'section-three/update',
        [Landing\SectionThreeController::class, 'update']
    )->name('super.admin.section.three.update');

    Route::resource('faqs', FaqController::class);
    Route::post('faqs/{faqs}', [FaqController::class, 'update'])->name('faqs-update');
    Route::resource('admin-testimonial', Landing\AdminTestimonialController::class);

    // setting routes
    Route::get(
        'general-settings',
        [SettingController::class, 'editSuperAdminSettings']
    )->name('super.admin.settings.edit');
    Route::post(
        'general-settings',
        [SettingController::class, 'updateSuperAdminSettings']
    )->name('super.admin.settings.update')->withoutMiddleware('xss');
    Route::get(
        'footer-settings',
        [SettingController::class, 'editSuperAdminFooterSettings']
    )->name('super.admin.footer.settings.edit');
    Route::post(
        'footer-settings',
        [SettingController::class, 'updateSuperAdminFooterSettings']
    )->name('super.admin.footer.settings.update');

    // Subscribers Route
    Route::get('subscribers', [Landing\SubscriberController::class, 'index'])->name('super.admin.subscribe.index');
    Route::delete(
        'subscribers/{subscriber}',
        [Landing\SubscriberController::class, 'destroy']
    )->name('super.admin.subscribe.destroy');
    Route::get(
        '/subscribers-excel',
        [Landing\SubscriberController::class, 'exportSubscribersExcel']
    )->name('super.admin.subscribe.excel');

    // download payment attachments zip route
    Route::get(
        'download-attachments/{transactionId}',
        [SubscriptionPlanController::class, 'downloadAttachments']
    )->name('download.attachments');
});

Route::get(
    'my-transactions',
    [
        SubscriptionPlanController::class, 'showTransactionsLists',
    ]
)->name('subscriptions.plans.transactions.index');
Route::get(
    'my-transactions/{subscription}',
    [SubscriptionPlanController::class, 'viewTransaction']
)->name('subscriptions.plans.transactions.show');

Route::prefix('client')->middleware(['auth', 'xss', 'role:client', 'multi_tenant'])->group(function () {
    Route::get(
        'dashboard',
        [Client\DashboardController::class, 'index']
    )->name('client.dashboard');

    //Invoice
    Route::get(
        'invoices',
        [Client\InvoiceController::class, 'index']
    )->name('client.invoices.index');
    Route::get(
        'invoices/{invoice}',
        [Client\InvoiceController::class, 'show']
    )->name('client.invoices.show')->withoutMiddleware('multi_tenant');
    Route::get('invoices/{invoice}/pdf', [
        Client\InvoiceController::class, 'convertToPdf',
    ])->name('clients.invoices.pdf')->withoutMiddleware('multi_tenant');

    //Quote
    Route::name('client.')->group(function () {
        Route::resource('quotes', Client\QuoteController::class);
    });
    Route::get(
        'quotes/{quote}',
        [Client\QuoteController::class, 'show']
    )->name('client.quotes.show')->withoutMiddleware('multi_tenant');
    Route::get(
        'quotes/quotes/{quote}/pdf',
        [Client\QuoteController::class, 'convertToPdf']
    )->name('client.quotes.pdf')->withoutMiddleware('multi_tenant');

    //Payments
    Route::get('invoices/{invoice}/payment', [Client\PaymentController::class, 'show'])->name('clients.payments.show');
    Route::get('transactions', [Client\PaymentController::class, 'index'])->name('client.transactions.index');

    // stripe payment route
    Route::post('stripe-payment', [Client\StripeController::class, 'createSession'])->name('client.stripe-payment');
    Route::get('payment-success', [Client\StripeController::class, 'paymentSuccess'])->name('client.payment-success');
    Route::get(
        'failed-payment',
        [Client\StripeController::class, 'handleFailedPayment']
    )->name('client.failed-payment');

    // paypal payment route
    Route::get('paypal-onboard', [Client\PaypalController::class, 'onBoardForPublic'])->name('client.paypal.init');
    Route::get('paypal-payment-success', [Client\PaypalController::class, 'success'])->name('client.paypal.success');
    Route::get('paypal-payment-failed', [Client\PaypalController::class, 'failed'])->name('client.paypal.failed');

    // razorpay payment
    Route::get('razorpay-onboard', [Client\RazorpayController::class, 'onBoard'])->name('razorpay.init');
    Route::post('razorpay-payment-success', [Client\RazorpayController::class, 'paymentSuccess'])
        ->name('razorpay.success');
    Route::post('razorpay-payment-failed', [Client\RazorpayController::class, 'paymentFailed'])
        ->name('razorpay.failed');
    Route::get('razorpay-payment-webhook', [Client\RazorpayController::class, 'paymentSuccessWebHook'])
        ->name('razorpay.webhook');

    //export Excel file
    Route::get(
        'quotes-excel',
        [Client\QuoteController::class, 'exportQuotesExcel']
    )->name('client.quotesExcel');
    // export quotes Pdf in client route
    Route::get('quotes-pdf', [Client\QuoteController::class, 'exportQuotesPdf'])->name('client.export.quotes.pdf');
    Route::get(
        'invoice-excel',
        [client\InvoiceController::class, 'exportInvoicesExcel']
    )->name('client.invoicesExcel');
    // Export invoices pdf for client route
    Route::get(
        'invoice-pdf',
        [client\InvoiceController::class, 'exportInvoicesPdf']
    )->name('client.invoices.pdf');
    Route::get('transactions-excel', [client\PaymentController::class, 'exportTransactionsExcel'])->name('client.transactionsExcel');
    // Export transactions pdf for client route
    Route::get('transactions-pdf', [client\PaymentController::class, 'exportTransactionsPdf'])->name('client.export.transactions.pdf');

    Route::post('change-tenant-client', [client\DashboardController::class, 'changeTenantClient'])->name('change.tenant.client');

    // currency reports for invoices route
    Route::get('currency-reports', [DashboardController::class, 'currencyReports'])->name('client.currency.reports');
});

Route::middleware(['auth', 'xss', 'multi_tenant', 'checkUserStatus'])->group(function () {
    // Get Product In Quotes
    Route::get('quotes/{productId}/product', [QuoteController::class, 'getProduct'])->name('quotes.get-product');

    // Download payment attachment
    Route::get('transactions-attachment/{id}', [PaymentController::class, 'downloadAttachment'])->name('transaction.attachment');

    // Payment notes
    Route::get('payment-notes/{paymentId}', [PaymentController::class, 'showPaymentNotes'])->name('payment-notes.show');

    // Update profile
    Route::get('/profile/edit', [UserController::class, 'editProfile'])->name('profile.setting');
    Route::put('/profile/update', [UserController::class, 'updateProfile'])->name('update.profile.setting');
    Route::put('/change-user-password', [UserController::class, 'changePassword'])->name('user.changePassword');
});

Route::middleware(['auth', 'xss', 'role:admin', 'checkUserStatus'])->group(function () {
    //Subscription Pricing Plans
    Route::get(
        'subscription-plans',
        [SubscriptionPricingPlanController::class, 'index']
    )->name('subscription.pricing.plans.index');
    // routes for payment types.
    Route::get(
        'choose-payment-type/{planId}/{context?}/{fromScreen?}',
        [SubscriptionPricingPlanController::class, 'choosePaymentType']
    )->name('choose.payment.type');

    // stripe subscription transaction
    Route::post(
        'purchase-subscription',
        [SubscriptionController::class, 'purchaseSubscription']
    )->name('purchase-subscription');
    Route::get('payment-success', [SubscriptionController::class, 'paymentSuccess'])->name('payment-success');
    Route::get('failed-payment', [SubscriptionController::class, 'handleFailedPayment'])->name('failed-payment');
});
require __DIR__ . '/auth.php';

require __DIR__ . '/upgrade.php';

include 'landing.php';
