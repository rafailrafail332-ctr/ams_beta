<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = "localhost";
$db_user = "amsprope";
$db_pass = "X9182Ynrh+;XEv";
$db_name = "amsprope_amsdb";

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    // 1. Tabel Master Key-Value Sync
    $pdo->exec("CREATE TABLE IF NOT EXISTS ams_app_data (
        `key` VARCHAR(191) PRIMARY KEY,
        `value` LONGTEXT NOT NULL,
        `updated_at` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Tabel Relasi: Master Proyek
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_proyek (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nama_proyek` VARCHAR(150) NOT NULL UNIQUE,
        `lokasi` VARCHAR(255) NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 3. Tabel Relasi: Master Vendor
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_vendor (
        `id` VARCHAR(64) PRIMARY KEY,
        `nama` VARCHAR(150) NOT NULL,
        `no_hp` VARCHAR(50) NULL,
        `no_ktp` VARCHAR(50) NULL,
        `status` VARCHAR(50) DEFAULT 'Kontraktor',
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 4. Tabel Relasi: Master Tenaga Kerja / Tukang
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_tenaga_kerja (
        `id` VARCHAR(64) PRIMARY KEY,
        `nama` VARCHAR(150) NOT NULL,
        `status` VARCHAR(50) DEFAULT 'Tukang',
        `upah` DECIMAL(15,2) DEFAULT 0,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 5. Tabel Relasi: Master Karyawan
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_karyawan (
        `id` VARCHAR(64) PRIMARY KEY,
        `nama` VARCHAR(150) NOT NULL,
        `no_hp` VARCHAR(50) NULL,
        `nik` VARCHAR(50) NULL,
        `ttl` VARCHAR(100) NULL,
        `alamat` TEXT NULL,
        `divisi` VARCHAR(100) DEFAULT 'Teknik & Konstruksi',
        `jabatan` VARCHAR(100) NULL,
        `status_nikah` VARCHAR(50) DEFAULT 'Menikah',
        `ktp_file` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 6. Tabel Relasi: Master Unit Kavling
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_unit_kavling (
        `id` VARCHAR(64) PRIMARY KEY,
        `proyek` VARCHAR(150) NOT NULL,
        `blok` VARCHAR(50) NOT NULL,
        `nomor` VARCHAR(50) NOT NULL,
        `type` VARCHAR(50) NULL,
        `lb` DECIMAL(10,2) DEFAULT 0,
        `lt` DECIMAL(10,2) DEFAULT 0,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 7. Tabel Relasi: Master Konsumen & Calon Konsumen
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_konsumen (
        `id` VARCHAR(64) PRIMARY KEY,
        `tipe` ENUM('KONSUMEN', 'CALON') DEFAULT 'KONSUMEN',
        `nama` VARCHAR(150) NOT NULL,
        `no_hp` VARCHAR(50) NULL,
        `nik` VARCHAR(50) NULL,
        `npwp` VARCHAR(50) NULL,
        `alamat` TEXT NULL,
        `domisili` VARCHAR(150) NULL,
        `referensi` VARCHAR(150) NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 8. Tabel Relasi: Absensi Tenaga Kerja
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_absen_harian (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `nama` VARCHAR(150) NOT NULL,
        `status` VARCHAR(50) DEFAULT 'Tukang',
        `jam_masuk` VARCHAR(20) NULL,
        `jam_pulang` VARCHAR(20) NULL,
        `lembur_jam` DECIMAL(5,2) DEFAULT 0,
        `lokasi_tipe` VARCHAR(50) DEFAULT 'kavling',
        `blok` VARCHAR(50) NULL,
        `no_unit` VARCHAR(50) NULL,
        `umum` VARCHAR(150) NULL,
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 9. Tabel Relasi: Header Lembar RAB (SPK Borongan)
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_rab_borongan (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_spk` VARCHAR(100) NOT NULL,
        `tanggal` DATE NULL,
        `proyek` VARCHAR(150) NULL,
        `nama_vendor` VARCHAR(150) NULL,
        `blok` VARCHAR(50) NULL,
        `no_unit` VARCHAR(50) NULL,
        `fasum` VARCHAR(150) NULL,
        `pekerjaan` VARCHAR(255) NULL,
        `retensi_persen` DECIMAL(5,2) DEFAULT 5.00,
        `pembayaran_sebelumnya` DECIMAL(18,2) DEFAULT 0,
        `tanggal_opname` DATE NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 10. Tabel Relasi: Rincian Item Pekerjaan RAB (Foreign Key ke tbl_rab_borongan)
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_rab_items (
        `id` VARCHAR(64) PRIMARY KEY,
        `rab_id` VARCHAR(64) NOT NULL,
        `item_pekerjaan` VARCHAR(255) NOT NULL,
        `spesifikasi` VARCHAR(255) NULL,
        `vol` DECIMAL(15,2) DEFAULT 0,
        `sat` VARCHAR(50) DEFAULT 'm2',
        `harga_satuan` DECIMAL(18,2) DEFAULT 0,
        `jumlah` DECIMAL(18,2) DEFAULT 0,
        `bobot_ratio` DECIMAL(8,4) DEFAULT 0,
        `progress` DECIMAL(8,2) DEFAULT 0,
        `bobot_progress` DECIMAL(12,4) DEFAULT 0,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`rab_id`) REFERENCES tbl_rab_borongan(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 11. Tabel Relasi: Riwayat Opname Pekerjaan (Foreign Key ke tbl_rab_borongan)
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_rab_opname_history (
        `id` VARCHAR(64) PRIMARY KEY,
        `rab_id` VARCHAR(64) NOT NULL,
        `tanggal` DATE NOT NULL,
        `pengawas` VARCHAR(150) NULL,
        `catatan` TEXT NULL,
        `progres_hasil` DECIMAL(8,2) DEFAULT 0,
        `nilai_opname` DECIMAL(18,2) DEFAULT 0,
        `retensi_nilai` DECIMAL(18,2) DEFAULT 0,
        `nilai_progress` DECIMAL(18,2) DEFAULT 0,
        `pembayaran_sebelumnya` DECIMAL(18,2) DEFAULT 0,
        `pembayaran_saat_ini` DECIMAL(18,2) DEFAULT 0,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`rab_id`) REFERENCES tbl_rab_borongan(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection/schema failed: " . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

// ==========================================
// 1. GET OPERATIONS
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get') {
        $key = $_GET['key'] ?? '';
        if (!$key) {
            echo json_encode(["status" => "error", "message" => "Key is required"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT `value`, `updated_at` FROM ams_app_data WHERE `key` = ?");
        $stmt->execute([$key]);
        $row = $stmt->fetch();

        if ($row) {
            $val = json_decode($row['value'], true);
            echo json_encode([
                "status" => "success",
                "key" => $key,
                "value" => $val !== null ? $val : $row['value'],
                "updated_at" => $row['updated_at']
            ]);
        } else {
            echo json_encode(["status" => "not_found", "key" => $key]);
        }
        exit;
    }

    if ($action === 'list_all') {
        $stmt = $pdo->query("SELECT `key`, `updated_at` FROM ams_app_data");
        $rows = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $rows]);
        exit;
    }

    if ($action === 'tables_status') {
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(["status" => "success", "tables" => $tables]);
        exit;
    }
}

// ==========================================
// 2. POST OPERATIONS (SYNC TO KEY-VALUE & RELATIONAL TABLES)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    $key = $data['key'] ?? '';
    $value = $data['value'] ?? null;

    if (!$key || $value === null) {
        echo json_encode(["status" => "error", "message" => "Key and value are required"]);
        exit;
    }

    $jsonValue = is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE);
    $now = date('Y-m-d H:i:s');

    // 1. Simpan ke ams_app_data
    $stmt = $pdo->prepare("INSERT INTO ams_app_data (`key`, `value`, `updated_at`) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`)");
    $stmt->execute([$key, $jsonValue, $now]);

    // 2. Sinkronkan otomatis ke tabel relasi MySQL jika berupa array
    try {
        $parsed = is_array($value) ? $value : json_decode($value, true);

        // A. Relasi Vendor
        if (strpos($key, 'vendor') !== false && is_array($parsed)) {
            $stmt = $pdo->prepare("INSERT INTO tbl_vendor (`id`, `nama`, `no_hp`, `no_ktp`, `status`) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE `nama`=VALUES(`nama`), `no_hp`=VALUES(`no_hp`), `no_ktp`=VALUES(`no_ktp`), `status`=VALUES(`status`)");
            foreach ($parsed as $v) {
                if (!empty($v['id']) || !empty($v['nama'])) {
                    $vId = $v['id'] ?? ('vnd_'.substr(md5($v['nama']), 0, 8));
                    $stmt->execute([$vId, $v['nama'] ?? '', $v['noHp'] ?? '', $v['noKtp'] ?? '', $v['status'] ?? 'Kontraktor']);
                }
            }
        }

        // B. Relasi Tenaga Kerja
        if (strpos($key, 'database_tenaga_kerja') !== false && is_array($parsed)) {
            $stmt = $pdo->prepare("INSERT INTO tbl_tenaga_kerja (`id`, `nama`, `status`, `upah`) 
                VALUES (?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE `nama`=VALUES(`nama`), `status`=VALUES(`status`), `upah`=VALUES(`upah`)");
            foreach ($parsed as $w) {
                if (!empty($w['nama'])) {
                    $wId = $w['id'] ?? ('wrk_'.substr(md5($w['nama']), 0, 8));
                    $stmt->execute([$wId, $w['nama'], $w['status'] ?? 'Tukang', floatval($w['upah'] ?? 0)]);
                }
            }
        }

        // C. Relasi Absensi Harian
        if (strpos($key, 'absen') !== false && is_array($parsed)) {
            $stmt = $pdo->prepare("INSERT INTO tbl_absen_harian (`id`, `tanggal`, `nama`, `status`, `jam_masuk`, `jam_pulang`, `lembur_jam`, `lokasi_tipe`, `blok`, `no_unit`, `umum`, `catatan`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `lembur_jam`=VALUES(`lembur_jam`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $a) {
                if (!empty($a['nama'])) {
                    $aId = $a['id'] ?? ('abs_'.substr(md5(($a['tanggal']??'').$a['nama']), 0, 10));
                    $tgl = !empty($a['tanggal']) && $a['tanggal'] !== '-' ? $a['tanggal'] : date('Y-m-d');
                    $stmt->execute([
                        $aId, $tgl, $a['nama'], $a['status'] ?? 'Tukang', $a['jamMasuk'] ?? '', $a['jamPulang'] ?? '',
                        floatval($a['lemburJam'] ?? 0), $a['lokasiTipe'] ?? 'kavling', $a['blok'] ?? '', $a['no'] ?? '', $a['umum'] ?? '', $a['catatan'] ?? ''
                    ]);
                }
            }
        }

        // D. Relasi Lembar RAB, Items, dan Opname History
        if (strpos($key, 'rab_sheets') !== false && is_array($parsed)) {
            $stmtRab = $pdo->prepare("INSERT INTO tbl_rab_borongan (`id`, `no_spk`, `tanggal`, `proyek`, `nama_vendor`, `blok`, `no_unit`, `fasum`, `pekerjaan`, `retensi_persen`, `pembayaran_sebelumnya`, `tanggal_opname`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE `no_spk`=VALUES(`no_spk`), `proyek`=VALUES(`proyek`), `nama_vendor`=VALUES(`nama_vendor`), `pembayaran_sebelumnya`=VALUES(`pembayaran_sebelumnya`), `tanggal_opname`=VALUES(`tanggal_opname`)");
            
            $stmtItem = $pdo->prepare("INSERT INTO tbl_rab_items (`id`, `rab_id`, `item_pekerjaan`, `spesifikasi`, `vol`, `sat`, `harga_satuan`, `jumlah`, `bobot_ratio`, `progress`, `bobot_progress`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE `item_pekerjaan`=VALUES(`item_pekerjaan`), `vol`=VALUES(`vol`), `harga_satuan`=VALUES(`harga_satuan`), `jumlah`=VALUES(`jumlah`), `progress`=VALUES(`progress`)");

            foreach ($parsed as $r) {
                if (!empty($r['id'])) {
                    $rTgl = !empty($r['tanggal']) && $r['tanggal'] !== '-' ? $r['tanggal'] : null;
                    $rOpnTgl = !empty($r['tanggalOpname']) && $r['tanggalOpname'] !== '-' ? $r['tanggalOpname'] : null;
                    $stmtRab->execute([
                        $r['id'], $r['noInput'] ?? '', $rTgl, $r['proyek'] ?? '', $r['namaVendor'] ?? '',
                        $r['blok'] ?? '', $r['noUnit'] ?? '', $r['fasum'] ?? '', $r['pekerjaan'] ?? '',
                        floatval($r['retensiPersen'] ?? 5), floatval($r['pembayaranSebelumnya'] ?? 0), $rOpnTgl
                    ]);

                    if (!empty($r['items']) && is_array($r['items'])) {
                        foreach ($r['items'] as $it) {
                            if (!empty($it['id'])) {
                                $stmtItem->execute([
                                    $it['id'], $r['id'], $it['itemPekerjaan'] ?? '', $it['spesifikasi'] ?? '',
                                    floatval($it['vol'] ?? 0), $it['sat'] ?? 'm2', floatval($it['hargaSatuan'] ?? 0),
                                    floatval($it['jumlah'] ?? 0), floatval($it['bobotRatio'] ?? 0), floatval($it['progress'] ?? 0),
                                    floatval($it['bobotProgress'] ?? 0)
                                ]);
                            }
                        }
                    }
                }
            }
        }
    } catch (Exception $relEx) {
        // Relational sync error logged silently without interrupting master sync
    }

    echo json_encode(["status" => "success", "key" => $key, "updated_at" => $now]);
    exit;
}

echo json_encode(["status" => "ready", "service" => "AMS Relational MySQL Engine", "database" => $db_name]);
