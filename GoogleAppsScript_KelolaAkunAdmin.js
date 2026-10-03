/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT KHUSUS KELOLA AKUN ADMIN & HAK AKSES FITUR
 * PORTAL RESMI DINAS PENDIDIKAN & KEBUDAYAAN KABUPATEN MADIUN
 * (VERSI TERPROTEKSI: SERVER-SIDE AUTHENTICATION, PASSWORD HASHING & RBAC)
 * ==============================================================================
 * Fitur Keamanan:
 * 1. Password disimpan dalam format salted hash (SHA-256) - TIDAK PLAINTEXT.
 * 2. API tidak pernah mengembalikan password ke browser/frontend.
 * 3. Otentikasi login diproses 100% di server Google Apps Script.
 * 4. Menggunakan Signed Session Token (HMAC-SHA256) dengan masa kedaluwarsa 8 jam.
 * 5. Role & Permission diverifikasi di server; manipulasi frontend akan ditolak.
 * 6. Audit Trail otomatis tercatat di sheet 'LOG_AKTIVITAS'.
 * 7. Proteksi Formula Injection pada setiap cell sheet.
 */

var SHEET_NAME_USERS = 'DATA_AKUN_ADMIN';
var SHEET_NAME_LOGS  = 'LOG_AKTIVITAS';

// Kunci internal server untuk menandatangani Session Token (HMAC-SHA256)
// Administrator dapat menggantinya kapan saja di menu Project Settings > Script Properties
function getAuthSecretKey() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('PORTAL_AUTH_SECRET');
  if (!secret || secret.trim().length < 16) {
    // Generate server-side secret dynamically and persist in private Script Properties
    secret = Utilities.getUuid() + '-' + Utilities.getUuid() + '-' + Date.now();
    try {
      props.setProperty('PORTAL_AUTH_SECRET', secret);
    } catch(e) {}
  }
  return secret;
}

// Konversi array byte ke hex string
function bytesToHex(bytes) {
  return bytes.map(function(b) {
    var h = (b < 0 ? b + 256 : b).toString(16);
    return h.length === 1 ? '0' + h : h;
  }).join('');
}

// Hashing Password dengan SHA-256 + Salt
function hashPassword(password, salt) {
  var combined = password + ':' + salt;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined, Utilities.Charset.UTF_8);
  var hex = bytesToHex(digest);
  return 'sha256$' + salt + '$' + hex;
}

// Verifikasi password terhadap hash tersimpan
function verifyPassword(inputPassword, storedHash) {
  if (!storedHash) return false;
  if (storedHash.indexOf('sha256$') === 0) {
    var parts = storedHash.split('$');
    if (parts.length === 3) {
      var salt = parts[1];
      return hashPassword(inputPassword, salt) === storedHash;
    }
  }
  // Kompatibilitas migrasi transisi jika ada akun seed awal yang belum ter-hash
  return inputPassword === storedHash;
}

// Buat Signed Session Token (HMAC-SHA256)
function createSignedToken(user) {
  var now = Date.now();
  var exp = now + (8 * 3600 * 1000); // Masa berlaku: 8 Jam
  var payload = {
    uid: user.id,
    u: user.username,
    r: user.role,
    a: user.access || ['*'],
    exp: exp,
    iat: now
  };
  var payloadJson = JSON.stringify(payload);
  var payloadB64 = Utilities.base64EncodeWebSafe(payloadJson);
  var sigBytes = Utilities.computeHmacSha256Signature(payloadB64, getAuthSecretKey());
  var sigB64 = Utilities.base64EncodeWebSafe(sigBytes);
  return payloadB64 + '.' + sigB64;
}

