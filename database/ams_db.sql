-- ========================================================
-- DATABASE SCHEMA & DUMMY DATA FOR AMS (ASSET MANAGEMENT SYSTEM)
-- Database Name: db_ams
-- Compatible with: MySQL 5.7+ / MySQL 8.0 / MariaDB / HeidiSQL / phpMyAdmin
-- ========================================================

CREATE DATABASE IF NOT EXISTS `db_ams` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_ams`;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Super Admin', 'Teknik Specialist', 'Legal Officer', 'Finance Officer') NOT NULL DEFAULT 'Teknik Specialist',
  `dept` VARCHAR(50) NOT NULL,
  `status` ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `dept`, `status`, `avatar`) VALUES
(1, 'Kevin Anderson', 'kevin.a@ams.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', 'Manajemen', 'Aktif', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'),
(2, 'Ir. Dimas Suryo', 'dimas.teknik@ams.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Specialist', 'Teknik', 'Aktif', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'),
(3, 'Nadia Putri, SH', 'nadia.legal@ams.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Legal Officer', 'Legal', 'Aktif', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'),
(4, 'Bambang Triyono, SE', 'bambang.fin@ams.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Finance Officer', 'Finance', 'Aktif', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80');

-- --------------------------------------------------------
-- Table structure for `clusters`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `clusters`;
CREATE TABLE `clusters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cluster_name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL,
  `description` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `clusters` (`id`, `cluster_name`, `code`, `description`) VALUES
(1, 'Grand Harmoni - Cluster Emerald', 'EMR', 'Perumahan Tipe Klasik Modern Tipe 45/90'),
(2, 'Grand Harmoni - Cluster Sapphire', 'SPH', 'Perumahan Premium 2 Lantai Tipe 60/120'),
(3, 'Grand Harmoni - Cluster Ruby', 'RBY', 'Perumahan Exclusive Smart Home Tipe 90/150');

-- --------------------------------------------------------
-- Table structure for `units`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` VARCHAR(20) PRIMARY KEY,
  `unit_no` VARCHAR(20) NOT NULL,
  `cluster_id` INT NOT NULL,
  `tipe` VARCHAR(50) NOT NULL,
  `owner_name` VARCHAR(100) NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `status_pekerjaan` VARCHAR(150) NOT NULL,
  `contractor_name` VARCHAR(100) NOT NULL,
  `start_date` DATE DEFAULT NULL,
  `target_date` DATE DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`cluster_id`) REFERENCES `clusters`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `units` (`id`, `unit_no`, `cluster_id`, `tipe`, `owner_name`, `progress`, `status_pekerjaan`, `contractor_name`, `start_date`, `target_date`, `note`) VALUES
('RUM-001', 'A-01', 1, '45/90', 'Budi Santoso', 100, 'Ready / Handover', 'PT Bangun Jaya Perdana', '2025-01-10', '2025-08-01', 'Selesai 100%, siap serah terima kunci'),
('RUM-002', 'A-02', 1, '45/90', 'Siti Rahmawati', 75, 'Finishing Pengecatan', 'PT Bangun Jaya Perdana', '2025-02-01', '2025-09-15', 'Pemasangan keramik lantai & sanitari'),
('RUM-003', 'B-05', 2, '60/120', 'Dr. Ahmad Fauzi', 40, 'Struktur Dinding Layer 2', 'CV Karya Mandiri Teknik', '2025-04-15', '2025-11-30', 'Pengecoran atap dak dan pasangan bata ringan'),
('RUM-004', 'B-06', 2, '60/120', 'Hendra Wijaya', 15, 'Pondasi Batu Kali', 'CV Karya Mandiri Teknik', '2025-06-01', '2025-12-20', 'Penggalian dan pembesian sloof pondasi');

-- --------------------------------------------------------
-- Table structure for `unit_legals`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `unit_legals`;
CREATE TABLE `unit_legals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `unit_id` VARCHAR(20) NOT NULL UNIQUE,
  `sertifikat_induk` VARCHAR(100) DEFAULT 'SHGB No. 1024',
  `pecah_sertifikat` VARCHAR(100) DEFAULT 'Proses BPN',
  `pbg_no` VARCHAR(100) DEFAULT 'PBG-2025-8891',
  `ajb_status` VARCHAR(50) DEFAULT 'Belum',
  `status_final` VARCHAR(50) DEFAULT 'Induk SHGB',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `unit_legals` (`unit_id`, `sertifikat_induk`, `pecah_sertifikat`, `pbg_no`, `ajb_status`, `status_final`) VALUES
