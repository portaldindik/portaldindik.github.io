/**
 * ==============================================================================
 * GOOGLE SPREADSHEET SYNC MODULE
 * Portal Dinas Pendidikan & Kebudayaan Kabupaten Madiun
 * ==============================================================================
 * Modul ini menangani:
 * 1. Penyimpanan URL Web App Google Apps Script & opsi Auto-Sync di LocalStorage
 * 2. Tarik Data (Pull) dari Google Spreadsheet ke Portal & Panel Admin
 * 3. Kirim Data (Push) dari Panel Admin ke Google Spreadsheet
 * 4. Dialog Modal Pengaturan & Salin Kode Apps Script Otomatis
 */

(function () {
    const STORAGE_KEY_URL = 'portalSpreadsheetUrl';
    const STORAGE_KEY_AUTOSYNC = 'portalSpreadsheetAutoSync';
    const STORAGE_KEY_LASTSYNC = 'portalSpreadsheetLastSync';
    const DEFAULT_SPREADSHEET_URL = 'https://script.google.com/macros/s/AKfycbyAgzqEnx4VHcDivdmEEY6q_Dt0IwdbOKizh2sJMObQ_KkclxMTgJGZg7eFSfjPZlHf/exec';
    const OLD_SPREADSHEET_URL = 'https://script.google.com/macros/s/AKfycbzDjXz0Qd4T-tv6pvVImARspdguWN_N7cd3yy1Szsc1jvp0ECDvkTWP6h4rUCUAD7Eg/exec';

    let _portalLiveBroadcastChannel = null;
    try {
        if (typeof BroadcastChannel !== 'undefined') {
            _portalLiveBroadcastChannel = new BroadcastChannel('portal_live_sync_channel');
        }
    } catch(e) {}

    window.broadcastPortalDataUpdate = function(type = 'all') {
        const pulse = Date.now().toString();
        try {
            localStorage.setItem('portalSyncPulse', pulse);
        } catch(e) {}
        try {
            if (!_portalLiveBroadcastChannel && typeof BroadcastChannel !== 'undefined') {
                _portalLiveBroadcastChannel = new BroadcastChannel('portal_live_sync_channel');
            }
            if (_portalLiveBroadcastChannel) {
                _portalLiveBroadcastChannel.postMessage({ type: type, timestamp: pulse });
            }
        } catch(e) {}
    };

    /**
     * Mengambil URL Spreadsheet yang aktif (dari LocalStorage atau default)
     */
    function getSpreadsheetUrl() {
        const saved = localStorage.getItem(STORAGE_KEY_URL);
        if (saved && saved.trim().length > 10 && saved.trim() !== OLD_SPREADSHEET_URL) return saved.trim();
        return DEFAULT_SPREADSHEET_URL;
    }

    // Inisialisasi saat DOM siap
    document.addEventListener('DOMContentLoaded', () => {
        // Otomatis pasang URL default jika belum ada atau masih URL lama
        const currentSaved = localStorage.getItem(STORAGE_KEY_URL);
        if (!currentSaved || currentSaved.trim().length < 10 || currentSaved.trim() === OLD_SPREADSHEET_URL) {
            localStorage.setItem(STORAGE_KEY_URL, DEFAULT_SPREADSHEET_URL);
            localStorage.setItem(STORAGE_KEY_AUTOSYNC, 'true');
        }
        updateSpreadsheetUI();
    });

    /**
     * Memeriksa apakah pengguna saat ini adalah Administrator Utama (Super Admin)
     */
    function isSuperAdminUser() {
        if (typeof activeUser !== 'undefined' && activeUser) {
            return activeUser.role === 'superadmin';
        }
        try {
            const s = sessionStorage.getItem('portalActiveAdminSession');
            if (s) {
                const u = JSON.parse(s);
                return u && u.role === 'superadmin';
            }
        } catch(e) {}
        return false;
    }

    /**
     * Memperbarui tampilan indikator status Spreadsheet di UI
     */
    function updateSpreadsheetUI() {
        const url = getSpreadsheetUrl();
        const lastSync = localStorage.getItem(STORAGE_KEY_LASTSYNC);
        const autoSync = localStorage.getItem(STORAGE_KEY_AUTOSYNC) === 'true';

        // Kontrol Visibilitas Tombol Berdasarkan Peran
        const isSuper = isSuperAdminUser();
        const btnHeaderModal = document.getElementById('btn-open-spreadsheet-modal');
        if (btnHeaderModal) {
            if (isSuper) btnHeaderModal.classList.remove('hidden');
            else btnHeaderModal.classList.add('hidden');
        }
        const btnPull = document.getElementById('btn-pull-spreadsheet');
        if (btnPull) {
            if (isSuper) btnPull.classList.remove('hidden');
            else btnPull.classList.add('hidden');
        }
        const btnConfig = document.getElementById('btn-config-spreadsheet');
        if (btnConfig) {
            if (isSuper) btnConfig.classList.remove('hidden');
            else btnConfig.classList.add('hidden');
        }
        // Tombol Kirim ke Sheet selalu tampil dan dapat diklik oleh semua akun (Super Admin & Operator)
        const btnPush = document.getElementById('btn-push-spreadsheet');
        if (btnPush) {
            btnPush.classList.remove('hidden');
        }

        // Update Pill Status di Quick Bar
        const pill = document.getElementById('spreadsheet-conn-pill');
        if (pill) {
            if (url && url.trim().length > 10) {
                pill.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-2xs';
                pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Terhubung ke Google Sheets';
            } else {
                pill.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5';
                pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Belum Terhubung';
            }
        }

        // Update Badge di Tombol Header (Desktop & Mobile)
        const badge = document.getElementById('badge-spreadsheet-status');
        const badgeMob = document.getElementById('badge-spreadsheet-status-mob');
        const statusClass = (url && url.trim().length > 10) ? 'w-2 h-2 rounded-full bg-emerald-300 animate-pulse' : 'w-2 h-2 rounded-full bg-amber-400';
        const statusTitle = (url && url.trim().length > 10) ? 'Terhubung ke Google Spreadsheet' : 'Belum dikonfigurasi';

        if (badge) {
            badge.className = statusClass;
            badge.title = statusTitle;
        }
        if (badgeMob) {
            badgeMob.className = statusClass;
            badgeMob.title = statusTitle;
        }

        // Update Label Waktu Terakhir Sinkron
        const lastSyncLabel = document.getElementById('spreadsheet-last-sync-time');
        if (lastSyncLabel) {
            if (lastSync) {
                try {
                    const dateObj = new Date(lastSync);
                    lastSyncLabel.innerText = 'Sinkron terakhir: ' + dateObj.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch (e) {
                    lastSyncLabel.innerText = 'Sinkron terakhir: ' + lastSync;
                }
            } else {
                lastSyncLabel.innerText = 'Belum pernah disinkronkan';
            }
        }
    }

    /**
     * Buka Modal Pengaturan Spreadsheet (Khusus Administrator Utama)
     */
    window.openSpreadsheetModal = function () {
        if (!isSuperAdminUser()) {
            alert('Akses Ditolak: Hanya Administrator Utama yang berwenang mengakses dan mengatur integrasi Google Spreadsheet.');
            return;
        }

        const modal = document.getElementById('modal-manage-spreadsheet');
        if (!modal) return;

        const inputUrl = document.getElementById('input-spreadsheet-url');
        if (inputUrl) {
            inputUrl.value = getSpreadsheetUrl();
        }

        const chkAutoSync = document.getElementById('chk-spreadsheet-autosync');
        if (chkAutoSync) {
            chkAutoSync.checked = localStorage.getItem(STORAGE_KEY_AUTOSYNC) === 'true';
        }

        updateSpreadsheetUI();
        modal.classList.remove('hidden');
    };

    /**
     * Tutup Modal Pengaturan Spreadsheet
     */
    window.closeSpreadsheetModal = function () {
        const modal = document.getElementById('modal-manage-spreadsheet');
        if (modal) modal.classList.add('hidden');
    };

    /**
     * Simpan Pengaturan URL & Auto-Sync (Khusus Administrator Utama)
     */
    window.saveSpreadsheetSettings = function () {
        if (!isSuperAdminUser()) {
            alert('Akses Ditolak: Hanya Administrator Utama yang berwenang mengubah URL dan pengaturan Google Spreadsheet.');
            return;
        }

        const inputUrl = document.getElementById('input-spreadsheet-url');
        const chkAutoSync = document.getElementById('chk-spreadsheet-autosync');

        const url = (inputUrl ? inputUrl.value : '').trim();
        const autoSync = chkAutoSync ? chkAutoSync.checked : false;

        localStorage.setItem(STORAGE_KEY_URL, url || DEFAULT_SPREADSHEET_URL);
        localStorage.setItem(STORAGE_KEY_AUTOSYNC, autoSync ? 'true' : 'false');

        updateSpreadsheetUI();

        const alertBox = document.getElementById('spreadsheet-save-alert');
        if (alertBox) {
            alertBox.classList.remove('hidden');
            setTimeout(() => alertBox.classList.add('hidden'), 3500);
        } else {
            alert('Pengaturan Google Spreadsheet berhasil disimpan!');
        }
    };

    /**
     * Menyimpan data portal ke LocalStorage secara aman dengan proteksi QuotaExceededError
     * Mencegah browser melempar error "exceeded the quota" jika terdapat gambar Base64 besar.
     */
    function safeSavePortalData(data) {
        if (!data) return false;
        const rawStr = (typeof data === 'string') ? data : JSON.stringify(data);

        // 1. Bersihkan key lama sebelum setItem agar kuota 5MB memiliki ruang bebas maksimal
        try {
            localStorage.removeItem('portalDataCustom');
        } catch(e) {}

        // 2. Coba simpan langsung seluruh data (termasuk gambar Base64 utuh)
        try {
            localStorage.setItem('portalDataCustom', rawStr);
            localStorage.setItem('portalDataCustomSaved', 'true');
            if (typeof window.broadcastPortalDataUpdate === 'function') {
                window.broadcastPortalDataUpdate('data');
            }
            return true;
        } catch (e) {
            console.warn('LocalStorage kuota penuh (QuotaExceededError). Mengaktifkan pembersihan cache & optimasi penyimpanan:', e);
        }

        // 3. Bersihkan key usang/sampah di localStorage
        try {
            const keysToClean = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('temp_') || k.startsWith('cache_') || k === 'portalDataBackup')) {
                    keysToClean.push(k);
                }
            }
            keysToClean.forEach(k => localStorage.removeItem(k));
        } catch(e) {}

        // Coba simpan lagi setelah pembersihan
        try {
            localStorage.setItem('portalDataCustom', rawStr);
            localStorage.setItem('portalDataCustomSaved', 'true');
            if (typeof window.broadcastPortalDataUpdate === 'function') {
                window.broadcastPortalDataUpdate('data');
            }
            return true;
        } catch (e2) {
            console.warn('Gagal menyimpan portalDataCustom ke LocalStorage (kuota penuh):', e2);
        }

        return false;
    }
    window.safeSavePortalData = safeSavePortalData;

    /**
     * Tarik Data (PULL) dari Google Spreadsheet ke Local Portal (Khusus Administrator Utama)
     */
    window.pullFromSpreadsheet = async function (isSilent = false) {
        if (!isSuperAdminUser()) {
            if (!isSilent) {
                alert('Akses Ditolak: Fitur "Tarik Data" dari Google Spreadsheet hanya diizinkan untuk Administrator Utama.');
            }
            return;
        }

        const url = getSpreadsheetUrl();
        if (!url) {
            if (!isSilent) {
                alert('URL Google Apps Script belum diisi!\n\nSilakan klik tombol "Pengaturan & Kode Script" untuk memasukkan URL Web App Google Spreadsheet Anda.');
                window.openSpreadsheetModal();
            }
            return;
        }

        const btnPull = document.getElementById('btn-pull-spreadsheet');
        const originalText = btnPull ? btnPull.innerHTML : '';
        if (btnPull) {
            btnPull.disabled = true;
            btnPull.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Menarik Data...';
        }

        try {
            // Panggil API Google Apps Script (GET)
            const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'action=getData&nocache=' + Date.now();
            const response = await fetch(fetchUrl, {
                method: 'GET',
                redirect: 'follow'
            });

            if (!response.ok) {
                throw new Error('Respons jaringan: ' + response.status + ' ' + response.statusText);
            }

            const result = await response.json();
            if (result && (result.status === 'success' || Array.isArray(result.data))) {
                const freshData = result.data || result;
                if (Array.isArray(freshData) && freshData.length > 0) {
                    // Proteksi E-Kinerja & Presensi Online: Keduanya berdiri sendiri dan jangan ditimpa/dihapus oleh data dari Google Spreadsheet lama
                    const spmRemote = freshData.find(f => f.id === 'spm');
                    if (spmRemote && Array.isArray(spmRemote.bagian)) {
                        const hasEkinerjaRemote = spmRemote.bagian.some(b => b.id === 'ekinerja');
                        if (!hasEkinerjaRemote) {
                            let localEkinerja = null;
                            if (typeof adminData !== 'undefined' && Array.isArray(adminData)) {
                                const spmLocal = adminData.find(f => f.id === 'spm');
                                if (spmLocal && spmLocal.bagian) {
                                    localEkinerja = spmLocal.bagian.find(b => b.id === 'ekinerja');
                                }
                            }
                            if (!localEkinerja) {
                                try {
                                    const saved = JSON.parse(localStorage.getItem('portalDataCustom') || '[]');
                                    const spmSaved = saved.find(f => f.id === 'spm');
                                    if (spmSaved && spmSaved.bagian) {
                                        localEkinerja = spmSaved.bagian.find(b => b.id === 'ekinerja');
                                    }
                                } catch (e) {}
                            }
                            if (!localEkinerja && typeof portalData !== 'undefined') {
                                const spmDef = portalData.find(f => f.id === 'spm');
                                if (spmDef && spmDef.bagian) {
                                    localEkinerja = spmDef.bagian.find(b => b.id === 'ekinerja');
                                }
                            }
                            if (localEkinerja) {
                                spmRemote.bagian.push(localEkinerja);
                            }
                        }

                        const hasPresensiRemote = spmRemote.bagian.some(b => b.id === 'presensi-online');
                        if (!hasPresensiRemote) {
                            let localPresensi = null;
                            if (typeof adminData !== 'undefined' && Array.isArray(adminData)) {
                                const spmLocal = adminData.find(f => f.id === 'spm');
                                if (spmLocal && spmLocal.bagian) {
                                    localPresensi = spmLocal.bagian.find(b => b.id === 'presensi-online');
                                }
                            }
                            if (!localPresensi) {
                                try {
                                    const saved = JSON.parse(localStorage.getItem('portalDataCustom') || '[]');
                                    const spmSaved = saved.find(f => f.id === 'spm');
                                    if (spmSaved && spmSaved.bagian) {
                                        localPresensi = spmSaved.bagian.find(b => b.id === 'presensi-online');
                                    }
                                } catch (e) {}
                            }
                            if (!localPresensi && typeof portalData !== 'undefined') {
                                const spmDef = portalData.find(f => f.id === 'spm');
                                if (spmDef && spmDef.bagian) {
                                    localPresensi = spmDef.bagian.find(b => b.id === 'presensi-online');
                                }
                            }
                            if (localPresensi) {
                                spmRemote.bagian.push(localPresensi);
                            }
                        }

                        // Proteksi 15 Indikator Target Kinerja (SPM): Jangan sampai terhapus saat sinkronisasi Google Spreadsheet
                        const hasIndikatorRemote = spmRemote.bagian.some(b => b.id === 'indikator-spm-15');
                        if (!hasIndikatorRemote) {
                            let localIndikator = null;
                            if (typeof adminData !== 'undefined' && Array.isArray(adminData)) {
                                const spmLocal = adminData.find(f => f.id === 'spm');
                                if (spmLocal && spmLocal.bagian) {
                                    localIndikator = spmLocal.bagian.find(b => b.id === 'indikator-spm-15');
                                }
                            }
                            if (!localIndikator) {
                                try {
                                    const saved = JSON.parse(localStorage.getItem('portalDataCustom') || '[]');
                                    const spmSaved = saved.find(f => f.id === 'spm');
                                    if (spmSaved && spmSaved.bagian) {
                                        localIndikator = spmSaved.bagian.find(b => b.id === 'indikator-spm-15');
                                    }
                                } catch (e) {}
                            }
                            if (!localIndikator && typeof portalData !== 'undefined') {
                                const spmDef = portalData.find(f => f.id === 'spm');
                                if (spmDef && spmDef.bagian) {
                                    localIndikator = spmDef.bagian.find(b => b.id === 'indikator-spm-15');
                                }
                            }
                            if (localIndikator) {
                                const ikuIdx = spmRemote.bagian.findIndex(b => b.id === 'iku');
                                if (ikuIdx !== -1) {
                                    spmRemote.bagian.splice(ikuIdx + 1, 0, localIndikator);
                                } else {
                                    spmRemote.bagian.push(localIndikator);
                                }
                            }
                        }
                    }

                    // Proteksi Ijin Operasional: Ijin Operasional berdiri sendiri dan jangan ditimpa/dihapus oleh data dari Google Spreadsheet lama
                    const lembagaRemote = freshData.find(f => f.id === 'lembaga-sekolah');
                    if (lembagaRemote && Array.isArray(lembagaRemote.bagian)) {
                        const hasIjinRemote = lembagaRemote.bagian.some(b => b.id === 'ijin-operasional');
                        if (!hasIjinRemote) {
                            let localIjin = null;
                            if (typeof adminData !== 'undefined' && Array.isArray(adminData)) {
                                const lembagaLocal = adminData.find(f => f.id === 'lembaga-sekolah');
                                if (lembagaLocal && lembagaLocal.bagian) {
                                    localIjin = lembagaLocal.bagian.find(b => b.id === 'ijin-operasional');
                                }
                            }
                            if (!localIjin) {
                                try {
                                    const saved = JSON.parse(localStorage.getItem('portalDataCustom') || '[]');
                                    const lembagaSaved = saved.find(f => f.id === 'lembaga-sekolah');
                                    if (lembagaSaved && lembagaSaved.bagian) {
                                        localIjin = lembagaSaved.bagian.find(b => b.id === 'ijin-operasional');
                                    }
                                } catch (e) {}
                            }
                            if (!localIjin && typeof portalData !== 'undefined') {
                                const lembagaDef = portalData.find(f => f.id === 'lembaga-sekolah');
                                if (lembagaDef && lembagaDef.bagian) {
                                    localIjin = lembagaDef.bagian.find(b => b.id === 'ijin-operasional');
                                }
                            }
                            if (localIjin) {
                                lembagaRemote.bagian.push(localIjin);
                            }
                        }
                    }

                    // Update adminData di admin.html jika ada
                    if (typeof adminData !== 'undefined') {
                        adminData = freshData;
                    }
                    safeSavePortalData(freshData);
                    const appDataVer = (typeof DATA_VERSION !== 'undefined') ? DATA_VERSION : '2026.10.01.v37';
                    localStorage.setItem('portalDataVersion', appDataVer);
                    localStorage.setItem('portalDataLastSaved', new Date().toISOString());
                    localStorage.setItem(STORAGE_KEY_LASTSYNC, new Date().toISOString());

                    updateSpreadsheetUI();

                    // Render ulang antarmuka admin jika fungsi tersedia
                    if (typeof renderFeatureList === 'function') renderFeatureList();
                    if (typeof loadFeatureToEditor === 'function') loadFeatureToEditor();

                    if (!isSilent) {
                        alert(`✅ Sukses!\n\nBerhasil menarik ${freshData.length} fitur utama dari Google Spreadsheet (Sesuai Histori Pulih: 1 Oktober, 07.21).\nSeluruh isi data admin telah disinkronkan dengan data spreadsheet terkini!`);
                    }
                } else {
                    throw new Error('Format data tidak sesuai (bukan array fitur).');
                }
            } else {
                throw new Error(result.message || 'Gagal memproses data dari Spreadsheet.');
            }
        } catch (err) {
            console.error('Error pullFromSpreadsheet:', err);
            if (!isSilent) {
                alert('Gagal Menarik Data dari Google Spreadsheet:\n\n' + err.message + '\n\nPastikan Deployment Web App di Apps Script disetel akses: "Anyone" (Siapa saja).');
            }
        } finally {
            if (btnPull) {
                btnPull.disabled = false;
                btnPull.innerHTML = originalText;
            }
        }
    };

    /**
     * Kirim Data (PUSH) dari Panel Admin ke Google Spreadsheet
     */
    window.pushToSpreadsheet = async function (isSilent = false) {
        const url = getSpreadsheetUrl();
        if (!url) {
            if (!isSilent) {
                if (isSuperAdminUser()) {
                    alert('URL Google Apps Script belum diatur!\n\nSilakan masukkan URL Web App Google Spreadsheet terlebih dahulu.');
                    window.openSpreadsheetModal();
                } else {
                    alert('URL Google Apps Script belum diatur!\n\nSilakan hubungi Administrator Utama untuk mengatur URL integrasi Google Spreadsheet.');
                }
            }
            return;
        }

        const dataToSend = (typeof adminData !== 'undefined') 
            ? adminData 
            : (typeof currentData !== 'undefined' ? currentData : null);

        if (!dataToSend || !Array.isArray(dataToSend)) {
            if (!isSilent) alert('Data portal belum siap untuk dikirim.');
            return;
        }

        const btnPush = document.getElementById('btn-push-spreadsheet');
        const originalText = btnPush ? btnPush.innerHTML : '';
        if (btnPush) {
            btnPush.disabled = true;
            btnPush.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Mengirim ke Sheet...';
        }

        try {
            const token = (typeof window.getAuthToken === 'function')
                ? window.getAuthToken()
                : (sessionStorage.getItem('portalAdminAuthToken') || '');

            // Pastikan data yang dikirim ke Google Spreadsheet lama HANYA 9 fitur utama biasa
            // E-Kinerja, Presensi Online, 15 Indikator SPM, Ijin Operasional & Berita berdiri sendiri dan tidak dicampurkan ke Spreadsheet lama
            const dataToPush = JSON.parse(JSON.stringify(dataToSend)).map(f => {
                if (f.id === 'spm' && Array.isArray(f.bagian)) {
                    f.bagian = f.bagian.filter(b => b.id !== 'ekinerja' && b.id !== 'presensi-online' && b.id !== 'indikator-spm-15');
                }
                if (f.id === 'lembaga-sekolah' && Array.isArray(f.bagian)) {
                    f.bagian = f.bagian.filter(b => b.id !== 'ijin-operasional');
                }
                return f;
            });

            const payload = {
                action: 'syncFromAdmin',
                token: token,
                data: dataToPush,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Respons HTTP: ' + response.status + ' ' + response.statusText);
            }

            const result = await response.json();
            if (result && result.status === 'success') {
                localStorage.setItem(STORAGE_KEY_LASTSYNC, new Date().toISOString());
                updateSpreadsheetUI();

                if (!isSilent) {
                    alert('✅ Sukses Tersimpan ke Google Spreadsheet!\n\n' + (result.message || 'Seluruh data 9 fitur & tabel berhasil disinkronkan ke Spreadsheet!'));
                }
            } else {
                throw new Error(result.message || 'Gagal menyimpan ke Spreadsheet.');
            }
        } catch (err) {
            console.error('Error pushToSpreadsheet:', err);
            if (!isSilent) {
                alert('Gagal Mengirim Data ke Google Spreadsheet:\n\n' + err.message + '\n\nPeriksa koneksi internet atau pastikan URL Web App valid dan dapat diakses publik.');
            }
        } finally {
            if (btnPush) {
                btnPush.disabled = false;
                btnPush.innerHTML = originalText;
            }
        }
    };

    /**
     * Salin Kode Google Apps Script Lengkap ke Clipboard
     */
    window.copyAppsScriptCode = async function () {
        const btn = document.getElementById('btn-copy-gas-code');
        const codeElement = document.getElementById('gas-code-preview');
        const textToCopy = codeElement ? codeElement.innerText : '';

        if (!textToCopy) {
            alert('Teks kode tidak ditemukan.');
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            if (btn) {
                const oldHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check text-emerald-300"></i> <span class="text-emerald-200">Kode Berhasil Disalin!</span>';
                btn.className = 'px-4 py-2 rounded-xl bg-emerald-700 text-white font-black text-xs transition shadow-md flex items-center gap-2';
                setTimeout(() => {
                    btn.innerHTML = oldHtml;
                    btn.className = 'px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer';
                }, 3000);
            } else {
                alert('Kode Apps Script berhasil disalin ke clipboard!');
            }
        } catch (e) {
            // Fallback execCommand
            const ta = document.createElement('textarea');
            ta.value = textToCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Kode Apps Script berhasil disalin ke clipboard!');
        }
    };

    /**
     * Unduh File Script GoogleAppsScript langsung (Full, Part 1, atau Part 2)
     */
    window.downloadGasFile = function (fileName) {
        const target = fileName || 'GoogleAppsScript_PortalDindik.js';
        const a = document.createElement('a');
        a.href = target;
        a.download = target;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    /**
     * Ganti Tampilan Pratinjau Kode (Full, Part 1, atau Part 2)
     */
    window.switchGasTab = function (type) {
        const fileMap = {
            'full': 'GoogleAppsScript_PortalDindik.js',
            'part1': 'GoogleAppsScript_Part1.js',
            'part2': 'GoogleAppsScript_Part2.js'
        };
        const targetFile = fileMap[type] || 'GoogleAppsScript_PortalDindik.js';
        const codeElement = document.getElementById('gas-code-preview');
        const filenameDisplay = document.getElementById('gas-filename-display');
        
        ['btn-gas-full', 'btn-gas-part1', 'btn-gas-part2'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.className = btn.id === ('btn-gas-' + type)
                    ? 'px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-xs'
                    : 'px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700';
            }
        });

        if (filenameDisplay) filenameDisplay.textContent = targetFile;

        fetch(targetFile)
            .then(res => res.text())
            .then(text => {
                if (codeElement && text) codeElement.innerText = text;
            })
            .catch(() => {});
    };

    // Muat teks pratinjau kode Apps Script ke elemen preview jika ada
    document.addEventListener('DOMContentLoaded', () => {
        const codeElement = document.getElementById('gas-code-preview');
        if (codeElement && (!codeElement.innerText || codeElement.innerText.length < 50)) {
            fetch('GoogleAppsScript_PortalDindik.js')
                .then(res => res.text())
                .then(text => {
                    if (text && text.length > 100) {
                        codeElement.innerText = text;
                    }
                })
                .catch(() => {});
        }
    });

})();
