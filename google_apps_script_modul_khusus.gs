/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: SPREADSHEET KHUSUS MODUL MANDIRI
 * Dinas Pendidikan dan Kebudayaan Kabupaten Madiun
 * ==============================================================================
 * Modul yang terhubung:
 * 1. Deskripsi Sub Modul (Nama Sub Modul & Deskripsi Lengkap Sub Bagian)
 *    - E-Kinerja (SPM #01)
 *    - Presensi Online Pegawai & Tendik (SPM #01)
 *    - Ijin Operasional Satuan Pendidikan (Lembaga #02)
 *    - Laporan RPJMD 2025 - 2029
 * 2. E-Kinerja & Capaian (SPM #01) -> Target & Triwulan 1 s/d 4
 * 3. Presensi Online Pegawai & Tendik (SPM #01) -> NIP & Persentase Kehadiran
 * 4. Ijin Operasional Satuan Pendidikan (Lembaga #02) -> Status Perizinan Satuan Pendidikan
 * 5. Laporan RPJMD 2025 - 2029 (Dokumen Perencanaan & Laporan Kinerja)
 * 6. Informasi Publik / Berita & Pengumuman Resmi
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

  // Otomatis isi baris bawaan Deskripsi Sub Modul jika sheet masih kosong
  var deskripsiSheet = ss.getSheetByName(SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.sheetName);
  if (deskripsiSheet && deskripsiSheet.getLastRow() <= 1) {
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var defaultInfo = [
      ["1", "ekinerja", "SPM (Standar Pelayanan Minimal)", "E-Kinerja", "Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.", nowStr],
      ["2", "presensi-online", "SPM (Standar Pelayanan Minimal)", "Presensi Online", "Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.", nowStr],
      ["3", "ijin-operasional", "Lembaga Sekolah (Lembaga #02)", "Ijin Operasional", "Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun.", nowStr],
      ["4", "rpjmd", "Laporan RPJMD 2025 - 2029", "RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029", "Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.", nowStr]
    ];
    deskripsiSheet.getRange(2, 1, defaultInfo.length, defaultInfo[0].length).setValues(defaultInfo);
    for (var c = 1; c <= SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.headers.length; c++) {
      deskripsiSheet.autoResizeColumn(c);
    }
  }

  try {
    SpreadsheetApp.getUi().alert("Inisialisasi Berhasil!\n\nSheet Modul Mandiri (Deskripsi_Sub_Modul, E_Kinerja, Presensi_Online, Ijin_Operasional, Laporan_RPJMD, Berita_Pengumuman) beserta kolom header telah selesai dibuat.");
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

    // 3. Simpan Ijin Operasional (Jika ada dalam payload)
    if (payload.ijinOperasional && Array.isArray(payload.ijinOperasional)) {
      saveIjinData(ss, payload.ijinOperasional, nowStr);
      updatedModules.push("Ijin Operasional");
    }

    // 4. Simpan Laporan RPJMD (Jika ada dalam payload)
    if (payload.rpjmd && (Array.isArray(payload.rpjmd) || (payload.rpjmd.dokumen && Array.isArray(payload.rpjmd.dokumen)))) {
      var rpjmdList = Array.isArray(payload.rpjmd) ? payload.rpjmd : payload.rpjmd.dokumen;
      saveRpjmdData(ss, rpjmdList, nowStr);
      updatedModules.push("Laporan RPJMD");
    }

    // 5. Simpan Berita & Pengumuman (Jika ada dalam payload)
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

  // 4 Modul Standar yang selalu dipertahankan urutannya
  var standardOrder = [
    { id: "ekinerja", kategori: "SPM (Standar Pelayanan Minimal)", defaultNama: "E-Kinerja", defaultDesc: "Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun." },
    { id: "presensi-online", kategori: "SPM (Standar Pelayanan Minimal)", defaultNama: "Presensi Online", defaultDesc: "Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun." },
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