('RUM-001', 'SHGB No. 1024', 'Selesai (SHGB A-01)', 'PBG-2025-8891', 'Selesai', 'SHM Ready'),
('RUM-002', 'SHGB No. 1024', 'Proses BPN', 'PBG-2025-8892', 'Draf NJKP', 'Proses Pecah'),
('RUM-003', 'SHGB No. 1024', 'Proses BPN', 'PBG-2025-9011', 'Belum', 'Proses PBG'),
('RUM-004', 'SHGB No. 1024', 'Berkas Masuk BPN', 'PBG-2025-9102', 'Belum', 'Induk SHGB');

-- --------------------------------------------------------
-- Table structure for `unit_finances`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `unit_finances`;
CREATE TABLE `unit_finances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `unit_id` VARCHAR(20) NOT NULL UNIQUE,
  `harga` DECIMAL(15,2) NOT NULL DEFAULT 500000000.00,
  `skema_pembayaran` VARCHAR(100) NOT NULL DEFAULT 'KPR Bank',
  `dp_status` VARCHAR(100) NOT NULL DEFAULT 'Proses DP',
  `pencairan_kpr` VARCHAR(100) NOT NULL DEFAULT 'Proses Bank',
  `batp_payment_status` ENUM('Draft', 'Pending Review', 'Approved') NOT NULL DEFAULT 'Draft',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `unit_finances` (`unit_id`, `harga`, `skema_pembayaran`, `dp_status`, `pencairan_kpr`, `batp_payment_status`) VALUES
('RUM-001', 650000000.00, 'KPR Bank Mandiri', 'Lunas 100%', 'Lunas 100%', 'Approved'),
('RUM-002', 670000000.00, 'KPR Bank BCA', 'Lunas 100%', 'SP3K ACC (Tunggu Akad)', 'Pending Review'),
('RUM-003', 890000000.00, 'Cash Bertahap (12x)', 'Lunas DP (Angsuran ke-5)', 'N/A (Cash)', 'Draft'),
('RUM-004', 895000000.00, 'KPR Bank BSI', 'Lunas DP 10%', 'Proses Analisa Bank', 'Draft');

-- --------------------------------------------------------
-- Table structure for `unit_komersil`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `unit_komersil`;
CREATE TABLE `unit_komersil` (
  `id` VARCHAR(20) PRIMARY KEY,
  `nama_unit` VARCHAR(150) NOT NULL,
  `tipe` VARCHAR(50) NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `status_pekerjaan` VARCHAR(150) NOT NULL,
  `contractor_name` VARCHAR(100) NOT NULL,
  `legal_status` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `unit_komersil` (`id`, `nama_unit`, `tipe`, `progress`, `status_pekerjaan`, `contractor_name`, `legal_status`) VALUES
('KOM-101', 'Ruko Boulevard Grand Harmoni No. 01', '3 Lantai (75/150)', 85, 'Pemasangan Glass Front & Kanopi', 'PT Utama Konstruksi', 'SHGB Komersil Ready'),
('KOM-102', 'Ruko Boulevard Grand Harmoni No. 02', '3 Lantai (75/150)', 60, 'Pengecoran Lantai 3', 'PT Utama Konstruksi', 'Proses PBG Komersil');

-- --------------------------------------------------------
-- Table structure for `fasilitas`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `fasilitas`;
CREATE TABLE `fasilitas` (
  `id` VARCHAR(20) PRIMARY KEY,
  `nama_fasilitas` VARCHAR(150) NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `status_pekerjaan` VARCHAR(150) NOT NULL,
  `target_date` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `fasilitas` (`id`, `nama_fasilitas`, `progress`, `status_pekerjaan`, `target_date`) VALUES
('FAS-01', 'Masjid Al-Harmoni', 95, 'Finishing Interior & Menara', 'Agustus 2025'),
('FAS-02', 'Clubhouse & Swimming Pool', 50, 'Penggalangan Kolam & Filter Room', 'Oktober 2025'),
('FAS-03', 'Main Gate & Security Post', 100, 'Operasional (Smart Card Access)', 'Selesai');

-- --------------------------------------------------------
-- Table structure for `utilitas`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `utilitas`;
CREATE TABLE `utilitas` (
  `id` VARCHAR(20) PRIMARY KEY,
  `jenis_utilitas` VARCHAR(150) NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `status_pekerjaan` VARCHAR(150) NOT NULL,
  `pihak_ketiga` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `utilitas` (`id`, `jenis_utilitas`, `progress`, `status_pekerjaan`, `pihak_ketiga`) VALUES
('UTL-01', 'PLN Underground Cable', 90, 'Pemasangan Gardu Induk V-02', 'PLN Persero'),
('UTL-02', 'Jaringan Air PDAM', 80, 'Pemasangan Pipa Induk 4 inchi', 'PDAM Tirta'),
('UTL-03', 'Drainase & Saluran Resapan', 100, 'Terhubung ke U-Ditch Utama', 'Intern Teknik'),
('UTL-04', 'Fiber Optic High-Speed Internet', 70, 'Penarikan Kabel Drop Core', 'Indihome & Biznet');
