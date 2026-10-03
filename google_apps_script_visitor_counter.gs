// ==========================================================================
// GOOGLE APPS SCRIPT: 1:1 REAL-TIME SPREADSHEET SUMMARY SYNC & AUTO-UPDATE
// DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN MADIUN
// SISTEM PENGHITUNG KUNJUNGAN (VISITOR COUNTER & ANALYTICS)
// ==========================================================================
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. SHEET DETAIL LOG (Data_Kunjungan_WebsitePortal)
    var sheetLogName = "Data_Kunjungan_WebsitePortal";
    var sheetLog = ss.getSheetByName(sheetLogName);
    if (!sheetLog) {
      sheetLog = ss.insertSheet(sheetLogName);
      sheetLog.appendRow([
        "Waktu & Tanggal",
        "Tanggal (YYYY-MM-DD)",
        "Bulan (YYYY-MM)",
        "Tahun (YYYY)",
        "Tipe Akses",
        "Nama Fitur / Event",
        "Perangkat / User Agent"
      ]);
      sheetLog.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#10b981").setFontColor("#ffffff");
      sheetLog.setFrozenRows(1);
    }
    
    // 2. SHEET RINGKASAN KUNJUNGAN (Ringkasan_Kunjungan)
    var sheetSummaryName = "Ringkasan_Kunjungan";
    var sheetSummary = ss.getSheetByName(sheetSummaryName);
    if (!sheetSummary) {
      sheetSummary = ss.insertSheet(sheetSummaryName);
      sheetSummary.appendRow([
        "Hari Ini",
        "Bulan Ini",
        "Tahun Ini",
        "Terakhir Diperbarui"
      ]);
      sheetSummary.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#0284c7").setFontColor("#ffffff");
      sheetSummary.setFrozenRows(1);
      sheetSummary.appendRow([0, 0, 0, new Date()]);
    }
    
    var now = new Date();
    var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
    var monthStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM");
    var yearStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy");
    
    var params = e ? e.parameter : {};
    var action = params.action || "visit";
    var eventName = params.eventName || "Kunjungan Halaman WebsitePortal";
    var userAgent = params.userAgent || "Perangkat Tidak Diketahui";
    
    // BACA ANGKA PERSIS DARI CELL A2 (Hari Ini), B2 (Bulan Ini), C2 (Tahun Ini)
    var currentHariIni = Number(sheetSummary.getRange(2, 1).getValue()) || 0;
    var currentBulanIni = Number(sheetSummary.getRange(2, 2).getValue()) || 0;
    var currentTahunIni = Number(sheetSummary.getRange(2, 3).getValue()) || 0;
    
    // JIKA AKSES DARI PENGUNJUNG ATAU KLIK TOMBOL (PROSES PENJUMLAHAN)
    if (action === "visit" || action === "click") {
      sheetLog.appendRow([now, dateStr, monthStr, yearStr, action, eventName, userAgent]);
      
      var props = PropertiesService.getScriptProperties();
      var lastDate = props.getProperty("SUMMARY_LAST_DATE") || "";
      var lastMonth = props.getProperty("SUMMARY_LAST_MONTH") || "";
      var lastYear = props.getProperty("SUMMARY_LAST_YEAR") || "";
      
      if (lastDate !== dateStr) {
        currentHariIni = 1;
        currentBulanIni += 1;
        currentTahunIni += 1;
        props.setProperty("SUMMARY_LAST_DATE", dateStr);
      } else {
        currentHariIni += 1;
        currentBulanIni += 1;
        currentTahunIni += 1;
      }
      
      if (lastMonth !== monthStr) {
        currentBulanIni = 1;
        props.setProperty("SUMMARY_LAST_MONTH", monthStr);
      }
      
      if (lastYear !== yearStr) {
        currentTahunIni = 1;
        props.setProperty("SUMMARY_LAST_YEAR", yearStr);
      }
      
      // TULIS KEMBALI HASIL PENJUMLAHAN KE CELL SPREADSHEET
      sheetSummary.getRange(2, 1, 1, 4).setValues([
        [currentHariIni, currentBulanIni, currentTahunIni, now]
      ]);
    }
    
    // AMBIL ANGKA PERSIS DARI CELL SPREADSHEET UNTUK RESPON SINKRON 1:1 KE WEBSITE
    var liveHariIni = Number(sheetSummary.getRange(2, 1).getValue()) || currentHariIni;
    var liveBulanIni = Number(sheetSummary.getRange(2, 2).getValue()) || currentBulanIni;
    var liveTahunIni = Number(sheetSummary.getRange(2, 3).getValue()) || currentTahunIni;
    
    var result = {
      status: "success",
      today: liveHariIni,
      month: liveBulanIni,
      year: liveTahunIni
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
