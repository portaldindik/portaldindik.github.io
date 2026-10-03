/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - PART 2: LOGIKA, TIMPA OTOMATIS & API (PORTAL DINDIK)
 * ==============================================================================
 * File ini berisi seluruh fungsi:
 * 1. Menimpa seluruh sheet secara otomatis tanpa error batas sel 50.000 karakter.
 * 2. Proteksi safeCellText & pemecah chunk JSON per 20.000 karakter.
 * 3. Update real-time untuk tabel, galeri foto, ringkasan, dan statistik.
 * 4. Endpoint Web App doGet (baca data) & doPost (terima simpanan dari admin).
 * ==============================================================================
 */

/**
 * Menu Tambahan di Antarmuka Google Spreadsheet
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('🏛️ Portal Dindik Madiun')
      .addItem('⚡ 1. Inisialisasi Seluruh Kolom & Sheet Otomatis', 'initAllSheets')
      .addItem('🔄 2. Muat Ulang Data Bawaan Portal', 'populateDefaultData')
      .addSeparator()
      .addItem('📤 3. Perbarui Seluruh Tab Sheet dari Master JSON', 'syncMasterToSheets')
      .addItem('📥 4. Simpan Perubahan Tab Sheet ke Master JSON', 'syncSheetsToMaster')
      .addSeparator()
      .addItem('ℹ️ Bantuan & Status API', 'showInfoDialog')
      .addToUi();
  } catch (e) {
    Logger.log('onOpen: ' + e);
  }
}

/**
 * Memastikan kapasitas baris dan kolom mencukupi sebelum manipulasi range
 */
function ensureSheetDimensions(sheet, minRows, minCols) {
  var currentRows = sheet.getMaxRows();
  if (currentRows < minRows) {
    sheet.insertRowsAfter(currentRows, minRows - currentRows);
  }
  var currentCols = sheet.getMaxColumns();
  if (currentCols < minCols) {
    sheet.insertColumnsAfter(currentCols, minCols - currentCols);
  }
}

/**
 * PENTING: Mencegah error 'Masukan Anda melebihi jumlah maksimum 50000 karakter dalam satu sel'
 * Setiap sel dibatasi maksimal 40.000 karakter. Gambar Base64 yang sangat panjang
 * diringkas labelnya untuk sel tampilan sheet, sementara data aslinya tetap utuh di Master JSON.
 */
function safeCellText(val) {
  if (val === null || val === undefined) return '';
  var str = (typeof val === 'object') ? JSON.stringify(val) : String(val);
  if (str.length > 40000) {
    if (str.indexOf('data:image/') === 0) {
      return '[Gambar Base64 Tersemat - Ukuran: ' + Math.round(str.length / 1024) + ' KB - Tersimpan Penuh di Master JSON]';
    }
    return str.substring(0, 40000) + '... [Dipangkas untuk sel sheet]';
  }
  return str;
}

/**
 * Menulis JSON berukuran besar dengan memecahnya (chunk) ke beberapa baris
 * MENGGUNAKAN UKURAN 20.000 KARAKTER (Jauh di bawah batas 50.000 karakter Google Sheets)
 */
function writeJsonChunks(sheet, jsonString) {
  var CHUNK_SIZE = 20000;
  var chunks = [];
  for (var i = 0; i < jsonString.length; i += CHUNK_SIZE) {
    chunks.push([jsonString.substring(i, i + CHUNK_SIZE)]);
  }
  ensureSheetDimensions(sheet, chunks.length + 5, 3);
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.getRange(2, 3, Math.max(lastRow - 1, 1), 1).clearContent();
  }
  sheet.getRange(2, 3, chunks.length, 1).setValues(chunks);
}

/**
 * Membaca kembali potongan JSON dari kolom C dan menggabungkannya
 */
function readJsonChunks(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return '';
  var values = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  var result = '';
  for (var i = 0; i < values.length; i++) {
    if (values[i][0]) {
      result += values[i][0];
    }
  }
  return result;
}

/**
 * FUNGSI UTAMA: Membuat seluruh sheet, memberi format header, dan mengisi data awal
 */
function initAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return saveMasterData(DEFAULT_PORTAL_DATA);
}

/**
 * Muat Ulang Seluruh Data Awal Bawaan Portal
 */
function populateDefaultData() {
  return saveMasterData(DEFAULT_PORTAL_DATA);
}

/**
 * Membaca data dari Sheet DATA_JSON_MASTER
 */
