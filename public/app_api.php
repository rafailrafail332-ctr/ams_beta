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
$db_host = "localhost";
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
        `no_dok` VARCHAR(100) NULL,
        `nama` VARCHAR(150) NOT NULL,
        `no_hp` VARCHAR(50) NULL,
        `nik` VARCHAR(50) NULL,
        `npwp` VARCHAR(50) NULL,
        `no_rekening` VARCHAR(100) NULL,
        `alamat` TEXT NULL,
        `divisi` VARCHAR(100) DEFAULT 'Umum',
        `jabatan` VARCHAR(100) NULL,
        `penempatan` VARCHAR(150) NULL,
        `status` VARCHAR(100) DEFAULT 'Karyawan Tetap (PKWTT)',
        `nama_keluarga` TEXT NULL,
        `tanggal_masuk` DATE NULL,
        `ktp_file` LONGTEXT NULL,
        `foto_profil` LONGTEXT NULL,
        `files_json` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Pastikan kolom-kolom baru di tbl_karyawan sudah ada jika tabel sudah pernah dibuat sebelumnya
    try {
        $cols = $pdo->query("SHOW COLUMNS FROM tbl_karyawan")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('no_dok', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `no_dok` VARCHAR(100) NULL");
        if (!in_array('npwp', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `npwp` VARCHAR(50) NULL");
        if (!in_array('no_rekening', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `no_rekening` VARCHAR(100) NULL");
        if (!in_array('penempatan', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `penempatan` VARCHAR(150) NULL");
        if (!in_array('status', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `status` VARCHAR(100) DEFAULT 'Karyawan Tetap (PKWTT)'");
        if (!in_array('nama_keluarga', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `nama_keluarga` TEXT NULL");
        if (!in_array('tanggal_masuk', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `tanggal_masuk` DATE NULL");
        if (!in_array('files_json', $cols)) $pdo->exec("ALTER TABLE tbl_karyawan ADD COLUMN `files_json` LONGTEXT NULL");
    } catch (Exception $colEx) {}

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_recruitment_pelamar (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_dok` VARCHAR(100) NULL,
        `nama` VARCHAR(150) NOT NULL,
        `posisi` VARCHAR(150) NULL,
        `proyek` VARCHAR(150) NULL,
        `email` VARCHAR(150) NULL,
        `no_hp` VARCHAR(50) NULL,
        `status_tahap` VARCHAR(50) DEFAULT 'Interview User',
        `skor` VARCHAR(50) NULL,
        `tanggal_lamar` DATE NULL,
        `berkas_cv` LONGTEXT NULL,
        `media_sosial` LONGTEXT NULL,
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    try {
        $rpCols = $pdo->query("SHOW COLUMNS FROM tbl_recruitment_pelamar")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('media_sosial', $rpCols)) $pdo->exec("ALTER TABLE tbl_recruitment_pelamar ADD COLUMN `media_sosial` LONGTEXT NULL");
    } catch (Exception $rpEx) {}

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_kontrak_kerja (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_dok` VARCHAR(100) NOT NULL,
        `employee_id` VARCHAR(64) NULL,
        `nama` VARCHAR(150) NOT NULL,
        `nik` VARCHAR(50) NULL,
        `jabatan` VARCHAR(150) NULL,
        `penempatan` VARCHAR(150) NULL,
        `jenis_dokumen` VARCHAR(50) DEFAULT 'PKWT',
        `tanggal_mulai` DATE NULL,
        `tanggal_berakhir` DATE NULL,
        `gaji_pokok` DECIMAL(18,2) DEFAULT 0,
        `tunjangan` DECIMAL(18,2) DEFAULT 0,
        `status_kontrak` VARCHAR(50) DEFAULT 'Aktif',
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_aset_inventaris (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_dok` VARCHAR(100) NULL,
        `nama_aset` VARCHAR(255) NOT NULL,
        `jenis_aset` VARCHAR(100) NULL,
        `tahun_perolehan` VARCHAR(20) NULL,
        `tanggal_perolehan` DATE NULL,
        `harga` DECIMAL(18,2) DEFAULT 0,
        `lokasi` VARCHAR(150) NULL,
        `kondisi` VARCHAR(50) DEFAULT 'Baik',
        `penanggung_jawab` VARCHAR(150) NULL,
        `catatan` TEXT NULL,
        `foto_aset` LONGTEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_maintenance_tiket (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_dok` VARCHAR(100) NULL,
        `asset_id` VARCHAR(64) NULL,
        `nama_barang` VARCHAR(255) NOT NULL,
        `lokasi` VARCHAR(150) NULL,
        `jenis_kerusakan` TEXT NULL,
        `urgensi` VARCHAR(50) DEFAULT 'Normal',
        `pemohon` VARCHAR(150) NULL,
        `vendor` VARCHAR(150) NULL,
        `biaya` DECIMAL(18,2) DEFAULT 0,
        `status_maintenance` VARCHAR(50) DEFAULT 'Menunggu Maintenance',
        `status_pembayaran` VARCHAR(50) DEFAULT 'Pending',
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_fasilitas_kantor (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_dok` VARCHAR(100) NULL,
        `nama_fasilitas` VARCHAR(255) NOT NULL,
        `kategori` VARCHAR(100) NULL,
        `lokasi` VARCHAR(150) NULL,
        `jumlah` INT DEFAULT 1,
        `kondisi` VARCHAR(50) DEFAULT 'Baik',
        `penanggung_jawab` VARCHAR(150) NULL,
        `status` VARCHAR(50) DEFAULT 'Tersedia',
        `kelengkapan` TEXT NULL,
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_gathering_agenda (
        `id` VARCHAR(64) PRIMARY KEY,
        `no_dok` VARCHAR(100) NULL,
        `nama_event` VARCHAR(255) NOT NULL,
        `kategori` VARCHAR(100) NULL,
        `tanggal_mulai` DATE NULL,
        `tanggal_selesai` DATE NULL,
        `lokasi` VARCHAR(255) NULL,
        `penanggung_jawab` VARCHAR(150) NULL,
        `anggaran` DECIMAL(18,2) DEFAULT 0,
        `status` VARCHAR(50) DEFAULT 'Direncanakan',
        `catatan` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_cctv_monitoring (
        `id` VARCHAR(64) PRIMARY KEY,
        `kode_titik` VARCHAR(50) NOT NULL,
        `nama_kamera` VARCHAR(255) NOT NULL,
        `lokasi` VARCHAR(150) NULL,
        `ip_address` VARCHAR(100) NULL,
        `tipe_kamera` VARCHAR(100) DEFAULT 'IP Camera Outdoor',
        `status` VARCHAR(50) DEFAULT 'ONLINE',
        `resolusi` VARCHAR(50) DEFAULT '4K / 8MP',
        `catatan` TEXT NULL,
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

    // 16. TABEL BAGAN AKUN (CHART OF ACCOUNTS - COA / ACCOUNT LIST)
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_coa (
        `code` VARCHAR(50) PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `parent_code` VARCHAR(50) NULL,
        `level` INT DEFAULT 1,
        `kriteria` VARCHAR(20) DEFAULT 'Detail',
        `posisi` VARCHAR(20) DEFAULT 'Debet',
        `category` VARCHAR(100) NULL,
        `balance` DECIMAL(18,2) DEFAULT 0,
        `description` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_parent` (`parent_code`),
        INDEX `idx_kriteria` (`kriteria`),
        INDEX `idx_category` (`category`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 17. TABEL JOBLIST & SUB-PEKERJAAN PROYEK (2-LEVEL COST CENTER)
    $pdo->exec("CREATE TABLE IF NOT EXISTS tbl_joblist (
        `code` VARCHAR(50) PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `parent_code` VARCHAR(50) NULL,
        `level` INT DEFAULT 1,
        `type` VARCHAR(50) DEFAULT 'Project',
        `description` TEXT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_parent` (`parent_code`),
        INDEX `idx_level` (`level`),
        INDEX `idx_type` (`type`)
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
                        $vis['destination'] ?? ($vis['tujuan'] ?? ($vis['blokTujuan'] ?? null)),
                        $vis['officer'] ?? ($vis['petugas'] ?? ($vis['petugasSatpam'] ?? null)),
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
                        $mat['supplier'] ?? ($mat['vendor'] ?? ($mat['namaVendor'] ?? null)),
                        $mat['recipient'] ?? ($mat['penerima'] ?? null),
                        $mat['deliveryNote'] ?? ($mat['noSuratJalan'] ?? null),
                        $mat['photo'] ?? ($mat['foto'] ?? null),
                        $mat['officer'] ?? ($mat['petugas'] ?? ($mat['petugasSatpam'] ?? null))
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
                if (!empty($pat['checkpoint']) || !empty($pat['titikPos']) || !empty($pat['rutePatroli'])) {
                    $pId = $pat['id'] ?? ('pat_' . substr(md5(microtime()), 0, 8));
                    $stmtPat->execute([
                        $pId,
                        $pat['date'] ?? ($pat['tanggal'] ?? date('Y-m-d')),
                        $pat['time'] ?? ($pat['jam'] ?? ($pat['jamPatroli'] ?? null)),
                        $pat['officer'] ?? ($pat['petugas'] ?? 'Petugas'),
                        $pat['checkpoint'] ?? ($pat['titikPos'] ?? ($pat['rutePatroli'] ?? 'Pos')),
                        $pat['condition'] ?? ($pat['kondisi'] ?? ($pat['statusKawasan'] ?? 'Aman Terkendali')),
                        $pat['notes'] ?? ($pat['catatan'] ?? null),
                        $pat['photo'] ?? ($pat['foto'] ?? null)
                    ]);
                }
            }
        }

        // F. Cleaning - Checklist Kebersihan (dengan Foto Sebelum & Sesudah)
        if (strpos($key, 'cleaning') !== false && is_array($parsed)) {
            $stmtCln = $pdo->prepare("INSERT INTO tbl_cleaning_checklist (`id`, `tanggal`, `area`, `petugas`, `status_kebersihan`, `catatan`, `foto_sebelum`, `foto_sesudah`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `status_kebersihan`=VALUES(`status_kebersihan`), `foto_sebelum`=VALUES(`foto_sebelum`), `foto_sesudah`=VALUES(`foto_sesudah`)");
            foreach ($parsed as $cln) {
                if (!empty($cln['area']) || !empty($cln['namaArea'])) {
                    $cId = $cln['id'] ?? ('cln_' . substr(md5(microtime()), 0, 8));
                    $stmtCln->execute([
                        $cId,
                        $cln['date'] ?? ($cln['tanggal'] ?? date('Y-m-d')),
                        $cln['area'] ?? ($cln['namaArea'] ?? ''),
                        $cln['cleaner'] ?? ($cln['petugas'] ?? 'Petugas'),
                        $cln['status'] ?? ($cln['statusKebersihan'] ?? ($cln['kondisi'] ?? 'Bersih')),
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
        if ((strpos($key, 'todo') !== false || strpos($key, 'instruction') !== false) && is_array($parsed)) {
            $stmtTodo = $pdo->prepare("INSERT INTO tbl_instruksi_tugas (`id`, `tanggal`, `judul_tugas`, `karyawan_target`, `prioritas`, `status`, `catatan`, `foto_bukti`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `foto_bukti`=VALUES(`foto_bukti`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $td) {
                $taskTitle = $td['task'] ?? ($td['judulTugas'] ?? ($td['laporan'] ?? ($td['text'] ?? ($td['instruction'] ?? ''))));
                if (!empty($taskTitle)) {
                    $tId = $td['id'] ?? ('tdo_' . substr(md5(microtime()), 0, 8));
                    $stmtTodo->execute([
                        $tId,
                        $td['date'] ?? ($td['tanggal'] ?? date('Y-m-d')),
                        $taskTitle,
                        $td['assignee'] ?? ($td['karyawanTarget'] ?? ($td['pic'] ?? '')),
                        $td['priority'] ?? ($td['prioritas'] ?? 'Normal'),
                        $td['status'] ?? (!empty($td['completed']) ? 'Selesai' : 'Pending'),
                        $td['notes'] ?? ($td['catatan'] ?? ($td['reportNotes'] ?? null)),
                        $td['photo'] ?? ($td['fotoBukti'] ?? null)
                    ]);
                }
            }
        }

        // I. KPI Evaluasi Performa
        if ((strpos($key, 'kpi') !== false || strpos($key, 'scorecard') !== false) && is_array($parsed)) {
            $stmtKpi = $pdo->prepare("INSERT INTO tbl_kpi_evaluasi (`id`, `nama_karyawan`, `divisi`, `bulan`, `tahun`, `skor_disiplin`, `skor_tugas`, `skor_kerjasama`, `skor_total`, `grade`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `skor_disiplin`=VALUES(`skor_disiplin`), `skor_tugas`=VALUES(`skor_tugas`), `skor_total`=VALUES(`skor_total`), `grade`=VALUES(`grade`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $kp) {
                $empName = $kp['employeeName'] ?? ($kp['namaKaryawan'] ?? '');
                if (!empty($empName)) {
                    $kpId = $kp['id'] ?? ('kpi_' . substr(md5($empName . ($kp['month'] ?? ($kp['periode'] ?? ''))), 0, 10));
                    $stmtKpi->execute([
                        $kpId,
                        $empName,
                        $kp['division'] ?? ($kp['divisi'] ?? 'Operasional'),
                        $kp['month'] ?? ($kp['periode'] ?? date('F')),
                        intval($kp['year'] ?? ($kp['tahun'] ?? date('Y'))),
                        floatval($kp['disciplineScore'] ?? ($kp['attendanceScore'] ?? 0)),
                        floatval($kp['taskScore'] ?? ($kp['todoExecutionScore'] ?? 0)),
                        floatval($kp['cooperationScore'] ?? ($kp['softSkillsScore'] ?? 0)),
                        floatval($kp['totalScore'] ?? 0),
                        $kp['grade'] ?? 'Grade B',
                        $kp['notes'] ?? ($kp['catatanEvaluator'] ?? null)
                    ]);
                }
            }
        }

        // I-2. Unit Kavling
        if ((strpos($key, 'unit') !== false || strpos($key, 'kavling') !== false) && is_array($parsed)) {
            $stmtUnit = $pdo->prepare("INSERT INTO tbl_unit_kavling (`id`, `proyek`, `blok`, `nomor`, `type`, `lb`, `lt`, `status_penjualan`, `harga`, `foto_unit`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `proyek`=VALUES(`proyek`), `status_penjualan`=VALUES(`status_penjualan`), `harga`=VALUES(`harga`), `foto_unit`=VALUES(`foto_unit`)");
            foreach ($parsed as $u) {
                if (!empty($u['unitNo']) || !empty($u['nomor'])) {
                    $uId = $u['id'] ?? ('unt_' . substr(md5(($u['proyek'] ?? '') . ($u['unitNo'] ?? '')), 0, 8));
                    $stmtUnit->execute([
                        $uId,
                        $u['proyek'] ?? ($u['project'] ?? 'Ashoka Park'),
                        $u['blok'] ?? ($u['block'] ?? 'A'),
                        $u['unitNo'] ?? ($u['nomor'] ?? '01'),
                        $u['type'] ?? '36/72',
                        floatval($u['lb'] ?? 36),
                        floatval($u['lt'] ?? 72),
                        $u['status'] ?? ($u['statusPenjualan'] ?? 'Tersedia'),
                        floatval($u['price'] ?? ($u['harga'] ?? 0)),
                        $u['progressPhoto'] ?? ($u['fotoUnit'] ?? null)
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

        // N. Relasi Data Base Karyawan (HR)
        if (strpos($key, 'karyawan') !== false && is_array($parsed)) {
            $stmtEmp = $pdo->prepare("INSERT INTO tbl_karyawan (`id`, `no_dok`, `nama`, `no_hp`, `nik`, `npwp`, `no_rekening`, `alamat`, `divisi`, `jabatan`, `penempatan`, `status`, `nama_keluarga`, `tanggal_masuk`, `files_json`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `no_dok`=VALUES(`no_dok`), `nama`=VALUES(`nama`), `no_hp`=VALUES(`no_hp`), `nik`=VALUES(`nik`), `npwp`=VALUES(`npwp`), `no_rekening`=VALUES(`no_rekening`), `alamat`=VALUES(`alamat`), `jabatan`=VALUES(`jabatan`), `penempatan`=VALUES(`penempatan`), `status`=VALUES(`status`), `nama_keluarga`=VALUES(`nama_keluarga`), `tanggal_masuk`=VALUES(`tanggal_masuk`), `files_json`=VALUES(`files_json`)");
            foreach ($parsed as $e) {
                if (!empty($e['nama']) || !empty($e['name'])) {
                    $eId = $e['id'] ?? ('EMP-' . substr(md5($e['nama'] ?? $e['name']), 0, 8));
                    $famStr = is_array($e['namaKeluarga'] ?? null) ? json_encode($e['namaKeluarga'], JSON_UNESCAPED_UNICODE) : ($e['namaKeluarga'] ?? null);
                    $filesStr = !empty($e['files']) ? json_encode($e['files'], JSON_UNESCAPED_UNICODE) : null;
                    $tglMasuk = !empty($e['tanggalMasuk']) && $e['tanggalMasuk'] !== '-' ? $e['tanggalMasuk'] : (!empty($e['tanggalDok']) ? $e['tanggalDok'] : null);
                    $stmtEmp->execute([
                        $eId,
                        $e['noDok'] ?? null,
                        $e['nama'] ?? ($e['name'] ?? ''),
                        $e['noHp'] ?? ($e['phone'] ?? null),
                        $e['nik'] ?? null,
                        $e['npwp'] ?? null,
                        $e['noRekening'] ?? null,
                        $e['alamat'] ?? null,
                        $e['divisi'] ?? 'Umum',
                        $e['jabatan'] ?? ($e['judulDokumen'] ?? null),
                        $e['penempatan'] ?? ($e['project'] ?? null),
                        $e['status'] ?? ($e['kategori'] ?? 'Karyawan Tetap (PKWTT)'),
                        $famStr,
                        $tglMasuk,
                        $filesStr
                    ]);
                }
            }
        }

        // O. Relasi Recruitment Pelamar (HR)
        if ((strpos($key, 'recruitment') !== false || strpos($key, 'applicant') !== false || strpos($key, 'kandidat') !== false) && is_array($parsed)) {
            $stmtRec = $pdo->prepare("INSERT INTO tbl_recruitment_pelamar (`id`, `no_dok`, `nama`, `posisi`, `proyek`, `email`, `no_hp`, `status_tahap`, `skor`, `tanggal_lamar`, `berkas_cv`, `media_sosial`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `posisi`=VALUES(`posisi`), `status_tahap`=VALUES(`status_tahap`), `skor`=VALUES(`skor`), `media_sosial`=VALUES(`media_sosial`), `catatan`=VALUES(`catatan`), `berkas_cv`=VALUES(`berkas_cv`)");
            foreach ($parsed as $rc) {
                if (!empty($rc['nama']) || !empty($rc['name'])) {
                    $rcId = $rc['id'] ?? ('APP-' . substr(md5($rc['nama'] ?? $rc['name']), 0, 8));
                    $cvStr = !empty($rc['files']) ? json_encode($rc['files'], JSON_UNESCAPED_UNICODE) : null;
                    $socStr = !empty($rc['socialMedia']) ? (is_string($rc['socialMedia']) ? $rc['socialMedia'] : json_encode($rc['socialMedia'], JSON_UNESCAPED_UNICODE)) : null;
                    $stmtRec->execute([
                        $rcId,
                        $rc['noDok'] ?? ($rc['noRegistrasi'] ?? null),
                        $rc['nama'] ?? ($rc['name'] ?? ''),
                        $rc['posisi'] ?? ($rc['kategori'] ?? ($rc['judulDokumen'] ?? null)),
                        $rc['project'] ?? ($rc['penempatan'] ?? null),
                        $rc['email'] ?? null,
                        $rc['phone'] ?? ($rc['noHp'] ?? null),
                        $rc['statusTahap'] ?? ($rc['tahap'] ?? 'Interview User'),
                        $rc['skor'] ?? null,
                        $rc['tanggalLamar'] ?? ($rc['tanggalDok'] ?? null),
                        $cvStr,
                        $socStr,
                        $rc['catatan'] ?? null
                    ]);
                }
            }
        }

        // P. Relasi Kontrak Kerja (HR)
        if ((strpos($key, 'kontrak') !== false || strpos($key, 'contract') !== false) && is_array($parsed)) {
            $stmtCtr = $pdo->prepare("INSERT INTO tbl_kontrak_kerja (`id`, `no_dok`, `employee_id`, `nama`, `nik`, `jabatan`, `penempatan`, `jenis_dokumen`, `tanggal_mulai`, `tanggal_berakhir`, `gaji_pokok`, `tunjangan`, `status_kontrak`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `jabatan`=VALUES(`jabatan`), `jenis_dokumen`=VALUES(`jenis_dokumen`), `tanggal_mulai`=VALUES(`tanggal_mulai`), `tanggal_berakhir`=VALUES(`tanggal_berakhir`), `gaji_pokok`=VALUES(`gaji_pokok`), `tunjangan`=VALUES(`tunjangan`), `status_kontrak`=VALUES(`status_kontrak`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $ct) {
                if (!empty($ct['nama']) || !empty($ct['noDok'])) {
                    $cId = $ct['id'] ?? ('CTR-' . substr(md5($ct['noDok'] ?? $ct['nama']), 0, 8));
                    $stmtCtr->execute([
                        $cId,
                        $ct['noDok'] ?? ('CTR/'.date('Y').'/'.$cId),
                        $ct['employeeId'] ?? null,
                        $ct['nama'] ?? '',
                        $ct['nik'] ?? null,
                        $ct['jabatan'] ?? null,
                        $ct['penempatan'] ?? null,
                        $ct['jenisDokumen'] ?? 'PKWT',
                        $ct['tanggalMulai'] ?? null,
                        $ct['tanggalBerakhir'] ?? null,
                        floatval($ct['gajiPokok'] ?? 0),
                        floatval($ct['tunjangan'] ?? 0),
                        $ct['statusKontrak'] ?? 'Aktif',
                        $ct['catatan'] ?? null
                    ]);
                }
            }
        }

        // Q. Relasi Management Aset Inventaris (GA)
        if ((strpos($key, 'asset') !== false || strpos($key, 'aset') !== false) && is_array($parsed)) {
            $stmtAst = $pdo->prepare("INSERT INTO tbl_aset_inventaris (`id`, `no_dok`, `nama_aset`, `jenis_aset`, `tahun_perolehan`, `tanggal_perolehan`, `harga`, `lokasi`, `kondisi`, `penanggung_jawab`, `catatan`, `foto_aset`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `nama_aset`=VALUES(`nama_aset`), `jenis_aset`=VALUES(`jenis_aset`), `harga`=VALUES(`harga`), `kondisi`=VALUES(`kondisi`), `lokasi`=VALUES(`lokasi`), `penanggung_jawab`=VALUES(`penanggung_jawab`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $as) {
                $namaAst = $as['namaAsset'] ?? ($as['namaAset'] ?? ($as['nama'] ?? ''));
                if (!empty($namaAst)) {
                    $aId = $as['id'] ?? ('AST-' . substr(md5($namaAst), 0, 8));
                    $tglP = !empty($as['tanggalPerolehan']) && $as['tanggalPerolehan'] !== '-' ? $as['tanggalPerolehan'] : null;
                    $fotoAst = !empty($as['files']) ? json_encode($as['files'], JSON_UNESCAPED_UNICODE) : null;
                    $stmtAst->execute([
                        $aId,
                        $as['noDok'] ?? null,
                        $namaAst,
                        $as['jenisAsset'] ?? ($as['jenisAset'] ?? 'Inventaris Umum'),
                        $as['tahunPerolehan'] ?? date('Y'),
                        $tglP,
                        floatval($as['harga'] ?? 0),
                        $as['lokasiAsset'] ?? ($as['lokasi'] ?? null),
                        $as['kondisi'] ?? 'Baik',
                        $as['penanggungJawab'] ?? null,
                        $as['catatan'] ?? null,
                        $fotoAst
                    ]);
                }
            }
        }

        // R. Relasi Maintenance Tiket (GA)
        if ((strpos($key, 'maintenance') !== false || strpos($key, 'maintanance') !== false) && is_array($parsed)) {
            $stmtMnt = $pdo->prepare("INSERT INTO tbl_maintenance_tiket (`id`, `no_dok`, `asset_id`, `nama_barang`, `lokasi`, `jenis_kerusakan`, `urgensi`, `pemohon`, `vendor`, `biaya`, `status_maintenance`, `status_pembayaran`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `status_maintenance`=VALUES(`status_maintenance`), `status_pembayaran`=VALUES(`status_pembayaran`), `biaya`=VALUES(`biaya`), `vendor`=VALUES(`vendor`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $mt) {
                $namaBrg = $mt['namaBarang'] ?? ($mt['namaAsset'] ?? ($mt['judul'] ?? ''));
                if (!empty($namaBrg)) {
                    $mtId = $mt['id'] ?? ('MNT-' . substr(md5($mt['noDok'] ?? $namaBrg), 0, 8));
                    $stmtMnt->execute([
                        $mtId,
                        $mt['noDok'] ?? null,
                        $mt['assetId'] ?? null,
                        $namaBrg,
                        $mt['lokasiAsset'] ?? ($mt['lokasi'] ?? null),
                        $mt['jenisKerusakan'] ?? null,
                        $mt['urgensi'] ?? 'Normal',
                        $mt['pemohon'] ?? null,
                        $mt['namaVendor'] ?? ($mt['vendor'] ?? null),
                        floatval($mt['biaya'] ?? 0),
                        $mt['statusMaintenance'] ?? 'Menunggu Maintenance',
                        $mt['statusPembayaran'] ?? 'Pending',
                        $mt['catatan'] ?? null
                    ]);
                }
            }
        }

        // S. Relasi Fasilitas Kantor (GA)
        if ((strpos($key, 'facilit') !== false || strpos($key, 'fasilitas') !== false) && is_array($parsed)) {
            $stmtFas = $pdo->prepare("INSERT INTO tbl_fasilitas_kantor (`id`, `no_dok`, `nama_fasilitas`, `kategori`, `lokasi`, `jumlah`, `kondisi`, `penanggung_jawab`, `status`, `kelengkapan`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `nama_fasilitas`=VALUES(`nama_fasilitas`), `kondisi`=VALUES(`kondisi`), `status`=VALUES(`status`), `penanggung_jawab`=VALUES(`penanggung_jawab`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $fs) {
                $namaFas = $fs['namaFasilitas'] ?? ($fs['nama'] ?? ($fs['fasilitas'] ?? ''));
                if (!empty($namaFas)) {
                    $fId = $fs['id'] ?? ('FAS-' . substr(md5($namaFas), 0, 8));
                    $stmtFas->execute([
                        $fId,
                        $fs['noDok'] ?? null,
                        $namaFas,
                        $fs['kategori'] ?? 'Fasilitas Kantor',
                        $fs['lokasi'] ?? ($fs['project'] ?? null),
                        intval($fs['jumlah'] ?? 1),
                        $fs['kondisi'] ?? 'Baik',
                        $fs['penanggungJawab'] ?? null,
                        $fs['status'] ?? 'Tersedia',
                        $fs['kelengkapan'] ?? null,
                        $fs['catatan'] ?? null
                    ]);
                }
            }
        }

        // T. Relasi Gathering Agenda (HR)
        if (strpos($key, 'gathering') !== false && is_array($parsed)) {
            $stmtGth = $pdo->prepare("INSERT INTO tbl_gathering_agenda (`id`, `no_dok`, `nama_event`, `kategori`, `tanggal_mulai`, `tanggal_selesai`, `lokasi`, `penanggung_jawab`, `anggaran`, `status`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `nama_event`=VALUES(`nama_event`), `tanggal_mulai`=VALUES(`tanggal_mulai`), `status`=VALUES(`status`), `anggaran`=VALUES(`anggaran`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $gt) {
                $namaEvt = $gt['namaAcara'] ?? ($gt['title'] ?? ($gt['namaEvent'] ?? ($gt['judul'] ?? ($gt['nama'] ?? ''))));
                if (!empty($namaEvt)) {
                    $gId = $gt['id'] ?? ('GTH-' . substr(md5($namaEvt), 0, 8));
                    $stmtGth->execute([
                        $gId,
                        $gt['noDok'] ?? null,
                        $namaEvt,
                        $gt['kategori'] ?? 'Family Gathering',
                        $gt['startDate'] ?? ($gt['tanggalMulai'] ?? ($gt['tanggal'] ?? null)),
                        $gt['endDate'] ?? ($gt['tanggalSelesai'] ?? null),
                        $gt['location'] ?? ($gt['lokasi'] ?? null),
                        $gt['pic'] ?? ($gt['penanggungJawab'] ?? null),
                        floatval($gt['budget'] ?? ($gt['anggaran'] ?? ($gt['totalBiaya'] ?? ($gt['totalEstimasi'] ?? 0)))),
                        $gt['status'] ?? 'Direncanakan',
                        $gt['notes'] ?? ($gt['catatan'] ?? ($gt['deskripsi'] ?? null))
                    ]);
                }
            }
        }

        // U. Relasi CCTV Monitoring (GA)
        if (strpos($key, 'cctv') !== false && is_array($parsed)) {
            $stmtCtv = $pdo->prepare("INSERT INTO tbl_cctv_monitoring (`id`, `kode_titik`, `nama_kamera`, `lokasi`, `ip_address`, `tipe_kamera`, `status`, `resolusi`, `catatan`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `nama_kamera`=VALUES(`nama_kamera`), `lokasi`=VALUES(`lokasi`), `ip_address`=VALUES(`ip_address`), `status`=VALUES(`status`), `resolusi`=VALUES(`resolusi`), `catatan`=VALUES(`catatan`)");
            foreach ($parsed as $cv) {
                $namaCam = $cv['namaKamera'] ?? ($cv['name'] ?? ($cv['nama'] ?? ''));
                if (!empty($namaCam) || !empty($cv['kodeTitik'])) {
                    $cId = $cv['id'] ?? ('CTV-' . substr(md5($namaCam . ($cv['kodeTitik'] ?? '')), 0, 8));
                    $stmtCtv->execute([
                        $cId,
                        $cv['kodeTitik'] ?? ('CCTV-' . substr($cId, 4)),
                        $namaCam,
                        $cv['lokasi'] ?? ($cv['project'] ?? null),
                        $cv['ipAddress'] ?? ($cv['ip'] ?? null),
                        $cv['tipeKamera'] ?? 'IP Camera Outdoor',
                        $cv['status'] ?? 'ONLINE',
                        $cv['resolusi'] ?? '4K / 8MP',
                        $cv['catatan'] ?? null
                    ]);
                }
            }
        }

        // Z. Relasi Chart of Accounts (COA / Account List)
        if (strpos($key, 'coa') !== false && is_array($parsed)) {
            $stmtCoa = $pdo->prepare("INSERT INTO tbl_coa (`code`, `name`, `parent_code`, `level`, `kriteria`, `posisi`, `category`, `balance`, `description`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `parent_code`=VALUES(`parent_code`), `level`=VALUES(`level`), `kriteria`=VALUES(`kriteria`), `posisi`=VALUES(`posisi`), `category`=VALUES(`category`), `balance`=VALUES(`balance`), `description`=VALUES(`description`)");
            foreach ($parsed as $ca) {
                if (!empty($ca['code']) && !empty($ca['name'])) {
                    $stmtCoa->execute([
                        $ca['code'],
                        $ca['name'],
                        $ca['parentCode'] ?? null,
                        intval($ca['level'] ?? 1),
                        $ca['kriteria'] ?? 'Detail',
                        $ca['posisi'] ?? ($ca['normalBalance'] ?? 'Debet'),
                        $ca['category'] ?? 'Umum',
                        floatval($ca['balance'] ?? 0),
                        $ca['description'] ?? null
                    ]);
                }
            }
        }

        // AA. Relasi Joblist & Sub-Pekerjaan Proyek (2-Level)
        if (strpos($key, 'joblist') !== false && is_array($parsed)) {
            $stmtJob = $pdo->prepare("INSERT INTO tbl_joblist (`code`, `name`, `parent_code`, `level`, `type`, `description`)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `parent_code`=VALUES(`parent_code`), `level`=VALUES(`level`), `type`=VALUES(`type`), `description`=VALUES(`description`)");
            foreach ($parsed as $jb) {
                if (!empty($jb['code']) && !empty($jb['name'])) {
                    $stmtJob->execute([
                        $jb['code'],
                        $jb['name'],
                        $jb['parentCode'] ?? null,
                        intval($jb['level'] ?? 1),
                        $jb['type'] ?? 'Project',
                        $jb['description'] ?? null
                    ]);
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
