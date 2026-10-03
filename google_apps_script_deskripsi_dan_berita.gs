/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: SPREADSHEET KHUSUS DESKRIPSI SUB MODUL & BERITA RESMI
 * Dinas Pendidikan dan Kebudayaan Kabupaten Madiun
 * ==============================================================================
 * SCRIPT MANDIRI & BERDIRI SENDIRI:
 * Script ini independen dan tidak mengganggu skrip spreadsheet lainnya.
 *
 * MODUL & DATA YANG DIAMBIL:
 * 1. Sheet "Deskripsi_Sub_Modul":
 *    - Kelola E-Kinerja (SPM #01)
 *    - Kelola Presensi Online (SPM #01)
 *    - Kelola Ijin Operasional (Lembaga Sekolah #02)
 *    - Laporan RPJMD (2025 - 2029)
 *    Yang diambil HANYA: "Nama Sub Modul" & "Deskripsi Lengkap Sub Bagian".
 *
 * 2. Sheet "Berita_Pengumuman":
 *    - Kelola Berita & Pengumuman (Publikasi Informasi Resmi)
 *    Yang diambil:
 *    - Judul Berita / Pengumuman *
 *    - Tanggal Terbit / Kegiatan *
 *    - Foto / Gambar Berita (URL)
 *    - Kategori *
 *    - Ringkasan / Isi Berita *
 *    - Tautan Sumber Luar / Link Lengkap (Opsional)
 *
 * FITUR UTAMA:
 * - Otomatis membuat 2 sheet dan header kolom secara instan
 * - Metode TIMPA DATA TERBARU (Overwrite): Data lama dibersihkan dan diganti data mutakhir
 * - Keamanan sel: Proteksi batas karakter sel Google Sheet (maksimal 50.000 karakter)
 * - Dukungan penuh JSON CORS (GET untuk tarik data & POST untuk kirim data)
 * ==============================================================================
 */

// Konfigurasi Nama Sheet, Warna Header & Kolom Otomatis
var CONFIG_SHEET_MANDIRI = {
  DESKRIPSI: {
    sheetName: "Deskripsi_Sub_Modul",
    headerBg: "#4C1D95", // Dark Purple Elegan
    headers: [
      "No",
      "ID Sub Modul",
      "Kategori Modul",
      "Nama Sub Modul",
      "Deskripsi Lengkap Sub Bagian",
      "Waktu Pembaruan"
    ]
  },
  BERITA: {
    sheetName: "Berita_Pengumuman",
    headerBg: "#1E293B", // Dark Slate Elegan
    headers: [
      "No",
      "ID Berita",
      "Judul Berita / Pengumuman",
      "Tanggal Terbit / Kegiatan",
      "Kategori",
      "Ringkasan / Isi Berita",
      "Tautan Sumber Luar / Link Lengkap",
      "Foto / Gambar Berita (URL)",
      "Waktu Pembaruan"
    ]
  }
};

/**
 * FUNGSI SEKALI KLIK: Inisialisasi Otomatis 2 Sheet dan Header Kolom
 * Jalankan fungsi ini dari editor Apps Script saat pertama kali menggunakan Spreadsheet.
 */
function initSheetDeskripsiDanBerita() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Buat dan siapkan Sheet Deskripsi_Sub_Modul
  var sheetDeskripsi = ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.DESKRIPSI);
  if (sheetDeskripsi.getLastRow() <= 1) {
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var defaultSubModul = [
      [
        "1",
        "ekinerja",
        "SPM (Standar Pelayanan Minimal)",
        "E-Kinerja",
        "Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.",
        nowStr
      ],
      [
        "2",
        "presensi-online",
        "SPM (Standar Pelayanan Minimal)",
        "Presensi Online",
        "Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.",
        nowStr
      ],
      [
        "3",
        "ijin-operasional",
        "Lembaga Sekolah (Lembaga #02)",
        "Ijin Operasional",
        "Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun.",
        nowStr
      ],
      [
        "4",
        "rpjmd",
        "Laporan RPJMD 2025 - 2029",
        "RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029",
        "Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.",
        nowStr
      ]
    ];
    sheetDeskripsi.getRange(2, 1, defaultSubModul.length, defaultSubModul[0].length).setValues(defaultSubModul);
    for (var c = 1; c <= CONFIG_SHEET_MANDIRI.DESKRIPSI.headers.length; c++) {
      sheetDeskripsi.autoResizeColumn(c);
    }
  }

  // 2. Buat dan siapkan Sheet Berita_Pengumuman
  var sheetBerita = ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.BERITA);
  if (sheetBerita.getLastRow() <= 1) {
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var defaultBerita = [
      [
        "1",
        "berita-1",
        "Pemberian Piagam Penghargaan Sekolah Adiwiyata Tingkat Kabupaten Madiun Tahun 2026",
        "2026-09-25",
        "Prestasi",
        "Dinas Pendidikan dan Kebudayaan Kabupaten Madiun secara resmi menyerahkan penghargaan Sekolah Adiwiyata kepada satuan pendidikan yang berhasil mewujudkan tata kelola lingkungan sekolah hijau, bersih, dan berkelanjutan.",
        "https://dindik.madiunkab.go.id/",
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
        nowStr
      ]
    ];
    sheetBerita.getRange(2, 1, defaultBerita.length, defaultBerita[0].length).setValues(defaultBerita);
    for (var c = 1; c <= CONFIG_SHEET_MANDIRI.BERITA.headers.length; c++) {
      sheetBerita.autoResizeColumn(c);
    }
  }

  try {
    SpreadsheetApp.getUi().alert("Inisialisasi Berhasil!\n\n2 Sheet Baru:\n1. Deskripsi_Sub_Modul\n2. Berita_Pengumuman\nbeserta kolom header dan format otomatis telah selesai dibuat.");
  } catch(e) {
    Logger.log("Inisialisasi 2 Sheet mandiri selesai dibuat.");
  }
}