function getMasterData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName('DATA_JSON_MASTER');
  if (!masterSheet) {
    initAllSheets();
    masterSheet = ss.getSheetByName('DATA_JSON_MASTER');
  }
  try {
    var rawJson = readJsonChunks(masterSheet);
    if (rawJson) {
      var parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    Logger.log('Gagal membaca JSON master: ' + e);
  }
  return DEFAULT_PORTAL_DATA;
}

/**
 * Memperbarui / Menimpa Sheet Dokumentasi Foto Kegiatan
 */
function updateDokumentasiFotoSheet(ss, data) {
  var fotoSheet = ss.getSheetByName('DOKUMENTASI_FOTO');
  if (!fotoSheet) {
    fotoSheet = ss.insertSheet('DOKUMENTASI_FOTO');
  }
  fotoSheet.clear();
  var fotoHeaders = [['No', 'Fitur ID', 'Nama Fitur', 'Sub-Modul ID', 'Nama Sub-Modul', 'Judul Kegiatan', 'Tanggal', 'URL Gambar', 'Deskripsi / Keterangan']];
  
  ensureSheetDimensions(fotoSheet, 20, fotoHeaders[0].length);
  fotoSheet.getRange(1, 1, 1, fotoHeaders[0].length).setValues(fotoHeaders);
  fotoSheet.getRange(1, 1, 1, fotoHeaders[0].length)
    .setBackground('#047857')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  var fotoRows = [];
  var fotoIndex = 1;
  (data || []).forEach(function(f) {
    (f.bagian || []).forEach(function(b) {
      if (b.kegiatan && b.kegiatan.length > 0) {
        b.kegiatan.forEach(function(k) {
          fotoRows.push([
            fotoIndex++,
            safeCellText(f.id),
            safeCellText(f.judul),
            safeCellText(b.id),
            safeCellText(b.nama),
            safeCellText(k.judul),
            safeCellText(k.tanggal),
            safeCellText(k.gambar),
            safeCellText(k.keterangan || k.deskripsi)
          ]);
        });
      }
    });
  });

  if (fotoRows.length > 0) {
    ensureSheetDimensions(fotoSheet, fotoRows.length + 5, fotoHeaders[0].length);
    fotoSheet.getRange(2, 1, fotoRows.length, fotoHeaders[0].length).setValues(fotoRows);
    fotoSheet.getRange(1, 1, fotoRows.length + 1, fotoHeaders[0].length)
      .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  }
  fotoSheet.setFrozenRows(1);
  for (var c = 1; c <= fotoHeaders[0].length; c++) {
    fotoSheet.autoResizeColumn(c);
  }
}

/**
 * Memperbarui / Menimpa Sheet Ringkasan 9 Fitur Utama
 */
function updateRingkasanFiturSheet(ss, data) {
  var sheet = ss.getSheetByName('RINGKASAN_FITUR');
  if (!sheet) {
    sheet = ss.insertSheet('RINGKASAN_FITUR');
  }
  sheet.clear();
  var headers = [['No', 'Fitur ID', 'Nomor', 'Judul Fitur Utama', 'Subjudul', 'Ringkasan Layanan', 'Ikon FontAwesome']];
  
  ensureSheetDimensions(sheet, 15, headers[0].length);
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  sheet.getRange(1, 1, 1, headers[0].length)
    .setBackground('#4338ca')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  var rows = [];
  (data || []).forEach(function(f, idx) {
    rows.push([
      idx + 1,
      safeCellText(f.id),
      safeCellText(f.nomor || ('0' + (idx + 1))),
      safeCellText(f.judul),
      safeCellText(f.subjudul),
      safeCellText(f.ringkasan),
      safeCellText(f.ikon)
    ]);
  });

  if (rows.length > 0) {
    ensureSheetDimensions(sheet, rows.length + 5, headers[0].length);
    sheet.getRange(2, 1, rows.length, headers[0].length).setValues(rows);
    sheet.getRange(1, 1, rows.length + 1, headers[0].length)
      .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  }
  sheet.setFrozenRows(1);
  for (var c = 1; c <= headers[0].length; c++) {
    sheet.autoResizeColumn(c);
  }
}

/**
 * Memperbarui / Menimpa Sheet Statistik Capaian Program
 */
