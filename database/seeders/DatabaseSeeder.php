<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        $this->call(DefaultPermissionSeeder::class);
        $this->call(DefaultCountriesSeeder::class);
        $this->call(DefaultCurrencySeeder::class);
        $this->call(DefaultRoleSeeder::class);
        $this->call(DefaultUserSeeder::class);
        $this->call(SuperAdminSettingsTableSeeder::class);
        $this->call(SuperAdminFooterSettingsSeeder::class);
        $this->call(LandingSectionOneTableSeeder::class);
        $this->call(LandingSectionTwoTableSeeder::class);
        $this->call(LandingSectionThreeTableSeeder::class);
        $this->call(FaqsTableSeeder::class);
        $this->call(AdminTestimonialSeeder::class);
        $this->call(AddDashboardAndSettingPermissionsSeeder::class);
        $this->call(AddPurchaseAndSalePermissionsSeeder::class);
        $this->call(AddPurchaseReturnAndSaleReturnPermissionsSeeder::class);
        $this->call(AddAddressFieldsInSettingSeeder::class);
        $this->call(AddAdjustmentAndTrandferPermissionsSeeder::class);
        $this->call(AddDefaultSettingPostcodeSeeder::class);
        $this->call(AddIsDefaultBaseUnitTableSeeder::class);
        $this->call(AddPurchaseAndSalePermissionsSeeder::class);
        $this->call(AddSettingPrefixCodeSeeder::class);
        $this->call(AddSmsPermissionsSeeder::class);
        $this->call(AddVersionFooterKeySettingTableSeeder::class);
        $this->call(AdminTestimonialSeeder::class);
        $this->call(AssignAllPermissionAdminRole::class);
        $this->call(DefaultBaseUnitSeeder::class);
        $this->call(DefaultEmailTemplateSeeder::class);
        $this->call(DefaultLanguageTableSeeder::class);
        $this->call(DefaultPermissionEmailReportQuotationSeeder::class);
        $this->call(DefaultSettingCurrencyRightSeeder::class);
        $this->call(DefaultSettingDateFormatSeeder::class);
        $this->call(DefaultSettingsCountryStatePostcodeSeeder::class);
        $this->call(DefaultSmsSettingsSeeder::class);
        $this->call(DefaultSmsTemplateSeeder::class);
        $this->call(DefaultSubscriptionPlanTableSeeder::class);
        $this->call(InvoiceSettingTableSeeder::class);
        $this->call(InvoiceSettingTemplateSeeder::class);
        $this->call(NewUserSettingsTableSeeder::class);
        $this->call(SettingsTableSeeder::class);
        $this->call(SettingTableSeederFields::class);
        $this->call(SettingTablePaymentGatewayFieldSeeder::class);
        $this->call(ShowProductDescriptionKeyInInvoiceSettingSeeder::class);
        
    }
}