// Verifikasi Signed Session Token
function verifySignedToken(token) {
  if (!token || typeof token !== 'string' || token.indexOf('.') === -1) {
    return { valid: false, message: 'Format token sesi tidak valid' };
  }
  var parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, message: 'Format token sesi tidak valid' };
  }
  var payloadB64 = parts[0];
  var sigB64 = parts[1];

  var expectedSigBytes = Utilities.computeHmacSha256Signature(payloadB64, getAuthSecretKey());
  var expectedSigB64 = Utilities.base64EncodeWebSafe(expectedSigBytes);
  if (sigB64 !== expectedSigB64) {
    return { valid: false, message: 'Token signature tidak valid (token dipalsukan atau diubah)' };
  }

  try {
    var decodedStr = Utilities.newBlob(Utilities.base64DecodeWebSafe(payloadB64)).getDataAsString();
    var payload = JSON.parse(decodedStr);
    if (!payload || !payload.exp) {
      return { valid: false, message: 'Payload token tidak lengkap' };
    }
    if (Date.now() > payload.exp) {
      return { valid: false, message: 'Sesi token telah kedaluwarsa. Silakan login kembali.' };
    }
    return { valid: true, payload: payload };
  } catch(e) {
    return { valid: false, message: 'Gagal memproses token: ' + e.toString() };
  }
}

// Pencatatan Log Audit ke Sheet LOG_AKTIVITAS
function logActivity(username, role, action, resource, status, details) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName(SHEET_NAME_LOGS);
    if (!logSheet) {
      logSheet = ss.insertSheet(SHEET_NAME_LOGS);
      var headers = ['No', 'Waktu (WIB)', 'Username', 'Peran (Role)', 'Aksi', 'Resource / Target', 'Status', 'Keterangan'];
      logSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      logSheet.getRange(1, 1, 1, headers.length)
        .setBackground('#1e293b')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      logSheet.setFrozenRows(1);
    }
    var rowCount = logSheet.getLastRow();
    var timeStr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    logSheet.appendRow([
      rowCount,
      timeStr,
      username || 'Anonim',
      role || '-',
      action || '-',
      resource || '-',
      status || 'INFO',
      details || ''
    ]);
  } catch(e) {
    Logger.log('Gagal mencatat log aktivitas: ' + e);
  }
}

// Sanitasi Formula Injection
function sanitizeCellValue(val) {
  if (typeof val === 'string' && val.length > 0) {
    var firstChar = val.charAt(0);
    if (firstChar === '=' || firstChar === '+' || firstChar === '-' || firstChar === '@') {
      return "'" + val;
    }
  }
  return val;
}

// Data Akun Awal (Seed) Terenkripsi Hash
var DEFAULT_ADMIN_USERS_SEED = [
  {
    id: "usr-superadmin",
    name: "Administrator Utama",
    username: "admin",
    passwordHash: "sha256$salt_superadmin_dindik_2026$1086f8086b06c9ac127814883db5c45c7173fc2731ed6b951bbb089d0927e3f7",
    role: "superadmin",
    access: ["*"],
    createdAt: "2026-09-24",
    status: "Aktif"
  },
  {
    id: "usr-admin-spm",
    name: "Admin Satgas Kober & SPM",
    username: "admin_spm",
    passwordHash: "sha256$salt_spm_dindik_2026$fb8ac89142cd3aca67089da4bce0fe4bc75e2b17ebd83ea718c1f487018e40dd",
    role: "operator",
    access: ["spm"],
    createdAt: "2026-09-24",
    status: "Aktif"
  },
  {
    id: "usr-admin-psn",
    name: "Admin PSN & Selamat Asri",
    username: "admin_psn",
    passwordHash: "sha256$salt_psn_dindik_2026$868d05a3707e4beb00f120567caaaf43614d919f347cd39500eb78985a4aaa64",
    role: "operator",
    access: ["psn"],
    createdAt: "2026-09-24",
    status: "Aktif"
  }
];

var FEATURE_NAMES_MAP = {
  "spm": "Standar Pelayanan Minimal (SPM)",
  "lembaga-sekolah": "Lembaga Sekolah & Dapodik",
  "psn": "Program Strategis Nasional (PSN)",
  "psd": "Program Strategis Daerah (PSD)",
  "prestasi": "Prestasi Siswa & Pendidik",
  "kurikulum": "Kurikulum & Muatan Lokal",
  "cabor": "Cabang Olahraga Binaan",
  "spmb": "SPMB & PPDB Terpadu",
  "uld": "Unit Layanan Disabilitas (ULD)",
  "*": "Semua 9 Fitur Layanan (Akses Penuh)"
};

