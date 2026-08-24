<?php

namespace App\Controllers;

class Teknik extends BaseController
{
    public function index()
    {
        $data = [
            'title' => 'AMS',
            'subtitle' => 'Teknik',
            'subtitle2' => 'Update Unit Rumah'
        ];
        return view('user/teknik/v_unit-rumah.php', $data);
    }

    public function tambah()
    {
        $data = [
            'title' => 'AMS',
            'subtitle' => 'Teknik',
            'subtitle2' => 'Tambah Unit Rumah'
        ];
        return view('user/teknik/add_unit-rumah.php', $data);
    }
}