function updateStatistikSheet(ss, data) {
  var sheet = ss.getSheetByName('STATISTIK_PROGRAM');
  if (!sheet) {
    sheet = ss.insertSheet('STATISTIK_PROGRAM');
  }
  sheet.clear();
  var headers = [['No', 'Fitur ID', 'Nama Fitur', 'Sub-Modul ID', 'Nama Sub-Modul', 'Indikator / Label Statistik', 'Capaian / Nilai', 'Keterangan Tambahan']];
  
  ensureSheetDimensions(sheet, 30, headers[0].length);
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  sheet.getRange(1, 1, 1, headers[0].length)
    .setBackground('#0f766e')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  var rows = [];
  var statIndex = 1;
  (data || []).forEach(function(f) {
    (f.bagian || []).forEach(function(b) {
      if (b.statistik && Array.isArray(b.statistik) && b.statistik.length > 0) {
        b.statistik.forEach(function(st) {
          rows.push([
            statIndex++,
            safeCellText(f.id),
            safeCellText(f.judul),
            safeCellText(b.id),
            safeCellText(b.nama),
            safeCellText(st.label),
            safeCellText(st.nilai),
            safeCellText(st.keterangan)
          ]);
        });
      }
    });
  });

  if (rows.length > 0) {
    ensureSheetDimensions(sheet, rows.length + 5, headers[0].length);
    sheet.getRange(2, 1, rows.length, headers[0].length).setValues(rows);
    sheet.getRange(1, 1, rows.length + 1, headers[0].length)
      .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  }
  sheet.setFrozenRows(1);
  for (var c = 1; c <= headers[0].length; c++) {
    sheet.autoResizeColumn(c);
  }
}

/**
 * FUNGSI UTAMA: MENIMPA SELURUH SHEET DENGAN DATA TERBARU DARI PANEL ADMIN
 */
function saveMasterData(newData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Simpan ke Sheet Master JSON
  var masterSheet = ss.getSheetByName('DATA_JSON_MASTER');
  if (!masterSheet) {
    masterSheet = ss.insertSheet('DATA_JSON_MASTER', 0);
  }
  masterSheet.getRange('A1:C1').setValues([['TANGGAL_UPDATE', 'VERSI_DATA', 'JSON_DATA_PARTS']]);
  masterSheet.getRange('A1:C1').setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
  masterSheet.getRange('A2:B2').setValues([[new Date().toISOString(), '2026.09.26.v36']]);
  writeJsonChunks(masterSheet, JSON.stringify(newData));
  masterSheet.setFrozenRows(1);

  // 2. Timpa Seluruh 15 Sheet Tabel Individual
  TABLE_CONFIGS.forEach(function(cfg) {
    var sheet = ss.getSheetByName(cfg.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(cfg.sheetName);
    }
    sheet.clear();

    var f = newData.find(function(item) { return item.id === cfg.featureId; });
    var sub = f && f.bagian ? f.bagian.find(function(b) { return b.id === cfg.subId; }) : null;

    if (sub && sub.kolom && sub.kolom.length > 0) {
      ensureSheetDimensions(sheet, Math.max((sub.baris ? sub.baris.length : 0) + 5, 10), sub.kolom.length);
      
      // Header Kolom
      var headerRow = [sub.kolom];
      sheet.getRange(1, 1, 1, sub.kolom.length).setValues(headerRow);
      sheet.getRange(1, 1, 1, sub.kolom.length)
        .setBackground('#1e3a8a')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');

      // Baris Data
      if (sub.baris && sub.baris.length > 0) {
        var sanitizedRows = sub.baris.map(function(row) {
          var cleanRow = [];
          for (var colIdx = 0; colIdx < sub.kolom.length; colIdx++) {
            var val = (row && row[colIdx] !== undefined && row[colIdx] !== null) ? row[colIdx] : '';
            cleanRow.push(safeCellText(val));
          }
          return cleanRow;
        });

        ensureSheetDimensions(sheet, sanitizedRows.length + 5, sub.kolom.length);
        sheet.getRange(2, 1, sanitizedRows.length, sub.kolom.length).setValues(sanitizedRows);
        sheet.getRange(1, 1, sanitizedRows.length + 1, sub.kolom.length)
          .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
      }
      sheet.setFrozenRows(1);
      for (var col = 1; col <= sub.kolom.length; col++) {
        sheet.autoResizeColumn(col);
      }
    }
  });

  // 3. Timpa Sheet Dokumentasi Foto Kegiatan
  updateDokumentasiFotoSheet(ss, newData);

  // 4. Timpa Sheet Ringkasan Fitur
  updateRingkasanFiturSheet(ss, newData);

  // 5. Timpa Sheet Statistik Capaian Program
  updateStatistikSheet(ss, newData);

  // 6. Hapus sheet bawaan Sheet1 jika tidak diperlukan
  var defaultSheet1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1') || ss.getSheetByName('Sheet');
  if (defaultSheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet1); } catch(e) {}
  }

  // Terapkan semua perubahan seketika
  SpreadsheetApp.flush();
  return 'Seluruh data berhasil ditimpa dan diperbarui dengan data terbaru dari Panel Admin!';
}

