<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        $data = [
            'title' => 'AMS',
            'subtitle' => 'Login',
        ];
        return view('auth/login.php', $data);
    }

    public function register()
    {
        $data = [
            'title' => 'AMS',
            'subtitle' => 'Register',
        ];
        return view('auth/register.php', $data);
    }

    public function user()
    {
        $data = [
            'title' => 'AMS',
            'subtitle' => 'Dashboard',
        ];
        return view('user/index', $data);
    }
}
