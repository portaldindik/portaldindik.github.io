/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: SPREADSHEET KHUSUS MODUL MANDIRI
 * Dinas Pendidikan dan Kebudayaan Kabupaten Madiun
 * ==============================================================================
 * Modul yang terhubung:
 * 1. Deskripsi Sub Modul (Nama Sub Modul & Deskripsi Lengkap Sub Bagian)
 *    - E-Kinerja (SPM #01)
 *    - Presensi Online Pegawai & Tendik (SPM #01)
 *    - 15 Indikator Target Kinerja (SPM #01)
 *    - Ijin Operasional Satuan Pendidikan (Lembaga #02)
 *    - Laporan RPJMD 2025 - 2029
 * 2. E-Kinerja & Capaian (SPM #01) -> Target & Triwulan 1 s/d 4
 * 3. Presensi Online Pegawai & Tendik (SPM #01) -> NIP & Persentase Kehadiran
 * 4. 15 Indikator Target Kinerja (SPM #01) -> Tabel 15 Baris Indikator Kinerja SPM
 * 5. Ijin Operasional Satuan Pendidikan (Lembaga #02) -> Status Perizinan Satuan Pendidikan
 * 6. Laporan RPJMD 2025 - 2029 (Dokumen Perencanaan & Laporan Kinerja)
 * 7. Informasi Publik / Berita & Pengumuman Resmi
 *
 * FITUR UTAMA:
 * - Otomatis membuat lembar (sheet) dan header kolom jika belum tersedia
 * - Sheet "Deskripsi_Sub_Modul" khusus mendata Nama Sub Modul & Deskripsi Lengkap Sub Bagian
 * - Kompatibel penuh dan sinkron timbal-balik (mendukung sheet Deskripsi_Sub_Modul maupun Info_Sub_Modul)
 * - Menggunakan metode TIMPA DATA TERBARU (Overwrite) agar data selalu bersih & akurat
 * - Berdiri sendiri, tidak bercampur dengan spreadsheet portal 9 program utama maupun akun admin
 * ==============================================================================
 */

// Konfigurasi Nama Sheet & Kolom Header Otomatis
var SHEET_CONFIGS = {
  DESKRIPSI_SUB_MODUL: {
    sheetName: "Deskripsi_Sub_Modul",
    headerBg: "#4C1D95", // Dark Purple
    headers: ["No", "ID Sub Modul", "Kategori Modul", "Nama Sub Modul", "Deskripsi Lengkap Sub Bagian", "Waktu Pembaruan"]
  },
  INFO_SUB_MODUL: {
    sheetName: "Info_Sub_Modul",
    headerBg: "#4C1D95", // Dark Purple
    headers: ["No", "ID Sub Modul", "Kategori Modul", "Nama Sub Modul", "Deskripsi Lengkap Sub Bagian", "Waktu Pembaruan"]
  },
  EKINERJA: {
    sheetName: "E_Kinerja",
    headerBg: "#065F46", // Dark Emerald
    headers: ["No", "Nama Target Kinerja", "Target Kinerja", "Triwulan 1", "Triwulan 2", "Triwulan 3", "Triwulan 4", "Waktu Pembaruan"]
  },
  PRESENSI: {
    sheetName: "Presensi_Online",
    headerBg: "#0F766E", // Dark Teal
    headers: ["No", "NIP", "Nama Pegawai / Guru", "Persentase Kehadiran", "Waktu Pembaruan"]
  },
  INDIKATOR_SPM: {
    sheetName: "Indikator_SPM_15",
    headerBg: "#1E3A8A", // Dark Blue
    headers: ["No", "Indikator SPM", "Satuan", "Capaian Tahun 2025", "Target Tahun 2026", "Target Tahun 2027", "Waktu Pembaruan"]
  },
  IJIN_OPERASIONAL: {
    sheetName: "Ijin_Operasional",
    headerBg: "#3730A3", // Dark Indigo
    headers: ["No", "Status Sekolah", "Unit Kerja / Satuan Pendidikan", "Status Ijin Operasional", "Waktu Pembaruan"]
  },
  RPJMD: {
    sheetName: "Laporan_RPJMD",
    headerBg: "#0E7490", // Dark Cyan
    headers: ["ID Dokumen", "Kategori", "Nomor Urut", "Singkatan Dokumen", "Judul Lengkap Dokumen", "Periode Tahun", "Ukuran File", "URL File PDF", "Penjelasan Naratif", "Waktu Pembaruan"]
  },
  BERITA: {
    sheetName: "Berita_Pengumuman",
    headerBg: "#1E293B", // Dark Slate
    headers: ["ID Berita", "Judul Berita", "Kategori", "Tanggal Publikasi", "Ringkasan Isi", "Tautan Rujukan", "URL Foto Thumbnail", "Waktu Pembaruan"]
  }
};

/**
 * Fungsi inisialisasi awal sekali klik untuk membuat seluruh sheet dan header kolom secara instan
 */
function initModulKhususSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var key in SHEET_CONFIGS) {
    if (key !== "INFO_SUB_MODUL") {
      ensureSheetWithHeader(ss, SHEET_CONFIGS[key]);
    }
  }

  // 1. Otomatis isi baris bawaan Deskripsi Sub Modul jika sheet masih kosong
  var deskripsiSheet = ss.getSheetByName(SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.sheetName);
  if (deskripsiSheet && deskripsiSheet.getLastRow() <= 1) {
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var defaultInfo = [
      ["1", "ekinerja", "SPM (Standar Pelayanan Minimal)", "E-Kinerja", "Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.", nowStr],
      ["2", "presensi-online", "SPM (Standar Pelayanan Minimal)", "Presensi Online", "Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.", nowStr],
      ["3", "indikator-spm-15", "SPM (Standar Pelayanan Minimal)", "15 Indikator Target Kinerja", "Target Kinerja Dinas Pendidikan dan Kebudayaan Kabupaten Madiun pada Standar Pelayanan Minimal (SPM) Bidang Pendidikan Tahun 2025 s/d 2027.", nowStr],
      ["4", "ijin-operasional", "Lembaga Sekolah (Lembaga #02)", "Ijin Operasional", "Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun.", nowStr],
      ["5", "rpjmd", "Laporan RPJMD 2025 - 2029", "RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029", "Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.", nowStr]
    ];
    deskripsiSheet.getRange(2, 1, defaultInfo.length, defaultInfo[0].length).setValues(defaultInfo);
    for (var c = 1; c <= SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.headers.length; c++) {
      deskripsiSheet.autoResizeColumn(c);
    }
  }

  // 2. Otomatis isi baris bawaan Indikator SPM jika sheet masih kosong
  var indikatorSheet = ss.getSheetByName(SHEET_CONFIGS.INDIKATOR_SPM.sheetName);
  if (indikatorSheet && indikatorSheet.getLastRow() <= 1) {
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var defaultIndikator = [
      ["1", "Angka Partisipasi Sekolah (5-6) - Partisipasi anak usia 5-6 tahun dalam pendidikan prasekolah.", "%", "100", "100", "100", nowStr],
      ["2", "Angka Partisipasi Sekolah (7-15) - Partisipasi penduduk usia 7-15 tahun dalam pendidikan dasar.", "%", "99,6", "99,61", "99,62", nowStr],
      ["3", "Angka Partisipasi Sekolah (7-18) - Partisipasi penduduk usia 7-18 tahun dalam seluruh jenjang pendidikan.", "%", "36,07", "38,38", "40,74", nowStr],
      ["4", "Kemampuan Literasi SD - Kemampuan membaca dan memahami teks pada siswa Sekolah Dasar.", "Skor", "69,11", "71,36", "73,61", nowStr],
      ["5", "Kemampuan Literasi SMP - Kemampuan membaca dan memahami teks pada siswa Sekolah Menengah Pertama.", "Skor", "79,03", "79,53", "80,03", nowStr],
      ["6", "Kemampuan Numerasi SD - Kemampuan berhitung, memahami angka dan memecahkan masalah matematika pada siswa Sekolah Dasar.", "Skor", "65,58", "67,83", "70,08", nowStr],
      ["7", "Kemampuan Numerasi SMP - Kemampuan berhitung, memahami angka dan memecahkan masalah matematika pada siswa Sekolah Menengah Pertama.", "Skor", "67,84", "68,84", "69,84", nowStr],
      ["8", "Iklim inklusivitas SD - Iklim pembelajaran yang inklusif dan ramah bagi seluruh peserta didik di jenjang Sekolah Dasar.", "Skor", "65,53", "67,03", "68,53", nowStr],
      ["9", "Iklim inklusivitas SMP - Iklim pembelajaran yang inklusif dan ramah bagi seluruh peserta didik di jenjang Sekolah Menengah Pertama.", "Skor", "63,77", "65,27", "66,77", nowStr],
      ["10", "Iklim Keamanan SD - Lingkungan sekolah yang aman, tertib, dan bebas dari kekerasan di jenjang Sekolah Dasar.", "Skor", "79,17", "80,37", "81,57", nowStr],
      ["11", "Iklim Keamanan SMP - Lingkungan sekolah yang aman, tertib, dan bebas dari kekerasan di jenjang Sekolah Menengah Pertama.", "Skor", "74,53", "75,73", "76,93", nowStr],
      ["12", "Iklim Kebinekaan SD - Sikap toleransi, penghargaan atas keberagaman, dan penguatan persatuan di jenjang Sekolah Dasar.", "Skor", "71,35", "72,25", "73,35", nowStr],
      ["13", "Iklim Kebinekaan SMP - Sikap toleransi, penghargaan atas keberagaman, dan penguatan persatuan di jenjang Sekolah Menengah Pertama.", "Skor", "70,07", "71,07", "72,07", nowStr],
      ["14", "Proporsi Jumlah Satuan PAUD Terakreditasi Minimal B - Persentase satuan PAUD yang telah terakreditasi minimal predikat B.", "%", "78.48", "78.72", "81.87", nowStr],
      ["15", "Proporsi Guru PAUD dengan Kualifikasi S1/D4 - Persentase pendidik PAUD dengan kualifikasi pendidikan minimal S1 atau D4.", "%", "90.02", "94.07", "97.83", nowStr]
    ];
    indikatorSheet.getRange(2, 1, defaultIndikator.length, defaultIndikator[0].length).setValues(defaultIndikator);
    for (var c = 1; c <= SHEET_CONFIGS.INDIKATOR_SPM.headers.length; c++) {
      indikatorSheet.autoResizeColumn(c);
    }
  }

  try {
    SpreadsheetApp.getUi().alert("Inisialisasi Berhasil!\n\nSheet Modul Mandiri (Deskripsi_Sub_Modul, E_Kinerja, Presensi_Online, Indikator_SPM_15, Ijin_Operasional, Laporan_RPJMD, Berita_Pengumuman) beserta kolom header telah selesai dibuat.");
  } catch(e) {
    Logger.log("Inisialisasi Sheet selesai dibuat.");
  }
}

/**
 * Memastikan sheet dan kolom header tersedia secara otomatis
 */
function ensureSheetWithHeader(ss, config) {
  var sheet = ss.getSheetByName(config.sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(config.sheetName);
  }
  
  // Periksa apakah baris header sudah ada
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(config.headerBg);
    headerRange.setFontColor("#FFFFFF");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    // Auto-resize kolom agar rapi
    for (var c = 1; c <= config.headers.length; c++) {
      sheet.autoResizeColumn(c);
    }
  }
  return sheet;
}

/**
 * Endpoint GET: Digunakan untuk Tarik Data dari Spreadsheet
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var params = e ? e.parameter : {};
    var action = params.action || "getData";

    // Pastikan sheet utama dan header sudah siap otomatis
    for (var key in SHEET_CONFIGS) {
      if (key !== "INFO_SUB_MODUL") {
        ensureSheetWithHeader(ss, SHEET_CONFIGS[key]);
      }
    }

    if (action === "getData" || action === "getAll") {
      var result = {
        status: "success",
        timestamp: new Date().toISOString(),
        data: {
          infoSubModul: getInfoSubModulData(ss),
          ekinerja: getEkinerjaData(ss),
          presensiOnline: getPresensiData(ss),
          indikatorSpm: getIndikatorSpmData(ss),
          ijinOperasional: getIjinData(ss),
          rpjmd: getRpjmdData(ss),
          berita: getBeritaData(ss)
        }
      };
      return createJsonResponse(result);
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak dikenal: " + action });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Endpoint POST: Digunakan untuk Kirim Data (Metode Timpa yang Terbaru)
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData = "";

    if (e && e.postData && e.postData.contents) {
      postData = e.postData.contents;
    } else if (e && e.parameter && e.parameter.data) {
      postData = e.parameter.data;
    }

    if (!postData) {
      return createJsonResponse({ status: "error", message: "Payload data kosong." });
    }

    var payload = JSON.parse(postData);
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // Pastikan seluruh sheet siap
    for (var key in SHEET_CONFIGS) {
      if (key !== "INFO_SUB_MODUL") {
        ensureSheetWithHeader(ss, SHEET_CONFIGS[key]);
      }
    }

    var updatedModules = [];

    // 0. Simpan Deskripsi Sub Modul (Nama Sub Modul & Deskripsi Lengkap Sub Bagian)
    if (payload.infoSubModul && Array.isArray(payload.infoSubModul)) {
      saveInfoSubModulData(ss, payload.infoSubModul, nowStr);
      updatedModules.push("Deskripsi Sub Modul (Nama & Deskripsi)");
    }

    // 1. Simpan E-Kinerja (Jika ada dalam payload)
    if (payload.ekinerja && Array.isArray(payload.ekinerja)) {
      saveEkinerjaData(ss, payload.ekinerja, nowStr);
      updatedModules.push("E-Kinerja");
    }

    // 2. Simpan Presensi Online (Jika ada dalam payload)
    if (payload.presensiOnline && Array.isArray(payload.presensiOnline)) {
      savePresensiData(ss, payload.presensiOnline, nowStr);
      updatedModules.push("Presensi Online");
    }

    // 3. Simpan 15 Indikator Target Kinerja SPM (Jika ada dalam payload)
    if (payload.indikatorSpm && Array.isArray(payload.indikatorSpm)) {
      saveIndikatorSpmData(ss, payload.indikatorSpm, nowStr);
      updatedModules.push("15 Indikator Target Kinerja SPM");
    }

    // 4. Simpan Ijin Operasional (Jika ada dalam payload)
    if (payload.ijinOperasional && Array.isArray(payload.ijinOperasional)) {
      saveIjinData(ss, payload.ijinOperasional, nowStr);
      updatedModules.push("Ijin Operasional");
    }

    // 5. Simpan Laporan RPJMD (Jika ada dalam payload)
    if (payload.rpjmd && (Array.isArray(payload.rpjmd) || (payload.rpjmd.dokumen && Array.isArray(payload.rpjmd.dokumen)))) {
      var rpjmdList = Array.isArray(payload.rpjmd) ? payload.rpjmd : payload.rpjmd.dokumen;
      saveRpjmdData(ss, rpjmdList, nowStr);
      updatedModules.push("Laporan RPJMD");
    }

    // 6. Simpan Berita & Pengumuman (Jika ada dalam payload)
    if (payload.berita && Array.isArray(payload.berita)) {
      saveBeritaData(ss, payload.berita, nowStr);
      updatedModules.push("Berita & Pengumuman");
    }

    return createJsonResponse({
      status: "success",
      message: "Data berhasil disimpan dan ditimpa dengan data terbaru pada Google Spreadsheet.",
      timestamp: nowStr,
      updatedModules: updatedModules
    });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// ==========================================
// FUNGSI BACA DATA (GETTERS)
// ==========================================

function getInfoSubModulData(ss) {
  var sheet = ss.getSheetByName("Deskripsi_Sub_Modul") || ss.getSheetByName("Info_Sub_Modul") || ensureSheetWithHeader(ss, SHEET_CONFIGS.DESKRIPSI_SUB_MODUL);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  return values.map(function(row) {
    return {
      no: row[0] != null ? row[0].toString() : "",
      id: row[1] != null ? row[1].toString().trim().toLowerCase() : "",
      kategori: row[2] != null ? row[2].toString() : "",
      nama: row[3] != null ? row[3].toString() : "",
      deskripsi: row[4] != null ? row[4].toString() : "",
      waktuUpdate: row[5] != null ? row[5].toString() : ""
    };
  });
}

function getEkinerjaData(ss) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.EKINERJA);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  return values.map(function(row) {
    return [
      row[0] != null ? row[0].toString() : "",
      row[1] != null ? row[1].toString() : "",
      row[2] != null ? row[2].toString() : "",
      row[3] != null ? row[3].toString() : "",
      row[4] != null ? row[4].toString() : "",
      row[5] != null ? row[5].toString() : "",
      row[6] != null ? row[6].toString() : ""
    ];
  });
}

function getPresensiData(ss) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.PRESENSI);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  return values.map(function(row) {
    return [
      row[0] != null ? row[0].toString() : "",
      row[1] != null ? row[1].toString() : "",
      row[2] != null ? row[2].toString() : "",
      row[3] != null ? row[3].toString() : ""
    ];
  });
}

function getIndikatorSpmData(ss) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.INDIKATOR_SPM);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  return values.map(function(row) {
    return [
      row[0] != null ? row[0].toString() : "",
      row[1] != null ? row[1].toString() : "",
      row[2] != null ? row[2].toString() : "",
      row[3] != null ? row[3].toString() : "",
      row[4] != null ? row[4].toString() : "",
      row[5] != null ? row[5].toString() : ""
    ];
  });
}

function getIjinData(ss) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.IJIN_OPERASIONAL);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  return values.map(function(row) {
    return [
      row[0] != null ? row[0].toString() : "",
      row[1] != null ? row[1].toString() : "",
      row[2] != null ? row[2].toString() : "",
      row[3] != null ? row[3].toString() : ""
    ];
  });
}

function getRpjmdData(ss) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.RPJMD);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  return values.map(function(row) {
    return {
      id: row[0] != null ? row[0].toString() : "",
      kategori: row[1] != null ? row[1].toString() : "perencanaan",
      kategoriNama: (row[1] && row[1].toString().toLowerCase() === "kinerja") ? "Laporan Kinerja" : "Dokumen Perencanaan",
      nomor: parseInt(row[2]) || 1,
      nama: row[3] != null ? row[3].toString() : "",
      judulLengkap: row[4] != null ? row[4].toString() : "",
      tahun: row[5] != null ? row[5].toString() : "2025 - 2029",
      ukuranFile: row[6] != null ? row[6].toString() : "PDF",
      fileUrl: row[7] != null ? row[7].toString() : "#",
      penjelasan: row[8] != null ? row[8].toString() : "",
      tanggalUpdate: row[9] != null ? row[9].toString() : ""
    };
  });
}

function getBeritaData(ss) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.BERITA);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  return values.map(function(row, idx) {
    var id = row[0] != null && row[0].toString() !== "" ? row[0].toString() : ("berita-" + (idx + 1));
    var judul = row[1] != null ? row[1].toString() : "";
    var kategori = row[2] != null && row[2].toString() !== "" ? row[2].toString() : "Berita";
    var tanggal = row[3] != null ? row[3].toString() : "";
    var ringkasan = row[4] != null ? row[4].toString() : "";
    var link = row[5] != null && row[5].toString() !== "" ? row[5].toString() : "#";
    var gambar = row[6] != null ? row[6].toString() : "";

    return {
      id: id,
      judul: judul,
      title: judul,
      kategori: kategori,
      category: kategori,
      tanggal: tanggal,
      date: tanggal,
      ringkasan: ringkasan,
      summary: ringkasan,
      isi: ringkasan,
      content: ringkasan,
      link: link,
      tautan: link,
      gambar: gambar,
      image: gambar
    };
  });
}

// ==========================================
// FUNGSI SIMPAN & TIMPA DATA (SETTERS / OVERWRITE)
// ==========================================

function saveInfoSubModulData(ss, infoList, nowStr) {
  if (!infoList || !Array.isArray(infoList) || infoList.length === 0) return;

  var targetSheets = [
    ensureSheetWithHeader(ss, SHEET_CONFIGS.DESKRIPSI_SUB_MODUL)
  ];
  var legacySheet = ss.getSheetByName("Info_Sub_Modul");
  if (legacySheet && legacySheet.getName() !== SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.sheetName) {
    targetSheets.push(legacySheet);
  }

  // Baca data yang sudah ada di sheet utama
  var primarySheet = targetSheets[0];
  var existingMap = {};
  var lastRow = primarySheet.getLastRow();
  if (lastRow >= 2) {
    var oldValues = primarySheet.getRange(2, 1, lastRow - 1, 6).getValues();
    oldValues.forEach(function(row) {
      var id = row[1] != null ? row[1].toString().trim().toLowerCase() : "";
      if (id) {
        existingMap[id] = {
          id: id,
          kategori: row[2] != null ? row[2].toString() : "",
          nama: row[3] != null ? row[3].toString() : "",
          deskripsi: row[4] != null ? row[4].toString() : "",
          waktuUpdate: row[5] != null ? row[5].toString() : ""
        };
      }
    });
  }

  // Timpa dan perbarui dengan infoList terbaru yang dikirim dari panel admin
  infoList.forEach(function(item) {
    var id = (item.id != null) ? item.id.toString().trim().toLowerCase() : "";
    if (!id) return;
    existingMap[id] = {
      id: id,
      kategori: item.kategori || (existingMap[id] ? existingMap[id].kategori : ""),
      nama: (item.nama != null && item.nama.toString().trim() !== "") ? item.nama.toString().trim() : (existingMap[id] ? existingMap[id].nama : ""),
      deskripsi: (item.deskripsi != null) ? item.deskripsi.toString() : (existingMap[id] ? existingMap[id].deskripsi : ""),
      waktuUpdate: nowStr
    };
  });

  // Urutan modul standar yang selalu dipertahankan
  var standardOrder = [
    { id: "ekinerja", kategori: "SPM (Standar Pelayanan Minimal)", defaultNama: "E-Kinerja", defaultDesc: "Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun." },
    { id: "presensi-online", kategori: "SPM (Standar Pelayanan Minimal)", defaultNama: "Presensi Online", defaultDesc: "Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun." },
    { id: "indikator-spm-15", kategori: "SPM (Standar Pelayanan Minimal)", defaultNama: "15 Indikator Target Kinerja", defaultDesc: "Target Kinerja Dinas Pendidikan dan Kebudayaan Kabupaten Madiun pada Standar Pelayanan Minimal (SPM) Bidang Pendidikan Tahun 2025 s/d 2027." },
    { id: "ijin-operasional", kategori: "Lembaga Sekolah (Lembaga #02)", defaultNama: "Ijin Operasional", defaultDesc: "Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun." },
    { id: "rpjmd", kategori: "Laporan RPJMD 2025 - 2029", defaultNama: "RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029", defaultDesc: "Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah." }
  ];

  var finalRows = [];
  standardOrder.forEach(function(std, idx) {
    var cur = existingMap[std.id] || {};
    var namaVal = (cur.nama != null && cur.nama !== "") ? cur.nama : std.defaultNama;
    var safeDesc = (cur.deskripsi != null && cur.deskripsi !== "") ? cur.deskripsi : std.defaultDesc;
    if (safeDesc.length > 45000) safeDesc = safeDesc.substring(0, 45000);

    finalRows.push([
      (idx + 1).toString(),
      std.id,
      cur.kategori || std.kategori,
      namaVal,
      safeDesc,
      cur.waktuUpdate || nowStr
    ]);
  });

  // Bersihkan dan timpa bersih baris data pada seluruh target sheets
  targetSheets.forEach(function(targetSheet) {
    clearDataRows(targetSheet);
    targetSheet.getRange(2, 1, finalRows.length, finalRows[0].length).setValues(finalRows);
    for (var c = 1; c <= 6; c++) {
      targetSheet.autoResizeColumn(c);
    }
  });
}

function saveEkinerjaData(ss, rows, nowStr) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.EKINERJA);
  clearDataRows(sheet);
  if (!rows || rows.length === 0) return;

  var output = rows.map(function(r) {
    return [
      r[0] || "",
      r[1] || "",
      r[2] || "",
      r[3] || "",
      r[4] || "",
      r[5] || "",
      r[6] || "",
      nowStr
    ];
  });
  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= SHEET_CONFIGS.EKINERJA.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function savePresensiData(ss, rows, nowStr) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.PRESENSI);
  clearDataRows(sheet);
  if (!rows || rows.length === 0) return;

  var output = rows.map(function(r) {
    return [
      r[0] || "",
      r[1] || "",
      r[2] || "",
      r[3] || "",
      nowStr
    ];
  });
  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= SHEET_CONFIGS.PRESENSI.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function saveIndikatorSpmData(ss, rows, nowStr) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.INDIKATOR_SPM);
  clearDataRows(sheet);
  if (!rows || rows.length === 0) return;

  var output = rows.map(function(r, idx) {
    return [
      (r[0] != null && r[0].toString() !== "") ? r[0].toString() : (idx + 1).toString(),
      r[1] != null ? r[1].toString() : "",
      r[2] != null ? r[2].toString() : "",
      r[3] != null ? r[3].toString() : "",
      r[4] != null ? r[4].toString() : "",
      r[5] != null ? r[5].toString() : "",
      nowStr
    ];
  });
  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= SHEET_CONFIGS.INDIKATOR_SPM.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function saveIjinData(ss, rows, nowStr) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.IJIN_OPERASIONAL);
  clearDataRows(sheet);
  if (!rows || rows.length === 0) return;

  var output = rows.map(function(r) {
    return [
      r[0] || "",
      r[1] || "",
      r[2] || "",
      r[3] || "",
      nowStr
    ];
  });
  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= SHEET_CONFIGS.IJIN_OPERASIONAL.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function saveRpjmdData(ss, docs, nowStr) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.RPJMD);
  clearDataRows(sheet);
  if (!docs || docs.length === 0) return;

  var output = docs.map(function(d, idx) {
    return [
      d.id || ("rpjmd-dok-" + (idx + 1)),
      d.kategori || "perencanaan",
      d.nomor != null ? d.nomor : (idx + 1),
      d.nama || "",
      d.judulLengkap || d.nama || "",
      d.tahun || "2025 - 2029",
      d.ukuranFile || "PDF",
      d.fileUrl || "#",
      d.penjelasan || "",
      nowStr
    ];
  });
  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= SHEET_CONFIGS.RPJMD.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function saveBeritaData(ss, newsList, nowStr) {
  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.BERITA);
  clearDataRows(sheet);
  if (!newsList || newsList.length === 0) return;

  var output = newsList.map(function(n, idx) {
    var id = (n.id != null && n.id !== "") ? n.id.toString() : ("berita-" + (idx + 1));
    var judul = (n.judul != null && n.judul !== "") ? n.judul : (n.title != null ? n.title : "");
    var kategori = (n.kategori != null && n.kategori !== "") ? n.kategori : (n.category != null ? n.category : "Berita");
    var tanggal = (n.tanggal != null && n.tanggal !== "") ? n.tanggal : (n.date != null ? n.date : "");
    var ringkasan = (n.ringkasan != null && n.ringkasan !== "") ? n.ringkasan : (n.summary != null ? n.summary : (n.content != null ? n.content : (n.isi != null ? n.isi : "")));
    var link = (n.link != null && n.link !== "") ? n.link : (n.tautan != null ? n.tautan : "#");
    var gambar = (n.gambar != null && n.gambar !== "") ? n.gambar : (n.image != null ? n.image : "");

    // Proteksi batas panjang string per sel Google Sheet (maksimal 50.000 karakter)
    var safeGambar = gambar ? gambar.toString() : "";
    if (safeGambar.length > 45000) {
      safeGambar = safeGambar.substring(0, 45000);
    }
    var safeRingkasan = ringkasan ? ringkasan.toString() : "";
    if (safeRingkasan.length > 45000) {
      safeRingkasan = safeRingkasan.substring(0, 45000);
    }

    return [
      id,
      judul ? judul.toString() : "",
      kategori ? kategori.toString() : "Berita",
      tanggal ? tanggal.toString() : "",
      safeRingkasan,
      link ? link.toString() : "#",
      safeGambar,
      nowStr
    ];
  });
  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= SHEET_CONFIGS.BERITA.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

/**
 * Hapus seluruh baris data lama (mulai dari baris ke-2) agar ditimpa bersih
 */
function clearDataRows(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow >= 2 && lastCol >= 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }
}

/**
 * Helper JSON Response dengan Header CORS Lengkap
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