/**
 * Sinkronkan perubahan langsung yang diedit di Sheet ke Master JSON
 */
function syncSheetsToMaster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var currentData = getMasterData();

  TABLE_CONFIGS.forEach(function(cfg) {
    var sheet = ss.getSheetByName(cfg.sheetName);
    if (sheet) {
      var lastRow = sheet.getLastRow();
      var f = currentData.find(function(item) { return item.id === cfg.featureId; });
      var sub = f && f.bagian ? f.bagian.find(function(b) { return b.id === cfg.subId; }) : null;
      if (sub && sub.kolom) {
        if (lastRow >= 2) {
          var values = sheet.getRange(2, 1, lastRow - 1, sub.kolom.length).getValues();
          sub.baris = values.filter(function(row) {
            return row.some(function(cell) { return cell !== '' && cell !== null; });
          }).map(function(row) {
            return row.map(function(cell) { return safeCellText(cell); });
          });
        } else {
          sub.baris = [];
        }
      }
    }
  });

  saveMasterData(currentData);
  try {
    SpreadsheetApp.getUi().alert('✅ Berhasil!', 'Seluruh perubahan dari tabel-tabel sheet telah disimpan ke Data Master Portal!', SpreadsheetApp.getUi().ButtonSet.OK);
  } catch(e) {}
}

/**
 * Perbarui Seluruh Tab Sheet dari Master JSON
 */
function syncMasterToSheets() {
  var data = getMasterData();
  saveMasterData(data);
  try {
    SpreadsheetApp.getUi().alert('✅ Berhasil!', 'Seluruh tab sheet berhasil diperbarui dengan data master portal!', SpreadsheetApp.getUi().ButtonSet.OK);
  } catch(e) {}
}

/**
 * Endpoint GET Web App (Membaca Data ke Web)
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getData';
    
    if (action === 'init') {
      initAllSheets();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Inisialisasi sheet berhasil diselesaikan!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = getMasterData();
    var response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      version: '2026.09.26.v36',
      totalFeatures: data.length,
      data: data
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint POST Web App (Menerima Data Simpanan dari Panel Admin dan Menimpa Sheet)
 */
function doPost(e) {
  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var payload = {};

    if (contents) {
      try {
        payload = JSON.parse(contents);
      } catch (err) {
        try {
          payload = JSON.parse(decodeURIComponent(contents));
        } catch(err2) {
          payload = e.parameter || {};
        }
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    if (payload.action === 'init') {
      initAllSheets();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Inisialisasi seluruh sheet berhasil dilakukan dari Admin!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Ekstraksi data portal secara aman
    var portalDataToSave = null;
    if (Array.isArray(payload)) {
      portalDataToSave = payload;
    } else if (payload.data) {
      portalDataToSave = payload.data;
    } else if (payload.portalData) {
      portalDataToSave = payload.portalData;
    } else {
      portalDataToSave = payload;
    }

    if (typeof portalDataToSave === 'string') {
      try {
        portalDataToSave = JSON.parse(portalDataToSave);
      } catch(err) {}
    }

    if (portalDataToSave && !Array.isArray(portalDataToSave) && Array.isArray(portalDataToSave.data)) {
      portalDataToSave = portalDataToSave.data;
    }

    if (Array.isArray(portalDataToSave) && portalDataToSave.length > 0) {
      // TIMPA SELURUH DATA DENGAN DATA TERBARU
      saveMasterData(portalDataToSave);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data berhasil disinkronkan dan seluruh sheet Google Spreadsheet berhasil ditimpa dengan data terbaru!',
        timestamp: new Date().toISOString(),
        totalFeatures: portalDataToSave.length
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Format data tidak valid. Data yang dikirim harus berupa array fitur portal.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Server Google Apps Script Error: ' + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menampilkan Dialog Info Panduan di Spreadsheet
 */
function showInfoDialog() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.alert(
      '🏛️ Portal Dindik Madiun - Status Spreadsheet',
      'Spreadsheet ini telah terhubung dengan sistem Portal Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.\n\n' +
      'Data di spreadsheet ini akan OTOMATIS DITIMPA dengan data terbaru setiap kali Anda menyimpan perubahan di Panel Admin.\n\n' +
      'Untuk menghubungkan ke Web Panel Admin:\n' +
      '1. Klik Deploy > New deployment (Deployment baru).\n' +
      '2. Pilih Web app (Aplikasi Web).\n' +
      '3. Atur akses: Anyone (Siapa saja).\n' +
      '4. Salin URL Aplikasi Web yang muncul dan tempelkan ke Panel Admin Portal.',
      ui.ButtonSet.OK
    );
  } catch(e) {}
}