/**
 * Memastikan sheet dan kolom header tersedia serta diformat otomatis
 */
function ensureSheetOtomatis(ss, config) {
  var sheet = ss.getSheetByName(config.sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(config.sheetName);
  }
  
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(config.headerBg);
    headerRange.setFontColor("#FFFFFF");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 35);
    
    for (var c = 1; c <= config.headers.length; c++) {
      sheet.autoResizeColumn(c);
    }
  }
  return sheet;
}

/**
 * ENDPOINT GET: Membaca Data dari Spreadsheet
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var params = e ? e.parameter : {};
    var action = params.action || "getData";

    ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.DESKRIPSI);
    ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.BERITA);

    if (action === "getData" || action === "getAll") {
      var result = {
        status: "success",
        timestamp: new Date().toISOString(),
        data: {
          infoSubModul: getSubModulFromSheet(ss),
          berita: getBeritaFromSheet(ss)
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
 * ENDPOINT POST: Menerima dan MENIMPA Data Terbaru (Overwrite Method)
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

    ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.DESKRIPSI);
    ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.BERITA);

    var updatedList = [];

    // 1. Simpan & Timpa Nama Sub Modul & Deskripsi Lengkap Sub Bagian
    if (payload.infoSubModul && Array.isArray(payload.infoSubModul)) {
      saveSubModulToSheet(ss, payload.infoSubModul, nowStr);
      updatedList.push("Deskripsi Sub Modul");
    }

    // 2. Simpan & Timpa Berita & Pengumuman
    if (payload.berita && Array.isArray(payload.berita)) {
      saveBeritaToSheet(ss, payload.berita, nowStr);
      updatedList.push("Berita & Pengumuman");
    }

    return createJsonResponse({
      status: "success",
      message: "Data berhasil disimpan dan ditimpa dengan data terbaru pada Google Spreadsheet.",
      timestamp: nowStr,
      updatedModules: updatedList
    });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// ==========================================
// FUNGSI PENGAMBILAN DATA (GETTERS)
// ==========================================

function getSubModulFromSheet(ss) {
  var sheet = ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.DESKRIPSI);
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

function getBeritaFromSheet(ss) {
  var sheet = ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.BERITA);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  return values.map(function(row, idx) {
    return {
      no: row[0] != null ? row[0].toString() : (idx + 1).toString(),
      id: row[1] != null ? row[1].toString() : ("berita-" + (idx + 1)),
      judul: row[2] != null ? row[2].toString() : "",
      tanggal: row[3] != null ? row[3].toString() : "",
      kategori: row[4] != null ? row[4].toString() : "Berita",
      ringkasan: row[5] != null ? row[5].toString() : "",
      link: row[6] != null ? row[6].toString() : "#",
      gambar: row[7] != null ? row[7].toString() : "",
      waktuUpdate: row[8] != null ? row[8].toString() : ""
    };
  });
}

// ==========================================
// FUNGSI TIMPA DATA TERBARU (OVERWRITE SETTERS)
// ==========================================

function saveSubModulToSheet(ss, infoList, nowStr) {
  var sheet = ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.DESKRIPSI);
  if (!infoList || !Array.isArray(infoList) || infoList.length === 0) return;

  // Baca data yang ada saat ini di sheet
  var existingMap = {};
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var oldValues = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
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

  // Timpa dan gabungkan nilai baru yang dikirim dari panel admin
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
    {
      id: "ekinerja",
      kategori: "SPM (Standar Pelayanan Minimal)",
      defaultNama: "E-Kinerja",
      defaultDesc: "Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun."
    },
    {
      id: "presensi-online",
      kategori: "SPM (Standar Pelayanan Minimal)",
      defaultNama: "Presensi Online",
      defaultDesc: "Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun."
    },
    {
      id: "ijin-operasional",
      kategori: "Lembaga Sekolah (Lembaga #02)",
      defaultNama: "Ijin Operasional",
      defaultDesc: "Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun."
    },
    {
      id: "rpjmd",
      kategori: "Laporan RPJMD 2025 - 2029",
      defaultNama: "RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029",
      defaultDesc: "Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah."
    }
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

  // Bersihkan data lama dan timpa bersih dengan data terbaru
  clearDataRows(sheet);
  sheet.getRange(2, 1, finalRows.length, finalRows[0].length).setValues(finalRows);
  for (var c = 1; c <= CONFIG_SHEET_MANDIRI.DESKRIPSI.headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function saveBeritaToSheet(ss, newsList, nowStr) {
  var sheet = ensureSheetOtomatis(ss, CONFIG_SHEET_MANDIRI.BERITA);
  clearDataRows(sheet);
  if (!newsList || newsList.length === 0) return;

  var output = newsList.map(function(n, idx) {
    var id = (n.id != null && n.id !== "") ? n.id.toString() : ("berita-" + (idx + 1));
    var judul = (n.judul != null && n.judul !== "") ? n.judul : (n.title != null ? n.title : "");
    var tanggal = (n.tanggal != null && n.tanggal !== "") ? n.tanggal : (n.date != null ? n.date : "");
    var kategori = (n.kategori != null && n.kategori !== "") ? n.kategori : (n.category != null ? n.category : "Berita");
    var ringkasan = (n.ringkasan != null && n.ringkasan !== "") ? n.ringkasan : (n.summary != null ? n.summary : (n.content != null ? n.content : (n.isi != null ? n.isi : "")));
    var link = (n.link != null && n.link !== "") ? n.link : (n.tautan != null ? n.tautan : "#");
    var gambar = (n.gambar != null && n.gambar !== "") ? n.gambar : (n.image != null ? n.image : "");

    // Proteksi batas panjang sel string (maksimal 50.000 karakter)
    var safeGambar = gambar ? gambar.toString() : "";
    if (safeGambar.length > 45000) safeGambar = safeGambar.substring(0, 45000);

    var safeRingkasan = ringkasan ? ringkasan.toString() : "";
    if (safeRingkasan.length > 45000) safeRingkasan = safeRingkasan.substring(0, 45000);

    return [
      (idx + 1).toString(),
      id,
      judul ? judul.toString() : "",
      tanggal ? tanggal.toString() : "",
      kategori ? kategori.toString() : "Berita",
      safeRingkasan,
      link ? link.toString() : "#",
      safeGambar,
      nowStr
    ];
  });

  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
  for (var c = 1; c <= CONFIG_SHEET_MANDIRI.BERITA.headers.length; c++) {
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
