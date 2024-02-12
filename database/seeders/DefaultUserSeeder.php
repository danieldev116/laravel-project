<?php

namespace Database\Seeders;

use App\Models\MultiTenant;
use App\Models\Role as CustomRole;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::whereHas('roles', function ($q) {
            $q->where('name', CustomRole::ROLE_SUPER_ADMIN);
        })->exists();

        if (!$user) {
            $superAdminTenant = MultiTenant::create(['tenant_username' => 'superadmin']);
            $superAdmin = [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'hacker@stackfile.com',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('pa$$word'),
                'tenant_id' => $superAdminTenant->id,
            ];

            $user = User::create($superAdmin);
            $user->assignRole(CustomRole::ROLE_SUPER_ADMIN);

            session(['tenant_id' => $superAdminTenant->id]);


            $adminTenant = MultiTenant::create(['tenant_username' => 'admin']);
            $admin = [
                'first_name' => 'Admin',
                'last_name' => 'Admin',
                'email' => 'admin@stackfile.com',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('pa$$word'),
                'tenant_id' => $adminTenant->id,
            ];

            $user = User::create($admin);
            $user->assignRole(CustomRole::ROLE_ADMIN);

            $subscriptionPlan = SubscriptionPlan::where('is_default', 1)->first();

            $trialDays = $subscriptionPlan->trial_days ?? 30;
            $subscription = [
                'user_id' => $user->id,
                'subscription_plan_id' => $subscriptionPlan->id,
                'plan_amount' => $subscriptionPlan->price,
                'plan_frequency' => $subscriptionPlan->frequency,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays($trialDays),
                'trial_ends_at' => Carbon::now()->addDays($trialDays),
                'status' => Subscription::ACTIVE,
            ];
            Subscription::create($subscription);

            session(['tenant_id' => $adminTenant->id]);

            $imageUrl = 'assets/images/infyom.png';
            $faviconImageUrl = 'images/favicon.png';


            /** @var UserRepository $userRepo */
            $userRepo = App::make(UserRepository::class);
            $userRepo->addSettingRecord('app_name', $adminTenant->id, 'InfyInvoice');
            $userRepo->addSettingRecord('favicon_icon', $adminTenant->id, $faviconImageUrl);
            $userRepo->addSettingRecord('app_logo', $adminTenant->id, $imageUrl);
            $userRepo->addSettingRecord('company_name', $adminTenant->id, 'InfyOm');
            $userRepo->addSettingRecord('company_logo', $adminTenant->id);
            $userRepo->addSettingRecord('company_address', $adminTenant->id);
            $userRepo->addSettingRecord('company_phone', $adminTenant->id);
            $userRepo->addSettingRecord('date_format', $adminTenant->id, 'Y.m.d');
            $userRepo->addSettingRecord('currency_after_amount', $adminTenant->id, '1');
            $userRepo->addSettingRecord('payment_auto_approved', $adminTenant->id, '1');
            $userRepo->addSettingRecord('invoice_no_prefix', $adminTenant->id);
            $userRepo->addSettingRecord('invoice_no_suffix', $adminTenant->id);
            $userRepo->addSettingRecord('time_format', $adminTenant->id);
            $userRepo->addSettingRecord('time_zone', $adminTenant->id);
            $userRepo->addSettingRecord('current_currency', $adminTenant->id);
            $userRepo->addSettingRecord('stripe_key', $adminTenant->id);
            $userRepo->addSettingRecord('stripe_secret', $adminTenant->id);
            $userRepo->addSettingRecord('stripe_enabled', $adminTenant->id);
            $userRepo->addSettingRecord('paypal_client_id', $adminTenant->id);
            $userRepo->addSettingRecord('paypal_secret', $adminTenant->id);
            $userRepo->addSettingRecord('paypal_enabled', $adminTenant->id);
            $userRepo->addSettingRecord('razorpay_key', $adminTenant->id);
            $userRepo->addSettingRecord('razorpay_secret', $adminTenant->id);
            $userRepo->addSettingRecord('razorpay_enabled', $adminTenant->id);
            $userRepo->addSettingRecord('decimal_separator', $adminTenant->id, '.');
            $userRepo->addSettingRecord('thousand_separator', $adminTenant->id, ',');
            $userRepo->addSettingRecord('mail_notification', $adminTenant->id, 1);
            $userRepo->addSettingRecord('country_code', $adminTenant->id, 'in');
            $userRepo->addSettingRecord('default_invoice_template', $adminTenant->id);
            $userRepo->addSettingRecord('default_invoice_color', $adminTenant->id);
            $userRepo->addSettingRecord('show_product_description', $adminTenant->id, false);
        }
    }
}