function formatHumanAccess(accessList, role) {
  if (role === 'superadmin' || (Array.isArray(accessList) && accessList.includes('*'))) {
    return 'Semua 9 Fitur Layanan (Akses Penuh)';
  }
  if (!Array.isArray(accessList) || accessList.length === 0) {
    return 'Tidak Ada Akses (Terkunci)';
  }
  return accessList.map(function(id) {
    return FEATURE_NAMES_MAP[id] || id;
  }).join('; ');
}

/**
 * Inisialisasi Sheet Akun Admin & Log
 */
function initAdminAccountsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_USERS);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_USERS, 0);
  }
  sheet.clear();

  var headers = [
    'No',
    'ID Pengguna',
    'Nama Lengkap & Jabatan',
    'Username',
    'Hash Kata Sandi (SHA-256)',
    'Peran (Role)',
    'Kode Akses Fitur (Sistem)',
    'Daftar Fitur yang Diizinkan',
    'Tanggal Dibuat',
    'Status Akun'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground('#1e1b4b')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  var rows = [];
  DEFAULT_ADMIN_USERS_SEED.forEach(function(u, idx) {
    var accessCodeStr = Array.isArray(u.access) ? u.access.join(',') : String(u.access || '*');
    var humanAccessStr = formatHumanAccess(u.access, u.role);
    rows.push([
      idx + 1,
      u.id,
      u.name,
      u.username,
      u.passwordHash,
      u.role === 'superadmin' ? 'Super Admin' : 'Admin Bawahan / Operator',
      accessCodeStr,
      humanAccessStr,
      u.createdAt || new Date().toISOString().split('T')[0],
      u.status || 'Aktif'
    ]);
  });

  if (rows.length > 0) {
    var dataRange = sheet.getRange(2, 1, rows.length, headers.length);
    dataRange.setValues(rows);
    dataRange.setFontSize(9).setVerticalAlignment('middle');
    sheet.getRange(2, 4, rows.length, 2).setFontFamily('Consolas').setFontColor('#334155');
    sheet.getRange(1, 1, rows.length + 1, headers.length)
      .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  }

  sheet.setFrozenRows(1);
  for (var col = 1; col <= headers.length; col++) {
    sheet.autoResizeColumn(col);
  }

  logActivity('SYSTEM', 'SYSTEM', 'INIT_ACCOUNTS_SHEET', 'DATA_AKUN_ADMIN', 'SUCCESS', 'Inisialisasi tabel akun terenkripsi');
  return 'Inisialisasi akun admin dengan password hashing dan proteksi server berhasil!';
}

/**
 * Membaca data internal pengguna (hanya dipanggil oleh fungsi internal server)
 */
function getRawAdminUsersInternal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_USERS);

  if (!sheet) {
    initAdminAccountsSheet();
    sheet = ss.getSheetByName(SHEET_NAME_USERS);
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return DEFAULT_ADMIN_USERS_SEED;
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var usersList = [];

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var id = String(row[1] || '').trim();
    var name = String(row[2] || '').trim();
    var username = String(row[3] || '').trim();
    var storedHash = String(row[4] || '').trim();
    var rawRole = String(row[5] || '').toLowerCase().trim();
    var rawAccess = String(row[6] || '').trim();
    var createdAt = String(row[8] || '').trim();
    var status = String(row[9] || 'Aktif').trim();

    if (!username) continue;

    var role = (rawRole.includes('super') || rawRole === 'superadmin') ? 'superadmin' : 'operator';
    var access = [];
    if (role === 'superadmin' || rawAccess === '*' || rawAccess.includes('*')) {
      access = ['*'];
    } else if (rawAccess) {
      access = rawAccess.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    }

    usersList.push({
      id: id || ('usr-' + (i + 1)),
      name: name || username,
      username: username,
      storedHash: storedHash,
      role: role,
      access: access,
      createdAt: createdAt,
      status: status,
      rowIndex: i + 2
    });
  }

  return usersList;
}

/**
 * Filter data akun untuk konsumsi pengguna yang terotorisasi
 * PENTING: Password/Hash TIDAK PERNAH dikirim ke client!
 */
function getSanitizedUsersList() {
  var users = getRawAdminUsersInternal();
  return users.map(function(u) {
    return {
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      access: u.access,
      createdAt: u.createdAt,
      status: u.status
    };
  });
}

