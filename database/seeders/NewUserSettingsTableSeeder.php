<?php

namespace Database\Seeders;

use App\Models\UserSetting;
use Illuminate\Database\Seeder;

class NewUserSettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $imageUrl = 'assets/images/infyom.png';
        $faviconImageUrl = 'images/favicon.png';

        UserSetting::create([
            'key' => 'app_name', 'value' => 'InfyInvoice',
        ]);
        UserSetting::create([
            'key' => 'app_logo', 'value' => $imageUrl,
        ]);
        UserSetting::create([
            'key' => 'company_name', 'value' => 'InfyOm',
        ]);
        UserSetting::create([
            'key' => 'country_code', 'value' => 'pt',
        ]);
        UserSetting::create([
            'key' => 'company_phone', 'value' => '+6562622678',
        ]);
        UserSetting::create([
            'key' => 'date_format', 'value' => 'm-d-Y',
        ]);
        UserSetting::create([
            'key' => 'time_zone', 'value' => 'America/Los_Angeles',
        ]);
        UserSetting::create([
            'key' => 'favicon_icon',
            'value' => $faviconImageUrl,
        ]);
        UserSetting::create([
            'key' => 'prefix_code', 'value' => '65',
        ]);
    }
}
