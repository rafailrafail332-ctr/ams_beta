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

// Konfigurasi Database Terpusat Hostinger
$db_host = "127.0.0.1";
$db_user = "u643087735_ams";
$db_pass = "Ams2026#";
$db_name = "u643087735_ams";

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    // =========================================================================
    // 1. TABEL MASTER REAL-TIME KEY-VALUE (Menyimpan 100% State & Media Objek)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS ams_app_data (
        `key` VARCHAR(191) PRIMARY KEY,
        `value` LONGTEXT NOT NULL,
        `updated_at` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 2. TABEL USERS / PENGGUNA SISTEM LENGKAP
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_users (
        `id` VARCHAR(64) PRIMARY KEY,
        `username` VARCHAR(100) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `nama_lengkap` VARCHAR(150) NOT NULL,
        `email` VARCHAR(150) NULL,
        `no_hp` VARCHAR(50) NULL,
        `role` VARCHAR(50) DEFAULT 'Staff',
        `divisi` VARCHAR(100) DEFAULT 'Umum',
        `foto_profil` LONGTEXT NULL,
        `status` ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        `last_login` DATETIME NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 3. TABEL MEDIA / UPLOAD FOTO & DOKUMEN (Berkas Fisik & Base64 Terpusat)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_media_uploads (
        `id` VARCHAR(64) PRIMARY KEY,
        `kategori` VARCHAR(50) DEFAULT 'umum',
        `nama_file` VARCHAR(255) NOT NULL,
        `tipe_file` VARCHAR(100) NULL,
        `ukuran_file` BIGINT DEFAULT 0,
        `file_url` VARCHAR(500) NULL,
        `file_base64` LONGTEXT NULL,
        `keterangan` TEXT NULL,
        `uploaded_by` VARCHAR(100) NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 4. TABEL PROYEK, VENDOR, TENAGA KERJA, KARYAWAN, UNIT, KONSUMEN
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_proyek (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nama_proyek` VARCHAR(150) NOT NULL UNIQUE,
        `lokasi` VARCHAR(255) NULL,
        `deskripsi` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_vendor (
        `id` VARCHAR(64) PRIMARY KEY,
        `nama` VARCHAR(150) NOT NULL,
        `no_hp` VARCHAR(50) NULL,
        `no_ktp` VARCHAR(50) NULL,
        `status` VARCHAR(50) DEFAULT 'Kontraktor',
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_tenaga_kerja (
        `id` VARCHAR(64) PRIMARY KEY,
        `nama` VARCHAR(150) NOT NULL,
        `status` VARCHAR(50) DEFAULT 'Tukang',
        `upah` DECIMAL(15,2) DEFAULT 0,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

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
        `foto_profil` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_unit_kavling (
        `id` VARCHAR(64) PRIMARY KEY,
        `proyek` VARCHAR(150) NOT NULL,
        `blok` VARCHAR(50) NOT NULL,
        `nomor` VARCHAR(50) NOT NULL,
        `type` VARCHAR(50) NULL,
        `lb` DECIMAL(10,2) DEFAULT 0,
        `lt` DECIMAL(10,2) DEFAULT 0,
        `status_penjualan` VARCHAR(50) DEFAULT 'Tersedia',
        `harga` DECIMAL(18,2) DEFAULT 0,
        `foto_unit` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

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
        `berkas_ktp` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 5. TABEL PRESENSI GPS & TENAGA KERJA (DENGAN FOTO SELFIE / BUKTI)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_presensi_karyawan (
        `id` VARCHAR(64) PRIMARY KEY,
        `karyawan_id` VARCHAR(64) NULL,
        `nama` VARCHAR(150) NOT NULL,
        `tanggal` DATE NOT NULL,
        `jam_masuk` VARCHAR(20) NULL,
        `jam_pulang` VARCHAR(20) NULL,
        `lat` DECIMAL(11,8) NULL,
        `lng` DECIMAL(11,8) NULL,
        `alamat_lokasi` TEXT NULL,
        `foto_masuk` LONGTEXT NULL,
        `foto_pulang` LONGTEXT NULL,
        `status` VARCHAR(50) DEFAULT 'Hadir',
        `keterangan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

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
        `foto_bukti` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 6. TABEL SECURITY (TAMU, MATERIAL, PATROLI + FOTO)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_security_tamu (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `jam_masuk` VARCHAR(20) NULL,
        `jam_keluar` VARCHAR(20) NULL,
        `nama_tamu` VARCHAR(150) NOT NULL,
        `no_hp` VARCHAR(50) NULL,
        `keperluan` TEXT NULL,
        `tujuan_blok_unit` VARCHAR(100) NULL,
        `petugas` VARCHAR(150) NULL,
        `foto_identitas` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_security_material (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `jenis` ENUM('Masuk', 'Keluar') DEFAULT 'Masuk',
        `nama_material` VARCHAR(255) NOT NULL,
        `jumlah_satuan` VARCHAR(100) NULL,
        `pengirim_vendor` VARCHAR(150) NULL,
        `penerima` VARCHAR(150) NULL,
        `no_surat_jalan` VARCHAR(100) NULL,
        `foto_surat_jalan` LONGTEXT NULL,
        `petugas` VARCHAR(150) NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_security_patroli (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `jam` VARCHAR(20) NULL,
        `petugas` VARCHAR(150) NOT NULL,
        `titik_pos` VARCHAR(100) NOT NULL,
        `kondisi` VARCHAR(100) DEFAULT 'Aman Terkendali',
        `catatan` TEXT NULL,
        `foto_patroli` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 7. TABEL CLEANING / KEBERSIHAN (FOTO SEBELUM & SESUDAH)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_cleaning_checklist (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `area` VARCHAR(150) NOT NULL,
        `petugas` VARCHAR(150) NOT NULL,
        `status_kebersihan` VARCHAR(50) DEFAULT 'Bersih',
        `catatan` TEXT NULL,
        `foto_sebelum` LONGTEXT NULL,
        `foto_sesudah` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 8. TABEL KEUANGAN / KAS (PEMASUKAN & PENGELUARAN + FOTO NOTA / KUITANSI)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_kas_transaksi (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `jenis` ENUM('Pemasukan', 'Pengeluaran') NOT NULL,
        `kategori` VARCHAR(100) NOT NULL,
        `keterangan` TEXT NOT NULL,
        `nominal` DECIMAL(18,2) NOT NULL DEFAULT 0,
        `pic` VARCHAR(150) NULL,
        `foto_kuitansi` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 9. TABEL TUGAS & INSTRUKSI KERJA (TO-DO + FOTO BUKTI SELESAI)
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_instruksi_tugas (
        `id` VARCHAR(64) PRIMARY KEY,
        `tanggal` DATE NOT NULL,
        `judul_tugas` VARCHAR(255) NOT NULL,
        `karyawan_target` VARCHAR(150) NOT NULL,
        `prioritas` VARCHAR(50) DEFAULT 'Normal',
        `status` VARCHAR(50) DEFAULT 'Pending',
        `catatan` TEXT NULL,
        `foto_bukti` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 10. TABEL KPI EVALUASI PERFORMA BULANAN
    // =========================================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_kpi_evaluasi (
        `id` VARCHAR(64) PRIMARY KEY,
        `nama_karyawan` VARCHAR(150) NOT NULL,
        `divisi` VARCHAR(100) NULL,
        `bulan` VARCHAR(20) NOT NULL,
        `tahun` INT NOT NULL,
        `skor_disiplin` DECIMAL(5,2) DEFAULT 0,
        `skor_tugas` DECIMAL(5,2) DEFAULT 0,
        `skor_kerjasama` DECIMAL(5,2) DEFAULT 0,
        `skor_total` DECIMAL(5,2) DEFAULT 0,
        `grade` VARCHAR(10) DEFAULT 'B',
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // =========================================================================
    // 11. TABEL RAB BORONGAN, ITEMS & OPNAME
    // =========================================================================
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

// =============================================================================
// GET OPERATIONS
// =============================================================================
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
        echo json_encode([
            "status" => "success",
            "database" => $db_name,
            "total_tables" => count($tables),
            "tables" => $tables
        ]);
        exit;
    }

    if ($action === 'get_users') {
        $stmt = $pdo->query("SELECT `id`, `username`, `nama_lengkap`, `email`, `no_hp`, `role`, `divisi`, `foto_profil`, `status`, `last_login`, `created_at` FROM tbl_users ORDER BY `nama_lengkap` ASC");
        echo json_encode(["status" => "success", "users" => $stmt->fetchAll()]);
        exit;
    }

    if ($action === 'get_media') {
        $kategori = $_GET['kategori'] ?? '';
        if ($kategori) {
            $stmt = $pdo->prepare("SELECT `id`, `kategori`, `nama_file`, `tipe_file`, `ukuran_file`, `file_url`, `keterangan`, `uploaded_by`, `created_at` FROM tbl_media_uploads WHERE `kategori` = ? ORDER BY `created_at` DESC");
            $stmt->execute([$kategori]);
        } else {
            $stmt = $pdo->query("SELECT `id`, `kategori`, `nama_file`, `tipe_file`, `ukuran_file`, `file_url`, `keterangan`, `uploaded_by`, `created_at` FROM tbl_media_uploads ORDER BY `created_at` DESC LIMIT 100");
        }
        echo json_encode(["status" => "success", "media" => $stmt->fetchAll()]);
        exit;
    }
}

// =============================================================================
// POST OPERATIONS (UPLOAD FILE/FOTO, SINKRONISASI MASTER & TABEL RELASI)
// =============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // -------------------------------------------------------------------------
    // A. UPLOAD FILE / FOTO FISIK KE SERVER + REKAM KE TABEL tbl_media_uploads
    // -------------------------------------------------------------------------
    if ($action === 'upload') {
        $fileKey = isset($_FILES['file']) ? 'file' : (isset($_FILES['foto']) ? 'foto' : '');
        if (!$fileKey || empty($_FILES[$fileKey]['tmp_name'])) {
            echo json_encode(["status" => "error", "message" => "File tidak ditemukan dalam permintaan upload"]);
            exit;
        }

        $file = $_FILES[$fileKey];
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0777, true);
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
        if (!in_array($ext, $allowed)) {
            echo json_encode(["status" => "error", "message" => "Format file .$ext tidak diizinkan"]);
            exit;
        }

        $mediaId = 'med_' . uniqid() . '_' . substr(md5(microtime()), 0, 6);
        $cleanName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $file['name']);
        $newFileName = $mediaId . '_' . $cleanName;
        $targetPath = $uploadDir . $newFileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            $fileUrl = $protocol . $_SERVER['HTTP_HOST'] . '/uploads/' . $newFileName;
            $kategori = $_POST['kategori'] ?? 'umum';
            $keterangan = $_POST['keterangan'] ?? '';
            $uploadedBy = $_POST['uploaded_by'] ?? 'User';

            $stmt = $pdo->prepare("INSERT INTO tbl_media_uploads (`id`, `kategori`, `nama_file`, `tipe_file`, `ukuran_file`, `file_url`, `keterangan`, `uploaded_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$mediaId, $kategori, $file['name'], $file['type'], $file['size'], $fileUrl, $keterangan, $uploadedBy]);

            echo json_encode([
                "status" => "success",
                "message" => "Foto/berkas berhasil diunggah",
                "id" => $mediaId,
                "url" => $fileUrl,
                "nama_file" => $file['name'],
                "ukuran" => $file['size']
            ]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal memindahkan file ke direktori uploads"]);
            exit;
        }
    }

    // -------------------------------------------------------------------------
    // B. UPLOAD FOTO BERUPA BASE64 KE TABEL tbl_media_uploads & FILE
    // -------------------------------------------------------------------------
    if ($action === 'upload_base64') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);

        $base64Data = $body['base64'] ?? '';
        $fileName = $body['file_name'] ?? ('foto_' . time() . '.jpg');
        $kategori = $body['kategori'] ?? 'foto';
        $keterangan = $body['keterangan'] ?? '';
        $uploadedBy = $body['uploaded_by'] ?? 'User';

        if (!$base64Data) {
            echo json_encode(["status" => "error", "message" => "Data base64 tidak boleh kosong"]);
            exit;
        }

        $mediaId = 'med_' . uniqid() . '_' . substr(md5(microtime()), 0, 6);
        $fileUrl = null;

        // Ekstraksi data base64 ke file fisik jika ada header data:image/...
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
            $dataImg = substr($base64Data, strpos($base64Data, ',') + 1);
            $decoded = base64_decode($dataImg);
            if ($decoded !== false) {
                $ext = strtolower($type[1]);
                $uploadDir = __DIR__ . '/uploads/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                $newFileName = $mediaId . '.' . $ext;
                file_put_contents($uploadDir . $newFileName, $decoded);
                $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
                $fileUrl = $protocol . $_SERVER['HTTP_HOST'] . '/uploads/' . $newFileName;
            }
        }

        $stmt = $pdo->prepare("INSERT INTO tbl_media_uploads (`id`, `kategori`, `nama_file`, `tipe_file`, `ukuran_file`, `file_url`, `file_base64`, `keterangan`, `uploaded_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$mediaId, $kategori, $fileName, 'image/base64', strlen($base64Data), $fileUrl, $base64Data, $keterangan, $uploadedBy]);

        echo json_encode([
            "status" => "success",
            "id" => $mediaId,
            "url" => $fileUrl,
            "message" => "Foto berhasil disimpan ke database"
        ]);
        exit;
    }

    // -------------------------------------------------------------------------
    // C. SINKRONISASI UTAMA: ams_app_data + AUTO-MAP KE TABEL RELASIONAL
    // -------------------------------------------------------------------------
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    $key = $data['key'] ?? '';
    $value = $data['value'] ?? null;

    if (!$key || $value === null) {
        echo json_encode(["status" => "error", "message" => "Key dan value wajib diisi"]);
        exit;
    }

    $jsonValue = is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE);
    $now = date('Y-m-d H:i:s');

    // 1. Simpan ke ams_app_data (Kapasitas LONGTEXT hingga 4GB per key)
    $stmt = $pdo->prepare("INSERT INTO ams_app_data (`key`, `value`, `updated_at`) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`)");
    $stmt->execute([$key, $jsonValue, $now]);

    // 2. Sinkronkan otomatis ke tabel relasi MySQL jika berupa array
    try {
        $parsed = is_array($value) ? $value : json_decode($value, true);

        // A. Users / Akun Pengguna
        if (strpos($key, 'users') !== false && is_array($parsed)) {
            $stmtUser = $pdo->prepare("INSERT INTO tbl_users (`id`, `username`, `password`, `nama_lengkap`, `email`, `no_hp`, `role`, `divisi`, `foto_profil`, `status`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `nama_lengkap`=VALUES(`nama_lengkap`), `email`=VALUES(`email`), `no_hp`=VALUES(`no_hp`), `role`=VALUES(`role`), `foto_profil`=VALUES(`foto_profil`), `status`=VALUES(`status`)");
            foreach ($parsed as $u) {
                if (!empty($u['username']) || !empty($u['name']) || !empty($u['nama'])) {
                    $uId = $u['id'] ?? ('usr_' . substr(md5($u['username'] ?? ($u['name'] ?? '')), 0, 8));
                    $stmtUser->execute([
                        $uId,
                        $u['username'] ?? ('user_'.substr($uId, 4)),
                        $u['password'] ?? '123456',
                        $u['name'] ?? ($u['nama'] ?? ($u['username'] ?? '')),
                        $u['email'] ?? null,
                        $u['phone'] ?? ($u['noHp'] ?? null),
                        $u['role'] ?? 'Staff',
                        $u['divisi'] ?? 'Umum',
                        $u['avatar'] ?? ($u['foto'] ?? null),
                        $u['status'] ?? 'aktif'
                    ]);
                }
            }
        }

        // B. Presensi GPS Karyawan (dengan Foto Selfie / Absen)
        if (strpos($key, 'attendances') !== false && is_array($parsed)) {
            $stmtAtt = $pdo->prepare("INSERT INTO tbl_presensi_karyawan (`id`, `karyawan_id`, `nama`, `tanggal`, `jam_masuk`, `jam_pulang`, `lat`, `lng`, `alamat_lokasi`, `foto_masuk`, `foto_pulang`, `status`, `keterangan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `jam_pulang`=VALUES(`jam_pulang`), `foto_pulang`=VALUES(`foto_pulang`), `status`=VALUES(`status`), `keterangan`=VALUES(`keterangan`)");
            foreach ($parsed as $at) {
                if (!empty($at['name']) || !empty($at['nama'])) {
                    $atId = $at['id'] ?? ('att_' . substr(md5(($at['date'] ?? date('Y-m-d')) . ($at['name'] ?? $at['nama'])), 0, 10));
                    $stmtAtt->execute([
                        $atId,
                        $at['userId'] ?? ($at['karyawanId'] ?? null),
                        $at['name'] ?? $at['nama'],
                        $at['date'] ?? ($at['tanggal'] ?? date('Y-m-d')),
                        $at['clockIn'] ?? ($at['jamMasuk'] ?? null),
                        $at['clockOut'] ?? ($at['jamPulang'] ?? null),
                        isset($at['lat']) ? floatval($at['lat']) : null,
                        isset($at['lng']) ? floatval($at['lng']) : null,
                        $at['address'] ?? ($at['alamat'] ?? null),
                        $at['photoIn'] ?? ($at['fotoMasuk'] ?? null),
                        $at['photoOut'] ?? ($at['fotoPulang'] ?? null),
                        $at['status'] ?? 'Hadir',
                        $at['notes'] ?? ($at['keterangan'] ?? null)
                    ]);
                }
            }
        }

        // C. Security - Buku Tamu (dengan Foto)
        if (strpos($key, 'security_visitors') !== false && is_array($parsed)) {
            $stmtVis = $pdo->prepare("INSERT INTO tbl_security_tamu (`id`, `tanggal`, `jam_masuk`, `jam_keluar`, `nama_tamu`, `no_hp`, `keperluan`, `tujuan_blok_unit`, `petugas`, `foto_identitas`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `jam_keluar`=VALUES(`jam_keluar`), `foto_identitas`=VALUES(`foto_identitas`)");
            foreach ($parsed as $vis) {
                if (!empty($vis['name']) || !empty($vis['namaTamu'])) {
                    $vId = $vis['id'] ?? ('vis_' . substr(md5(microtime()), 0, 8));
                    $stmtVis->execute([
                        $vId,
                        $vis['date'] ?? ($vis['tanggal'] ?? date('Y-m-d')),
                        $vis['timeIn'] ?? ($vis['jamMasuk'] ?? null),
                        $vis['timeOut'] ?? ($vis['jamKeluar'] ?? null),
                        $vis['name'] ?? $vis['namaTamu'],
                        $vis['phone'] ?? ($vis['noHp'] ?? null),
                        $vis['purpose'] ?? ($vis['keperluan'] ?? null),
                        $vis['destination'] ?? ($vis['tujuan'] ?? null),
                        $vis['officer'] ?? ($vis['petugas'] ?? null),
                        $vis['photo'] ?? ($vis['foto'] ?? null)
                    ]);
                }
            }
        }

        // D. Security - Keluar Masuk Material (dengan Foto Surat Jalan)
        if (strpos($key, 'security_materials') !== false && is_array($parsed)) {
            $stmtMat = $pdo->prepare("INSERT INTO tbl_security_material (`id`, `tanggal`, `jenis`, `nama_material`, `jumlah_satuan`, `pengirim_vendor`, `penerima`, `no_surat_jalan`, `foto_surat_jalan`, `petugas`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `foto_surat_jalan`=VALUES(`foto_surat_jalan`)");
            foreach ($parsed as $mat) {
                if (!empty($mat['materialName']) || !empty($mat['namaMaterial'])) {
                    $mId = $mat['id'] ?? ('mat_' . substr(md5(microtime()), 0, 8));
                    $stmtMat->execute([
                        $mId,
                        $mat['date'] ?? ($mat['tanggal'] ?? date('Y-m-d')),
                        $mat['type'] ?? ($mat['jenis'] ?? 'Masuk'),
                        $mat['materialName'] ?? $mat['namaMaterial'],
                        $mat['quantity'] ?? ($mat['jumlah'] ?? null),
                        $mat['supplier'] ?? ($mat['vendor'] ?? null),
                        $mat['recipient'] ?? ($mat['penerima'] ?? null),
                        $mat['deliveryNote'] ?? ($mat['noSuratJalan'] ?? null),
                        $mat['photo'] ?? ($mat['foto'] ?? null),
                        $mat['officer'] ?? ($mat['petugas'] ?? null)
                    ]);
                }
            }
        }

        // E. Security - Patroli (dengan Foto Bukti)
        if (strpos($key, 'security_patrols') !== false && is_array($parsed)) {
            $stmtPat = $pdo->prepare("INSERT INTO tbl_security_patroli (`id`, `tanggal`, `jam`, `petugas`, `titik_pos`, `kondisi`, `catatan`, `foto_patroli`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `kondisi`=VALUES(`kondisi`), `foto_patroli`=VALUES(`foto_patroli`)");
            foreach ($parsed as $pat) {
                if (!empty($pat['checkpoint']) || !empty($pat['titikPos'])) {
                    $pId = $pat['id'] ?? ('pat_' . substr(md5(microtime()), 0, 8));
                    $stmtPat->execute([
                        $pId,
                        $pat['date'] ?? ($pat['tanggal'] ?? date('Y-m-d')),
                        $pat['time'] ?? ($pat['jam'] ?? null),
                        $pat['officer'] ?? ($pat['petugas'] ?? 'Petugas'),
                        $pat['checkpoint'] ?? ($pat['titikPos'] ?? 'Pos'),
                        $pat['condition'] ?? ($pat['kondisi'] ?? 'Aman Terkendali'),
                        $pat['notes'] ?? ($pat['catatan'] ?? null),
                        $pat['photo'] ?? ($pat['foto'] ?? null)
                    ]);
                }
            }
        }

        // F. Cleaning - Checklist Kebersihan (dengan Foto Sebelum & Sesudah)
        if (strpos($key, 'cleaning_checklists') !== false && is_array($parsed)) {
            $stmtCln = $pdo->prepare("INSERT INTO tbl_cleaning_checklist (`id`, `tanggal`, `area`, `petugas`, `status_kebersihan`, `catatan`, `foto_sebelum`, `foto_sesudah`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `status_kebersihan`=VALUES(`status_kebersihan`), `foto_sebelum`=VALUES(`foto_sebelum`), `foto_sesudah`=VALUES(`foto_sesudah`)");
            foreach ($parsed as $cln) {
                if (!empty($cln['area'])) {
                    $cId = $cln['id'] ?? ('cln_' . substr(md5(microtime()), 0, 8));
                    $stmtCln->execute([
                        $cId,
                        $cln['date'] ?? ($cln['tanggal'] ?? date('Y-m-d')),
                        $cln['area'],
                        $cln['cleaner'] ?? ($cln['petugas'] ?? 'Petugas'),
                        $cln['status'] ?? ($cln['statusKebersihan'] ?? 'Bersih'),
                        $cln['notes'] ?? ($cln['catatan'] ?? null),
                        $cln['photoBefore'] ?? ($cln['fotoSebelum'] ?? null),
                        $cln['photoAfter'] ?? ($cln['fotoSesudah'] ?? null)
                    ]);
                }
            }
        }

        // G. Keuangan - Transaksi Kas Masuk/Keluar (dengan Foto Kuitansi/Nota)
        if (strpos($key, 'cash_transactions') !== false && is_array($parsed)) {
            $stmtKas = $pdo->prepare("INSERT INTO tbl_kas_transaksi (`id`, `tanggal`, `jenis`, `kategori`, `keterangan`, `nominal`, `pic`, `foto_kuitansi`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `nominal`=VALUES(`nominal`), `foto_kuitansi`=VALUES(`foto_kuitansi`)");
            foreach ($parsed as $kas) {
                if (!empty($kas['description']) || !empty($kas['keterangan'])) {
                    $kId = $kas['id'] ?? ('kas_' . substr(md5(microtime()), 0, 8));
                    $stmtKas->execute([
                        $kId,
                        $kas['date'] ?? ($kas['tanggal'] ?? date('Y-m-d')),
                        $kas['type'] ?? ($kas['jenis'] ?? 'Pengeluaran'),
                        $kas['category'] ?? ($kas['kategori'] ?? 'Umum'),
                        $kas['description'] ?? ($kas['keterangan'] ?? ''),
                        floatval($kas['amount'] ?? ($kas['nominal'] ?? 0)),
                        $kas['pic'] ?? ($kas['penanggungJawab'] ?? null),
                        $kas['receiptPhoto'] ?? ($kas['fotoNota'] ?? ($kas['receipt'] ?? null))
                    ]);
                }
            }
        }

        // H. To-Do List Instruksi Tugas (dengan Foto Bukti)
        if (strpos($key, 'todo_list') !== false && is_array($parsed)) {
            $stmtTodo = $pdo->prepare("INSERT INTO tbl_instruksi_tugas (`id`, `tanggal`, `judul_tugas`, `karyawan_target`, `prioritas`, `status`, `catatan`, `foto_bukti`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `foto_bukti`=VALUES(`foto_bukti`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $td) {
                if (!empty($td['task']) || !empty($td['judulTugas'])) {
                    $tId = $td['id'] ?? ('tdo_' . substr(md5(microtime()), 0, 8));
                    $stmtTodo->execute([
                        $tId,
                        $td['date'] ?? ($td['tanggal'] ?? date('Y-m-d')),
                        $td['task'] ?? ($td['judulTugas'] ?? ''),
                        $td['assignee'] ?? ($td['karyawanTarget'] ?? ''),
                        $td['priority'] ?? ($td['prioritas'] ?? 'Normal'),
                        $td['status'] ?? 'Pending',
                        $td['notes'] ?? ($td['catatan'] ?? null),
                        $td['photo'] ?? ($td['fotoBukti'] ?? null)
                    ]);
                }
            }
        }

        // I. KPI Evaluasi Performa
        if (strpos($key, 'kpi_data') !== false && is_array($parsed)) {
            $stmtKpi = $pdo->prepare("INSERT INTO tbl_kpi_evaluasi (`id`, `nama_karyawan`, `divisi`, `bulan`, `tahun`, `skor_disiplin`, `skor_tugas`, `skor_kerjasama`, `skor_total`, `grade`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `skor_disiplin`=VALUES(`skor_disiplin`), `skor_tugas`=VALUES(`skor_tugas`), `skor_total`=VALUES(`skor_total`), `grade`=VALUES(`grade`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $kp) {
                if (!empty($kp['employeeName']) || !empty($kp['namaKaryawan'])) {
                    $kpId = $kp['id'] ?? ('kpi_' . substr(md5(($kp['employeeName']??'').($kp['month']??'').($kp['year']??'')), 0, 10));
                    $stmtKpi->execute([
                        $kpId,
                        $kp['employeeName'] ?? ($kp['namaKaryawan'] ?? ''),
                        $kp['division'] ?? ($kp['divisi'] ?? 'Umum'),
                        $kp['month'] ?? ($kp['bulan'] ?? date('F')),
                        intval($kp['year'] ?? ($kp['tahun'] ?? date('Y'))),
                        floatval($kp['disciplineScore'] ?? ($kp['skorDisiplin'] ?? 0)),
                        floatval($kp['taskScore'] ?? ($kp['skorTugas'] ?? 0)),
                        floatval($kp['cooperationScore'] ?? ($kp['skorKerjasama'] ?? 0)),
                        floatval($kp['totalScore'] ?? ($kp['skorTotal'] ?? 0)),
                        $kp['grade'] ?? 'B',
                        $kp['notes'] ?? ($kp['catatan'] ?? null)
                    ]);
                }
            }
        }

        // J. Relasi Vendor
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

        // K. Relasi Tenaga Kerja
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

        // L. Relasi Absensi Harian Tenaga Kerja
        if (strpos($key, 'absen') !== false && strpos($key, 'karyawan') === false && is_array($parsed)) {
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

        // M. Relasi Lembar RAB, Items, dan Opname History
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
        // Relational sync error di-handle dengan aman tanpa membatalkan sync ams_app_data
    }

    echo json_encode(["status" => "success", "key" => $key, "updated_at" => $now]);
    exit;
}

echo json_encode([
    "status" => "ready",
    "service" => "AMS Relational MySQL Engine & Media Storage",
    "database" => $db_name,
    "version" => "2.5.0"
]);