/**
 * ==============================================================================
 * ENDPOINT GET WEB APP
 * ==============================================================================
 * TIDAK MENGEKSPOS DATABASE AKUN KEPADA PUBLIK LAGI.
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';

    // Ping status untuk health-check
    if (action === 'ping') {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        service: 'Portal Dindik Auth Service',
        timestamp: new Date().toISOString(),
        version: '2026.09-secure'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Endpoint getUsers via GET WAJIB token superadmin
    if (action === 'getUsers') {
      var token = e.parameter.token;
      var authResult = verifySignedToken(token);
      if (!authResult.valid) {
        logActivity('ANON', 'GUEST', 'GET_USERS_DENIED', 'DATA_AKUN_ADMIN', 'FORBIDDEN', authResult.message);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'FORBIDDEN',
          message: 'Akses ditolak: Autentikasi sesi diperlukan (' + authResult.message + ')'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      if (authResult.payload.r !== 'superadmin') {
        logActivity(authResult.payload.u, authResult.payload.r, 'GET_USERS_DENIED', 'DATA_AKUN_ADMIN', 'FORBIDDEN', 'Bukan Superadmin');
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'FORBIDDEN',
          message: 'Akses ditolak: Hanya Administrator Utama yang berwenang melihat daftar akun.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var sanitizedUsers = getSanitizedUsersList();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        totalUsers: sanitizedUsers.length,
        data: sanitizedUsers
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Action tidak dikenal atau membutuhkan metode POST.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('INTERNAL_SERVER_ERROR: ' + (err && err.stack ? err.stack : err));
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'Terjadi kesalahan sistem saat memproses permintaan. Silakan hubungi Administrator.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ==============================================================================
 * ENDPOINT POST WEB APP (OTENTIKASI SERVER-SIDE & MUTASI AKUN TEROTORISASI)
 * ==============================================================================
 */
