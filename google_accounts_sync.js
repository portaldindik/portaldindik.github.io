/**
 * ==============================================================================
 * MODUL SINKRONISASI AKUN ADMIN & HAK AKSES GOOGLE SPREADSHEET (TERPROTEKSI)
 * ==============================================================================
 * Fitur Keamanan:
 * - Menggunakan otentikasi server-side Google Apps Script.
 * - Password admin tidak disimpan atau dikirim dalam bentuk plaintext di localStorage.
 * - Operasi GET dan MUTASI akun memerlukan signed session token superadmin.
 * - Penolakan otomatis pada sisi server jika peran/token tidak sah.
 */

(function () {
    const STORAGE_KEY_USER_URL = 'portalUserSpreadsheetUrl';
    const STORAGE_KEY_USER_AUTOSYNC = 'portalUserSpreadsheetAutoSync';
    const STORAGE_KEY_USER_LASTSYNC = 'portalUserSpreadsheetLastSync';
    const STORAGE_KEY_AUTH_TOKEN = 'portalAdminAuthToken';

    const DEFAULT_USER_SPREADSHEET_URL = 'https://script.google.com/macros/s/AKfycbyNsaYV8DoaKC2gpp4LuyqGxOMo6-8pUOsAoJjFCiTgfaGkv951R0vEwy-SbdoH41iBug/exec';

    function getUserSpreadsheetUrl() {
        const saved = localStorage.getItem(STORAGE_KEY_USER_URL);
        if (saved && saved.trim().length > 10 && !saved.includes('Sbdo9h8B8')) {
            return saved.trim();
        }
        return DEFAULT_USER_SPREADSHEET_URL;
    }
    window.getUserSpreadsheetUrl = getUserSpreadsheetUrl;

    function getAuthToken() {
        return sessionStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || '';
    }
    window.getAuthToken = getAuthToken;

    function setAuthToken(token) {
        if (token) {
            sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
        } else {
            sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
        }
    }
    window.setAuthToken = setAuthToken;

    // Inisialisasi awal nilai default jika belum ada atau jika mengandung URL lama
    const existingUserUrl = localStorage.getItem(STORAGE_KEY_USER_URL);
    if (!existingUserUrl || existingUserUrl.trim().length < 10 || existingUserUrl.includes('Sbdo9h8B8')) {
        localStorage.setItem(STORAGE_KEY_USER_URL, DEFAULT_USER_SPREADSHEET_URL);
        localStorage.setItem(STORAGE_KEY_USER_AUTOSYNC, 'true');
    }

    /**
     * Memperbarui Tampilan Status Hubungan Spreadsheet Akun di Modal
     */
    window.updateUserSpreadsheetUI = function () {
        const inputUrl = document.getElementById('input-user-spreadsheet-url');
        const pill = document.getElementById('user-spreadsheet-status-pill');
        const lastSyncSpan = document.getElementById('user-spreadsheet-last-sync');
        const chkAuto = document.getElementById('chk-user-spreadsheet-autosync');

        const currentUrl = getUserSpreadsheetUrl();
        const lastSync = localStorage.getItem(STORAGE_KEY_USER_LASTSYNC);
        const autoSync = localStorage.getItem(STORAGE_KEY_USER_AUTOSYNC) !== 'false';

        if (inputUrl && !inputUrl.value) {
            inputUrl.value = currentUrl;
        }

        if (chkAuto) {
            chkAuto.checked = autoSync;
        }

        if (pill) {
            if (currentUrl && currentUrl.startsWith('https://script.google.com/macros/s/')) {
                pill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
                pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Spreadsheet Akun Terhubung';
            } else {
                pill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600';
                pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Spreadsheet Akun Belum Diatur';
            }
        }

        if (lastSyncSpan) {
            if (lastSync) {
                try {
                    const date = new Date(lastSync);
                    const formatted = date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    lastSyncSpan.textContent = 'Terakhir disinkronkan: ' + formatted + ' WIB';
                } catch (e) {
                    lastSyncSpan.textContent = 'Terakhir disinkronkan: ' + lastSync;
                }
            } else {
                lastSyncSpan.textContent = 'Belum pernah disinkronkan';
            }
        }
    };

    /**
     * Menyimpan Pengaturan URL Spreadsheet Akun ke LocalStorage
     */
    window.saveUserSpreadsheetSettings = function () {
        const inputUrl = document.getElementById('input-user-spreadsheet-url');
        const chkAuto = document.getElementById('chk-user-spreadsheet-autosync');

        const url = (inputUrl ? inputUrl.value : '').trim();
        const autoSync = chkAuto ? chkAuto.checked : true;

        localStorage.setItem(STORAGE_KEY_USER_URL, url);
        localStorage.setItem(STORAGE_KEY_USER_AUTOSYNC, autoSync ? 'true' : 'false');

        updateUserSpreadsheetUI();

        const alertBox = document.getElementById('user-spreadsheet-alert');
        if (alertBox) {
            alertBox.classList.remove('hidden');
            setTimeout(() => alertBox.classList.add('hidden'), 3500);
        } else {
            alert('Pengaturan URL Spreadsheet Akun Admin berhasil disimpan!');
        }
    };

    /**
     * Otentikasi Login Server-Side ke Google Apps Script
     */
    window.serverLogin = async function (username, password) {
        const url = getUserSpreadsheetUrl();
        if (!url) {
            throw new Error('URL Web App Google Apps Script belum diatur.');
        }

        const payload = {
            action: 'login',
            username: username,
            password: password
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Respons jaringan: ' + response.status + ' ' + response.statusText);
        }

        return await response.json();
    };

    /**
     * Verifikasi Sesi Token ke Server Google Apps Script
     */
    window.serverVerifySession = async function (token) {
        const url = getUserSpreadsheetUrl();
        if (!url || !token) return { status: 'error', message: 'Token atau URL tidak ada' };

        try {
            const payload = {
                action: 'verifySession',
                token: token
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) return { status: 'error', message: 'Koneksi gagal' };
            return await response.json();
        } catch (e) {
            return { status: 'error', message: e.toString() };
        }
    };

    /**
     * Tarik Data Akun (PULL) dari Google Spreadsheet ke Local Panel
     * WAJIB menggunakan Token Superadmin. Password TIDAK PERNAH dikembalikan oleh server.
     */
    window.pullAdminUsersFromSpreadsheet = async function (isSilent = false) {
        const url = getUserSpreadsheetUrl();
        const token = getAuthToken();

        if (!url) {
            if (!isSilent) alert('URL Web App Spreadsheet Akun belum diisi!');
            return;
        }

        if (!token) {
            if (!isSilent) alert('Akses ditolak: Anda harus login sebagai Administrator Utama terlebih dahulu.');
            return;
        }

        const btnPull = document.getElementById('btn-pull-user-spreadsheet');
        const originalText = btnPull ? btnPull.innerHTML : '';
        if (btnPull) {
            btnPull.disabled = true;
            btnPull.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Menarik Akun...';
        }

        try {
            const payload = {
                action: 'getUsers',
                token: token
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Respons jaringan: ' + response.status + ' ' + response.statusText);
            }

            const result = await response.json();
            if (result && result.status === 'success' && Array.isArray(result.data)) {
                const freshUsers = result.data;

                // Simpan cache profil pengguna terotorisasi (TIDAK ADA PASSWORD DI SINI)
                sessionStorage.setItem('portalAdminUsersCache', JSON.stringify(freshUsers));
                localStorage.setItem(STORAGE_KEY_USER_LASTSYNC, new Date().toISOString());

                updateUserSpreadsheetUI();

                // Render ulang tabel akun di admin.html
                if (typeof renderUserTable === 'function') {
                    renderUserTable(freshUsers);
                }

                if (!isSilent) {
                    alert(`Sukses!\n\nBerhasil memuat ${freshUsers.length} akun admin & hak akses dari server Google Spreadsheet.`);
                }
                return freshUsers;
            } else {
                throw new Error(result.message || 'Gagal mengambil akun dari server.');
            }
        } catch (err) {
            console.error('Error pullAdminUsersFromSpreadsheet:', err);
            if (!isSilent) {
                alert('Gagal Mengambil Akun:\n\n' + err.message);
            }
        } finally {
            if (btnPull) {
                btnPull.disabled = false;
                btnPull.innerHTML = originalText;
            }
        }
    };

    /**
     * Simpan / Tambah / Edit Akun ke Server Google Apps Script
     */
    window.serverSaveAdminUser = async function (userData) {
        const url = getUserSpreadsheetUrl();
        const token = getAuthToken();

        if (!url || !token) {
            throw new Error('Sesi tidak valid atau URL Spreadsheet belum diisi.');
        }

        const payload = {
            action: 'saveUser',
            token: token,
            user: userData
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Respons jaringan: ' + response.status + ' ' + response.statusText);
        }

        const result = await response.json();
        if (result && result.status === 'success') {
            localStorage.setItem(STORAGE_KEY_USER_LASTSYNC, new Date().toISOString());
            updateUserSpreadsheetUI();
            return result;
        } else {
            throw new Error(result.message || 'Gagal menyimpan akun di server.');
        }
    };

    /**
     * Hapus Akun dari Server Google Apps Script
     */
    window.serverDeleteAdminUser = async function (userId) {
        const url = getUserSpreadsheetUrl();
        const token = getAuthToken();

        if (!url || !token) {
            throw new Error('Sesi tidak valid atau URL Spreadsheet belum diisi.');
        }

        const payload = {
            action: 'deleteUser',
            token: token,
            userId: userId
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Respons jaringan: ' + response.status + ' ' + response.statusText);
        }

        const result = await response.json();
        if (result && result.status === 'success') {
            localStorage.setItem(STORAGE_KEY_USER_LASTSYNC, new Date().toISOString());
            updateUserSpreadsheetUI();
            return result;
        } else {
            throw new Error(result.message || 'Gagal menghapus akun di server.');
        }
    };

    /**
     * Salin Kode Script GoogleAppsScript_KelolaAkunAdmin.js ke Clipboard
     */
    window.copyUserGasCode = async function () {
        const btn = document.getElementById('btn-copy-user-gas-code');
        try {
            const res = await fetch('GoogleAppsScript_KelolaAkunAdmin.js');
            const codeText = await res.text();
            if (codeText && codeText.length > 50) {
                await navigator.clipboard.writeText(codeText);
                if (btn) {
                    const oldHtml = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check text-emerald-300"></i> Kode Berhasil Disalin!';
                    btn.className = 'px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5';
                    setTimeout(() => {
                        btn.innerHTML = oldHtml;
                        btn.className = 'px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer';
                    }, 3000);
                } else {
                    alert('Kode Apps Script Kelola Akun berhasil disalin!');
                }
                return;
            }
        } catch(e) {}

        window.downloadUserGasFile();
        alert('File "GoogleAppsScript_KelolaAkunAdmin.js" telah diunduh! Silakan buka file tersebut dan salin kodenya ke Apps Script.');
    };

    /**
     * Unduh File Script Akun Langsung
     */
    window.downloadUserGasFile = function () {
        const a = document.createElement('a');
        a.href = 'GoogleAppsScript_KelolaAkunAdmin.js';
        a.download = 'GoogleAppsScript_KelolaAkunAdmin.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

})();