function doPost(e) {
  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var payload = {};

    if (contents) {
      try {
        payload = JSON.parse(contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action;

    // --------------------------------------------------------------------------
    // 1. AKSI: LOGIN SERVER-SIDE
    // --------------------------------------------------------------------------
    if (action === 'login') {
      var username = (payload.username || '').trim();
      var password = (payload.password || '').trim();

      // Validasi Input Server-Side Ketat
      if (!username || !/^[a-zA-Z0-9_\.]{3,40}$/.test(username)) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Format username tidak valid (hanya huruf, angka, titik, atau garis bawah, 3-40 karakter).'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      if (!password || password.length < 3 || password.length > 100) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'INVALID_INPUT',
          message: 'Kata sandi tidak valid (panjang 3-100 karakter).'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      // Rate Limiting Server-Side via CacheService (Tahan banting terhadap clear cache browser)
      var cache = CacheService.getScriptCache();
      var cleanUserKey = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      var rateLimitKey = 'rl_fail_' + cleanUserKey;
      var failedAttempts = parseInt(cache.get(rateLimitKey) || '0', 10);

      // Kunci sementara jika gagal 5x dalam 10 menit
      if (failedAttempts >= 5) {
        logActivity(username, 'GUEST', 'LOGIN_RATE_LIMITED', 'AUTH', 'BLOCKED', 'Percobaan login melebihi batas (5x)');
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'TOO_MANY_REQUESTS',
          message: 'Terlalu banyak percobaan login gagal. Demi keamanan, akun ini dikunci sementara selama 10 menit. Silakan coba kembali nanti.',
          retryAfterSeconds: 600
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var rawUsers = getRawAdminUsersInternal();
      var foundUser = null;
      for (var i = 0; i < rawUsers.length; i++) {
        if (rawUsers[i].username.toLowerCase() === username.toLowerCase()) {
          foundUser = rawUsers[i];
          break;
        }
      }

      if (!foundUser || !verifyPassword(password, foundUser.storedHash)) {
        // Catat kegagalan ke cache server (TTL 600 detik = 10 menit)
        cache.put(rateLimitKey, String(failedAttempts + 1), 600);
        logActivity(username, 'GUEST', 'LOGIN_FAILED', 'AUTH', 'REJECTED', 'Kredensial salah (Percobaan ke-' + (failedAttempts + 1) + ')');

        var remaining = 5 - (failedAttempts + 1);
        var warningMsg = 'Username atau kata sandi tidak sesuai. Silakan periksa kembali.';
        if (remaining > 0 && remaining <= 2) {
          warningMsg += ' Peringatan: Sisa ' + remaining + ' kali percobaan sebelum akun dikunci sementara.';
        }

        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'UNAUTHORIZED',
          message: warningMsg
        })).setMimeType(ContentService.MimeType.JSON);
      }

      // Login Berhasil: Reset counter rate limiting untuk akun ini
      cache.remove(rateLimitKey);

      // Migrasi transisi: jika hash tersimpan belum berupa sha256$, upgrade otomatis di sheet
      if (foundUser.storedHash.indexOf('sha256$') !== 0) {
        try {
          var newSalt = Utilities.getUuid().substring(0, 16);
          var upgradedHash = hashPassword(password, newSalt);
          var ss = SpreadsheetApp.getActiveSpreadsheet();
          var sheet = ss.getSheetByName(SHEET_NAME_USERS);
          if (sheet && foundUser.rowIndex) {
            sheet.getRange(foundUser.rowIndex, 5).setValue(upgradedHash);
          }
        } catch(e) {}
      }

      // Terbitkan signed token sesi 8 jam
      var token = createSignedToken(foundUser);

      logActivity(foundUser.username, foundUser.role, 'LOGIN_SUCCESS', 'AUTH', 'SUCCESS', 'Login berhasil');

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Login berhasil.',
        token: token,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          role: foundUser.role,
          access: foundUser.access,
          createdAt: foundUser.createdAt,
          status: foundUser.status
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // 2. AKSI: VERIFIKASI SESI TOKEN
    // --------------------------------------------------------------------------
    if (action === 'verifySession') {
      var tokenToVerify = payload.token;
      var verifyResult = verifySignedToken(tokenToVerify);
      if (!verifyResult.valid) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          code: 'UNAUTHORIZED',
          message: verifyResult.message
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var p = verifyResult.payload;
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        user: {
          id: p.uid,
          username: p.u,
          role: p.r,
          access: p.a,
          exp: p.exp
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // SEMUA OPERASI DI BAWAH INI WAJIB MEMILIKI TOKEN SESI SUPERADMIN
    // --------------------------------------------------------------------------
    var sessionToken = payload.token;
    var authCheck = verifySignedToken(sessionToken);

    if (!authCheck.valid) {
      logActivity('ANON', 'GUEST', action || 'UNKNOWN_ACTION', 'DATA_AKUN_ADMIN', 'REJECTED', authCheck.message);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'Akses ditolak: Autentikasi sesi diperlukan (' + authCheck.message + ')'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var operatorUser = authCheck.payload;
    if (operatorUser.r !== 'superadmin') {
      logActivity(operatorUser.u, operatorUser.r, action || 'UNKNOWN_ACTION', 'DATA_AKUN_ADMIN', 'FORBIDDEN', 'Hanya superadmin');
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'Akses ditolak: Hanya Administrator Utama yang berwenang melakukan operasi ini.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // 3. AKSI: AMBIL DAFTAR AKUN (TERLINDUNGI)
    // --------------------------------------------------------------------------
    if (action === 'getUsers') {
      var sanitizedUsers = getSanitizedUsersList();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        totalUsers: sanitizedUsers.length,
        data: sanitizedUsers
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // 4. AKSI: SIMPAN / TAMBAH / EDIT AKUN ADMIN
    // --------------------------------------------------------------------------
    if (action === 'saveUser') {
      var userPayload = payload.user || {};
      var targetId = (userPayload.id || '').trim();
      var targetName = sanitizeCellValue((userPayload.name || '').trim());
      var targetUsername = sanitizeCellValue((userPayload.username || '').trim());
      var newPasswordPlain = (userPayload.password || '').trim();
      var targetRole = userPayload.role === 'superadmin' ? 'superadmin' : 'operator';
      var targetAccess = Array.isArray(userPayload.access) ? userPayload.access : ['*'];

      if (!targetName || !targetUsername) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Nama dan Username akun wajib diisi.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(SHEET_NAME_USERS);
      if (!sheet) {
        initAdminAccountsSheet();
        sheet = ss.getSheetByName(SHEET_NAME_USERS);
      }

      var rawUsers = getRawAdminUsersInternal();

      // Cek duplikasi username terhadap akun lain
      var duplicate = rawUsers.find(function(u) {
        return u.username.toLowerCase() === targetUsername.toLowerCase() && u.id !== targetId;
      });
      if (duplicate) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Username "' + targetUsername + '" sudah digunakan oleh akun lain.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var accessCodeStr = targetRole === 'superadmin' ? '*' : targetAccess.join(',');
      var humanAccessStr = formatHumanAccess(targetAccess, targetRole);

      if (targetId) {
        // Mode EDIT AKUN
        var existingUser = rawUsers.find(function(u) { return u.id === targetId; });
        if (!existingUser) {
          return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Akun dengan ID tersebut tidak ditemukan.'
          })).setMimeType(ContentService.MimeType.JSON);
        }

        var finalHash = existingUser.storedHash;
        if (newPasswordPlain.length > 0) {
          var salt = Utilities.getUuid().substring(0, 16);
          finalHash = hashPassword(newPasswordPlain, salt);
        }

        sheet.getRange(existingUser.rowIndex, 3, 1, 6).setValues([[
          targetName,
          targetUsername,
          finalHash,
          targetRole === 'superadmin' ? 'Super Admin' : 'Admin Bawahan / Operator',
          accessCodeStr,
          humanAccessStr
        ]]);

        logActivity(operatorUser.u, operatorUser.r, 'EDIT_USER', targetUsername, 'SUCCESS', 'Perbarui akun ' + targetUsername);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Data akun "' + targetName + '" berhasil diperbarui.'
        })).setMimeType(ContentService.MimeType.JSON);

      } else {
        // Mode TAMBAH AKUN BARU
        if (!newPasswordPlain || newPasswordPlain.length < 4) {
          return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Kata sandi akun baru wajib diisi (minimal 4 karakter).'
          })).setMimeType(ContentService.MimeType.JSON);
        }

        var newId = 'usr-' + Date.now();
        var newSalt = Utilities.getUuid().substring(0, 16);
        var passwordHash = hashPassword(newPasswordPlain, newSalt);
        var nextNo = sheet.getLastRow();

        sheet.appendRow([
          nextNo,
          newId,
          targetName,
          targetUsername,
          passwordHash,
          targetRole === 'superadmin' ? 'Super Admin' : 'Admin Bawahan / Operator',
          accessCodeStr,
          humanAccessStr,
          new Date().toISOString().split('T')[0],
          'Aktif'
        ]);

        logActivity(operatorUser.u, operatorUser.r, 'CREATE_USER', targetUsername, 'SUCCESS', 'Tambah akun baru ' + targetUsername);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Akun admin baru "' + targetName + '" berhasil dibuat dengan enkripsi aman.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // --------------------------------------------------------------------------
    // 5. AKSI: HAPUS AKUN ADMIN
    // --------------------------------------------------------------------------
    if (action === 'deleteUser') {
      var userIdToDelete = (payload.userId || '').trim();
      if (!userIdToDelete) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'ID Pengguna yang akan dihapus wajib disertakan.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var rawUsers = getRawAdminUsersInternal();
      var target = rawUsers.find(function(u) { return u.id === userIdToDelete; });

      if (!target) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Akun tidak ditemukan di database.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      if (target.role === 'superadmin') {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Akun Administrator Utama tidak boleh dihapus demi keamanan sistem.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(SHEET_NAME_USERS);
      if (sheet && target.rowIndex) {
        sheet.deleteRow(target.rowIndex);
        logActivity(operatorUser.u, operatorUser.r, 'DELETE_USER', target.username, 'SUCCESS', 'Hapus akun ' + target.username);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Akun "' + target.name + '" berhasil dihapus.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // --------------------------------------------------------------------------
    // 6. AKSI: INISIALISASI SHEET ULANG (HANYA SUPERADMIN)
    // --------------------------------------------------------------------------
    if (action === 'init') {
      var msg = initAdminAccountsSheet();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: msg
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Aksi (' + action + ') tidak didukung.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('INTERNAL_SERVER_ERROR: ' + (err && err.stack ? err.stack : err));
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'Terjadi kesalahan sistem saat memproses permintaan. Silakan hubungi Administrator.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
