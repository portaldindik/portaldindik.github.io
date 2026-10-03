/**
 * ==============================================================================
 * GOOGLE SPREADSHEET SYNC: MODUL KHUSUS MANDIRI
 * Dinas Pendidikan dan Kebudayaan Kabupaten Madiun
 * ==============================================================================
 * Menangani sinkronisasi mandiri untuk:
 * 1. E-Kinerja & Capaian (SPM #01)
 * 2. Presensi Online (SPM #01)
 * 3. Ijin Operasional Satuan Pendidikan (Lembaga #02)
 * 4. Laporan RPJMD 2025 - 2029 (Dokumen Perencanaan & Kinerja)
 * 5. Informasi Publik / Berita & Pengumuman
 *
 * HAK AKSES & ATURAN:
 * - Tarik Data (Pull): HANYA BISA DIAKSES OLEH ADMINISTRATOR UTAMA (Super Admin)
 * - Simpan & Kirim Data (Push): Bisa diakses oleh Super Admin dan Sub Admin berwenang
 * - Berdiri sendiri, tidak digabung dengan 2 spreadsheet yang sudah ada
 * ==============================================================================
 */

(function () {
    const STORAGE_KEY_URL = 'portalSpreadsheetModulKhususUrl';
    const STORAGE_KEY_LASTSYNC = 'portalSpreadsheetModulKhususLastSync';
    const STORAGE_KEY_AUTOSYNC = 'portalSpreadsheetModulKhususAutoSync';
    const STORAGE_KEY_DESKRIPSI_BERITA_URL = 'portalDeskripsiBeritaSpreadsheetUrl';
    const STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC = 'portalDeskripsiBeritaAutoSync';
    const STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC = 'portalVisitorCounterAutoSync';
    const DEFAULT_MODUL_KHUSUS_URL = 'https://script.google.com/macros/s/AKfycbyWnklQVuR5l9pb6URlAIA0QRlxJYOYDKhIziwNw-BOd8tUVDvtmfovTrWzxSZc8qNF7Q/exec';
    const DEFAULT_VISITOR_COUNTER_URL = 'https://script.google.com/macros/s/AKfycbxJ3iwL6BWYsAcq6_GcA9Dv2gQ3X8ZCLa5H3mXifzwU3ynRiGPmEEEz644rss8l2GxgPw/exec';
    const DEFAULT_DESKRIPSI_BERITA_URL = 'https://script.google.com/macros/s/AKfycbwTrGu0M52NM0PDLgos5O5TDl3RfpIxe2wMx8BdxhOC-9E1eS5f7RoKP0rjgSCbbzI5/exec';

    function getModulKhususUrl() {
        const saved = localStorage.getItem(STORAGE_KEY_URL);
        if (saved && saved.trim().length > 10) return saved.trim();
        return DEFAULT_MODUL_KHUSUS_URL;
    }

    function getDeskripsiBeritaUrl() {
        const saved = localStorage.getItem(STORAGE_KEY_DESKRIPSI_BERITA_URL);
        if (saved && saved.trim().length > 10) return saved.trim();
        return DEFAULT_DESKRIPSI_BERITA_URL;
    }

    function getVisitorCounterUrl() {
        const saved = localStorage.getItem('portalVisitorCounterSpreadsheetUrl');
        if (saved && saved.trim().length > 10) return saved.trim();
        return DEFAULT_VISITOR_COUNTER_URL;
    }

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

    function updateModulKhususUI() {
        const url = getModulKhususUrl();
        const lastSync = localStorage.getItem(STORAGE_KEY_LASTSYNC);
        const isSuper = isSuperAdminUser();

        // 1. Tombol Tarik Data: HANYA Super Admin
        const pullButtons = document.querySelectorAll('.btn-pull-modul-khusus');
        pullButtons.forEach(btn => {
            if (isSuper) {
                btn.classList.remove('hidden');
                btn.style.display = '';
            } else {
                btn.classList.add('hidden');
                btn.style.display = 'none';
            }
        });

        // 2. Tombol Konfigurasi: HANYA Super Admin
        const configButtons = document.querySelectorAll('.btn-config-modul-khusus');
        configButtons.forEach(btn => {
            if (isSuper) {
                btn.classList.remove('hidden');
                btn.style.display = '';
            } else {
                btn.classList.add('hidden');
                btn.style.display = 'none';
            }
        });

        // 3. Tombol Kirim: Tampil untuk semua admin berwenang
        const pushButtons = document.querySelectorAll('.btn-push-modul-khusus');
        pushButtons.forEach(btn => {
            btn.classList.remove('hidden');
            btn.style.display = '';
        });

        // 4. Status Pill & Badge
        const pill = document.getElementById('modul-khusus-conn-pill');
        if (pill) {
            if (url && url.length > 10) {
                pill.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-2xs';
                pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Spreadsheet Terhubung';
            } else {
                pill.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5';
                pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Belum Terhubung';
            }
        }

        const syncLabel = document.getElementById('modul-khusus-last-sync-time');
        if (syncLabel) {
            if (lastSync) {
                try {
                    const d = new Date(lastSync);
                    syncLabel.innerText = 'Sinkron: ' + d.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch(e) {
                    syncLabel.innerText = 'Sinkron: ' + lastSync;
                }
            } else {
                syncLabel.innerText = 'Belum pernah disinkronkan';
            }
        }
    }

    // ==========================================
    // TARIK DATA DARI SPREADSHEET (KHUSUS SUPER ADMIN)
    // ==========================================
    window.pullFromModulKhususSpreadsheet = async function (isSilent = false) {
        if (!isSuperAdminUser()) {
            alert('Akses Ditolak: Fitur "Tarik Data" dari Google Spreadsheet hanya diizinkan untuk Administrator Utama (Super Admin).\n\nSub Admin / Operator hanya memiliki izin Simpan & Kirim Data.');
            return;
        }

        const url = getModulKhususUrl();
        if (!url || url.length < 10) {
            if (!isSilent) {
                alert('URL Web App Google Spreadsheet Modul Khusus belum dikonfigurasi!\n\nSilakan masukkan URL Web App Apps Script melalui tombol "Pengaturan Spreadsheet Khusus".');
                window.openModulKhususSpreadsheetModal();
            }
            return;
        }

        // Animasi loading pada seluruh tombol pull
        const pullButtons = document.querySelectorAll('.btn-pull-modul-khusus');
        pullButtons.forEach(btn => {
            btn.disabled = true;
            btn.dataset.origHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Menarik...';
        });

        try {
            const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'action=getData&nocache=' + Date.now();
            const res = await fetch(fetchUrl, {
                method: 'GET',
                redirect: 'follow'
            });

            if (!res.ok) {
                throw new Error('Respons server: ' + res.status + ' ' + res.statusText);
            }

            const json = await res.json();
            if (json && json.status === 'success' && json.data) {
                const data = json.data;

                // 1. Perbarui E-Kinerja, Presensi Online & Ijin Operasional di data aktif
                const activeData = (function() {
                    if (typeof window.getAdminData === 'function') {
                        const d = window.getAdminData();
                        if (Array.isArray(d) && d.length > 0) return d;
                    }
                    if (typeof window.adminData !== 'undefined' && Array.isArray(window.adminData) && window.adminData.length > 0) {
                        return window.adminData;
                    }
                    if (typeof adminData !== 'undefined' && Array.isArray(adminData) && adminData.length > 0) {
                        return adminData;
                    }
                    try {
                        const s = localStorage.getItem('portalDataCustom');
                        if (s) {
                            const parsed = JSON.parse(s);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch(e) {}
                    if (typeof portalData !== 'undefined' && Array.isArray(portalData)) {
                        return JSON.parse(JSON.stringify(portalData));
                    }
                    return [];
                })();

                if (Array.isArray(activeData) && activeData.length > 0) {
                    // Update Info Sub Modul (Nama & Deskripsi) jika ditarik dari Spreadsheet
                    if (Array.isArray(data.infoSubModul) && data.infoSubModul.length > 0) {
                        data.infoSubModul.forEach(info => {
                            const id = (info.id || '').toLowerCase().trim();
                            if (!id) return;
                            if (id === 'ekinerja' || id === 'presensi-online' || id === 'indikator-spm-15') {
                                const spmFeature = activeData.find(f => f.id === 'spm');
                                if (spmFeature && Array.isArray(spmFeature.bagian)) {
                                    const sub = spmFeature.bagian.find(b => b.id === id);
                                    if (sub) {
                                        if (info.nama && info.nama.trim()) sub.nama = info.nama.trim();
                                        if (info.deskripsi != null) sub.deskripsi = info.deskripsi;
                                    }
                                }
                            } else if (id === 'ijin-operasional') {
                                const lmbFeature = activeData.find(f => f.id === 'lembaga-sekolah' || f.id === 'lembaga');
                                if (lmbFeature && Array.isArray(lmbFeature.bagian)) {
                                    const sub = lmbFeature.bagian.find(b => b.id === id);
                                    if (sub) {
                                        if (info.nama && info.nama.trim()) sub.nama = info.nama.trim();
                                        if (info.deskripsi != null) sub.deskripsi = info.deskripsi;
                                    }
                                }
                            }
                        });
                    }

                    const spmFeature = activeData.find(f => f.id === 'spm');
                    if (spmFeature && Array.isArray(spmFeature.bagian)) {
                        if (Array.isArray(data.ekinerja) && data.ekinerja.length > 0) {
                            const ekinSub = spmFeature.bagian.find(b => b.id === 'ekinerja');
                            if (ekinSub) ekinSub.baris = data.ekinerja;
                        }
                        if (Array.isArray(data.presensiOnline) && data.presensiOnline.length > 0) {
                            const presSub = spmFeature.bagian.find(b => b.id === 'presensi-online');
                            if (presSub) presSub.baris = data.presensiOnline;
                        }
                        if (Array.isArray(data.indikatorSpm) && data.indikatorSpm.length > 0) {
                            const indSub = spmFeature.bagian.find(b => b.id === 'indikator-spm-15');
                            if (indSub) indSub.baris = data.indikatorSpm;
                        }
                    }

                    const lembagaFeature = activeData.find(f => f.id === 'lembaga-sekolah' || f.id === 'lembaga');
                    if (lembagaFeature && Array.isArray(lembagaFeature.bagian)) {
                        if (Array.isArray(data.ijinOperasional) && data.ijinOperasional.length > 0) {
                            const ijinSub = lembagaFeature.bagian.find(b => b.id === 'ijin-operasional');
                            if (ijinSub) ijinSub.baris = data.ijinOperasional;
                        }
                    }

                    // Sinkronkan ke variabel global dan LocalStorage
                    if (typeof window.setAdminData === 'function') {
                        window.setAdminData(activeData);
                    } else {
                        window.adminData = activeData;
                        if (typeof adminData !== 'undefined') adminData = activeData;
                    }

                    if (typeof window.safeSavePortalData === 'function') {
                        window.safeSavePortalData(activeData);
                    } else {
                        localStorage.setItem('portalDataCustom', JSON.stringify(activeData));
                    }
                    localStorage.setItem('portalDataCustomSaved', 'true');
                    localStorage.setItem('portalDataVersion', '2026.10.03.v1');
                    localStorage.setItem('portalDataLastSaved', new Date().toISOString());
                }

                // 2. Perbarui Laporan RPJMD (16 Dokumen) beserta Judul & Narasi
                let rpjmdJudul = "RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029";
                let rpjmdDeskripsi = "Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.";
                if (Array.isArray(data.infoSubModul)) {
                    const rpjmdInfo = data.infoSubModul.find(i => (i.id || '').toLowerCase().trim() === 'rpjmd');
                    if (rpjmdInfo) {
                        if (rpjmdInfo.nama && rpjmdInfo.nama.trim()) rpjmdJudul = rpjmdInfo.nama.trim();
                        if (rpjmdInfo.deskripsi != null) rpjmdDeskripsi = rpjmdInfo.deskripsi;
                    }
                }
                if (Array.isArray(data.rpjmd) && data.rpjmd.length > 0) {
                    const currentRpjmd = {
                        tahunPeriode: "2025 - 2029",
                        judul: rpjmdJudul,
                        deskripsi: rpjmdDeskripsi,
                        dokumen: data.rpjmd
                    };
                    window.adminRpjmdData = currentRpjmd;
                    window.defaultRpjmdData = currentRpjmd;
                    localStorage.setItem('portalRpjmdData', JSON.stringify(currentRpjmd));
                    if (typeof window.renderRpjmdPage === 'function') {
                        window.renderRpjmdPage();
                    }
                }

                // 3. Perbarui Berita & Pengumuman Resmi
                if (Array.isArray(data.berita) && data.berita.length > 0) {
                    const validNews = data.berita.filter(n => (n.title && n.title.trim().length > 0) || (n.judul && n.judul.trim().length > 0));
                    if (validNews.length > 0) {
                        const normalizedNews = validNews.map((n, idx) => ({
                            id: n.id || ('berita-' + (idx + 1)),
                            judul: n.judul || n.title || '',
                            title: n.title || n.judul || '',
                            kategori: n.kategori || n.category || 'Berita',
                            category: n.category || n.kategori || 'Berita',
                            tanggal: n.tanggal || n.date || '',
                            date: n.date || n.tanggal || '',
                            ringkasan: n.ringkasan || n.summary || n.content || '',
                            summary: n.summary || n.ringkasan || n.content || '',
                            isi: n.isi || n.content || n.summary || '',
                            content: n.content || n.isi || n.summary || '',
                            tautan: n.tautan || n.link || '#',
                            link: n.link || n.tautan || '#',
                            gambar: n.gambar || n.image || '',
                            image: n.image || n.gambar || ''
                        }));
                        localStorage.setItem('portalNewsData', JSON.stringify(normalizedNews));
                        sessionStorage.setItem('portalNewsData', JSON.stringify(normalizedNews));
                        if (typeof window.saveAdminNews === 'function') {
                            window.saveAdminNews(normalizedNews);
                        }
                        if (typeof window.renderPortalNews === 'function') {
                            window.renderPortalNews();
                        }
                    }
                }

                localStorage.setItem(STORAGE_KEY_LASTSYNC, new Date().toISOString());
                updateModulKhususUI();

                // Pancarkan sinyal pembaruan data seketika ke tab website utama
                if (typeof window.broadcastPortalDataUpdate === 'function') {
                    window.broadcastPortalDataUpdate('all');
                }

                // Refresh editor admin jika sedang terbuka
                if (typeof renderFeatureList === 'function') renderFeatureList();
                if (typeof loadFeatureToEditor === 'function') loadFeatureToEditor();
                if (typeof renderNewsTable === 'function') renderNewsTable();
                if (typeof renderStandaloneEkinerjaEditor === 'function' && typeof isEkinerjaStandaloneMode !== 'undefined' && isEkinerjaStandaloneMode) {
                    const spmF = activeData.find(f => f.id === 'spm');
                    if (spmF) renderStandaloneEkinerjaEditor(spmF, true);
                }
                if (typeof renderStandalonePresensiOnlineEditor === 'function' && typeof isPresensiOnlineStandaloneMode !== 'undefined' && isPresensiOnlineStandaloneMode) {
                    const spmF = activeData.find(f => f.id === 'spm');
                    if (spmF) renderStandalonePresensiOnlineEditor(spmF, true);
                }
                if (typeof renderStandaloneIndikatorSpmEditor === 'function' && typeof isIndikatorSpmStandaloneMode !== 'undefined' && isIndikatorSpmStandaloneMode) {
                    const spmF = activeData.find(f => f.id === 'spm');
                    if (spmF) renderStandaloneIndikatorSpmEditor(spmF, true);
                }
                if (typeof renderStandaloneIjinOperasionalEditor === 'function' && typeof isIjinOperasionalStandaloneMode !== 'undefined' && isIjinOperasionalStandaloneMode) {
                    const lmbF = activeData.find(f => f.id === 'lembaga-sekolah' || f.id === 'lembaga');
                    if (lmbF) renderStandaloneIjinOperasionalEditor(lmbF, true);
                }
                if (typeof renderStandaloneRpjmdEditor === 'function' && typeof isRpjmdStandaloneMode !== 'undefined' && isRpjmdStandaloneMode) {
                    renderStandaloneRpjmdEditor(true);
                }

                if (!isSilent) {
                    alert('✅ Sukses Tarik Data!\n\nSeluruh data E-Kinerja, Presensi Online, 15 Indikator Target Kinerja, Ijin Operasional, Laporan RPJMD, dan Berita berhasil diperbarui dari Google Spreadsheet khusus.');
                }
            } else {
                throw new Error(json.message || 'Format data Google Spreadsheet tidak valid.');
            }
        } catch (err) {
            console.error('Error pullFromModulKhususSpreadsheet:', err);
            if (!isSilent) {
                alert('Gagal Menarik Data:\n\n' + err.message + '\n\nPastikan Deployment Web App Apps Script disetel akses: "Anyone" (Siapa saja).');
            }
        } finally {
            pullButtons.forEach(btn => {
                btn.disabled = false;
                if (btn.dataset.origHtml) btn.innerHTML = btn.dataset.origHtml;
            });
        }
    };

    // ==========================================
    // KIRIM DATA KE SPREADSHEET (METODE TIMPA TERBARU)
    // ==========================================
    window.pushToModulKhususSpreadsheet = async function (targetModule = 'all', isSilent = false) {
        const url = getModulKhususUrl();
        const deskripsiBeritaUrl = getDeskripsiBeritaUrl();

        if ((!url || url.length < 10) && (!deskripsiBeritaUrl || deskripsiBeritaUrl.length < 10)) {
            if (!isSilent) {
                alert('URL Web App Google Spreadsheet Modul Khusus belum dikonfigurasi!\n\nSilakan masukkan URL Web App Apps Script melalui tombol "Pengaturan Spreadsheet Khusus".');
                window.openModulKhususSpreadsheetModal();
            }
            return false;
        }

        // Kumpulkan data mutakhir
        const payload = {};

        const activeData = (function() {
            if (typeof window.getAdminData === 'function') {
                const d = window.getAdminData();
                if (Array.isArray(d) && d.length > 0) return d;
            }
            if (typeof window.adminData !== 'undefined' && Array.isArray(window.adminData) && window.adminData.length > 0) {
                return window.adminData;
            }
            if (typeof adminData !== 'undefined' && Array.isArray(adminData) && adminData.length > 0) {
                return adminData;
            }
            try {
                const s = localStorage.getItem('portalDataCustom');
                if (s) {
                    const parsed = JSON.parse(s);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
            } catch(e) {}
            if (typeof portalData !== 'undefined' && Array.isArray(portalData)) {
                return JSON.parse(JSON.stringify(portalData));
            }
            return [];
        })();

        const infoSubModulList = [];

        // 1. E-Kinerja & Presensi
        if (Array.isArray(activeData) && activeData.length > 0) {
            const spmFeature = activeData.find(f => f.id === 'spm');
            if (spmFeature && Array.isArray(spmFeature.bagian)) {
                const ekinSub = spmFeature.bagian.find(b => b.id === 'ekinerja');
                if (ekinSub) {
                    // Prioritaskan nilai langsung dari elemen input DOM jika sedang diedit di layar
                    const domName = document.getElementById('input-sub-name-ekinerja') || document.querySelector('#sub-module-card-ekinerja input[type="text"]');
                    const domDesc = document.getElementById('input-sub-desc-ekinerja') || document.querySelector('#sub-module-card-ekinerja textarea');
                    if (domName && domName.value && domName.value.trim()) ekinSub.nama = domName.value.trim();
                    if (domDesc && domDesc.value != null) ekinSub.deskripsi = domDesc.value;

                    if (Array.isArray(ekinSub.baris)) payload.ekinerja = ekinSub.baris;
                    infoSubModulList.push({
                        id: 'ekinerja',
                        kategori: 'SPM (Standar Pelayanan Minimal)',
                        nama: ekinSub.nama || 'E-Kinerja',
                        deskripsi: ekinSub.deskripsi || ''
                    });
                }
                const presSub = spmFeature.bagian.find(b => b.id === 'presensi-online');
                if (presSub) {
                    // Prioritaskan nilai langsung dari elemen input DOM jika sedang diedit di layar
                    const domName = document.getElementById('input-sub-name-presensi-online') || document.querySelector('#sub-module-card-presensi-online input[type="text"]');
                    const domDesc = document.getElementById('input-sub-desc-presensi-online') || document.querySelector('#sub-module-card-presensi-online textarea');
                    if (domName && domName.value && domName.value.trim()) presSub.nama = domName.value.trim();
                    if (domDesc && domDesc.value != null) presSub.deskripsi = domDesc.value;

                    if (Array.isArray(presSub.baris)) payload.presensiOnline = presSub.baris;
                    infoSubModulList.push({
                        id: 'presensi-online',
                        kategori: 'SPM (Standar Pelayanan Minimal)',
                        nama: presSub.nama || 'Presensi Online',
                        deskripsi: presSub.deskripsi || ''
                    });
                }
                const indSub = spmFeature.bagian.find(b => b.id === 'indikator-spm-15');
                if (indSub) {
                    // Prioritaskan nilai langsung dari elemen input DOM jika sedang diedit di layar
                    const domName = document.getElementById('input-sub-name-indikator-spm-15') || document.querySelector('#sub-module-card-indikator-spm input[type="text"]');
                    const domDesc = document.getElementById('input-sub-desc-indikator-spm-15') || document.querySelector('#sub-module-card-indikator-spm textarea');
                    if (domName && domName.value && domName.value.trim()) indSub.nama = domName.value.trim();
                    if (domDesc && domDesc.value != null) indSub.deskripsi = domDesc.value;

                    if (Array.isArray(indSub.baris)) payload.indikatorSpm = indSub.baris;
                    infoSubModulList.push({
                        id: 'indikator-spm-15',
                        kategori: 'SPM (Standar Pelayanan Minimal)',
                        nama: indSub.nama || '15 Indikator Target Kinerja',
                        deskripsi: indSub.deskripsi || ''
                    });
                }
            }

            // 2. Ijin Operasional
            const lembagaFeature = activeData.find(f => f.id === 'lembaga-sekolah' || f.id === 'lembaga');
            if (lembagaFeature && Array.isArray(lembagaFeature.bagian)) {
                const ijinSub = lembagaFeature.bagian.find(b => b.id === 'ijin-operasional');
                if (ijinSub) {
                    // Prioritaskan nilai langsung dari elemen input DOM jika sedang diedit di layar
                    const domName = document.getElementById('input-sub-name-ijin-operasional') || document.querySelector('#sub-module-card-ijin-operasional input[type="text"]');
                    const domDesc = document.getElementById('input-sub-desc-ijin-operasional') || document.querySelector('#sub-module-card-ijin-operasional textarea');
                    if (domName && domName.value && domName.value.trim()) ijinSub.nama = domName.value.trim();
                    if (domDesc && domDesc.value != null) ijinSub.deskripsi = domDesc.value;

                    if (Array.isArray(ijinSub.baris)) payload.ijinOperasional = ijinSub.baris;
                    infoSubModulList.push({
                        id: 'ijin-operasional',
                        kategori: 'Lembaga Sekolah',
                        nama: ijinSub.nama || 'Ijin Operasional',
                        deskripsi: ijinSub.deskripsi || ''
                    });
                }
            }
        }

        // 3. RPJMD
        try {
            const rpjmdRaw = localStorage.getItem('portalRpjmdData');
            let rpjmdObj = null;
            if (rpjmdRaw) {
                const parsed = JSON.parse(rpjmdRaw);
                if (parsed) rpjmdObj = parsed;
            } else if (typeof window.defaultRpjmdData !== 'undefined') {
                rpjmdObj = window.defaultRpjmdData;
            }
            if (rpjmdObj) {
                const domJudul = document.getElementById('input-rpjmd-standalone-judul');
                const domDesc = document.getElementById('input-rpjmd-standalone-deskripsi');
                if (domJudul && domJudul.value && domJudul.value.trim()) rpjmdObj.judul = domJudul.value.trim();
                if (domDesc && domDesc.value != null) rpjmdObj.deskripsi = domDesc.value;

                if (Array.isArray(rpjmdObj.dokumen)) payload.rpjmd = rpjmdObj.dokumen;
                infoSubModulList.push({
                    id: 'rpjmd',
                    kategori: 'Laporan RPJMD 2025 - 2029',
                    nama: rpjmdObj.judul || 'RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029',
                    deskripsi: rpjmdObj.deskripsi || 'Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.'
                });
            }
        } catch(e) {}

        payload.infoSubModul = infoSubModulList;

        // 4. Berita & Pengumuman
        try {
            const newsRaw = localStorage.getItem('portalNewsData');
            let newsList = null;
            if (newsRaw) {
                const parsedNews = JSON.parse(newsRaw);
                if (Array.isArray(parsedNews)) newsList = parsedNews;
            } else if (typeof window.defaultNewsData !== 'undefined' && Array.isArray(window.defaultNewsData)) {
                newsList = window.defaultNewsData;
            }
            if (Array.isArray(newsList) && newsList.length > 0) {
                payload.berita = newsList.map((n, idx) => {
                    const id = (n.id != null && n.id !== '') ? n.id : ('berita-' + (idx + 1));
                    const judul = n.judul || n.title || '';
                    const kategori = n.kategori || n.category || 'Berita';
                    const tanggal = n.tanggal || n.date || '';
                    const ringkasan = n.ringkasan || n.summary || n.content || n.isi || '';
                    const link = n.link || n.tautan || '#';
                    const gambar = n.gambar || n.image || '';
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
        } catch(e) {}

        // Animasi tombol push
        const pushButtons = document.querySelectorAll('.btn-push-modul-khusus');
        pushButtons.forEach(btn => {
            btn.disabled = true;
            btn.dataset.origHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Mengirim...';
        });

        try {
            // 1a. Jika URL Standalone Deskripsi & Berita disetel dan autosync aktif, kirimkan juga ke sana
            const isDeskripsiBeritaAutoSync = !isSilent || (localStorage.getItem(STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC) !== 'false');
            if (isDeskripsiBeritaAutoSync && deskripsiBeritaUrl && deskripsiBeritaUrl.startsWith('https://script.google.com/macros/s/')) {
                const miniPayload = {
                    infoSubModul: payload.infoSubModul || [],
                    indikatorSpm: payload.indikatorSpm || [],
                    berita: payload.berita || []
                };
                fetch(deskripsiBeritaUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(miniPayload),
                    redirect: 'follow'
                }).catch(e => console.warn('Standalone Deskripsi & Berita push error:', e));
            }

            // 1b. Jika URL Visitor Counter disetel dan autoSync aktif, sinkronkan status terbaru
            const isVisitorAutoSync = !isSilent || (localStorage.getItem(STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC) !== 'false');
            const visitorUrl = getVisitorCounterUrl();
            if (isVisitorAutoSync && visitorUrl && visitorUrl.startsWith('https://script.google.com/macros/s/')) {
                fetch(`${visitorUrl}?action=status&t=${Date.now()}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    redirect: 'follow',
                    cache: 'no-store'
                }).catch(e => console.warn('Visitor counter sync warning:', e));
            }

            // 2. Jika URL Utama (6 Sheet) tidak disetel atau kosong, cukup tandai sukses
            if (!url || url.length < 10) {
                localStorage.setItem(STORAGE_KEY_LASTSYNC, new Date().toISOString());
                updateModulKhususUI();
                if (!isSilent) {
                    if (typeof showFloatingToast === 'function') {
                        showFloatingToast('Data berhasil dikirim ke Spreadsheet Khusus Deskripsi & Berita!', 'success');
                    } else {
                        alert('✅ Sukses!\n\nData berhasil dikirim ke Spreadsheet Khusus Deskripsi & Berita.');
                    }
                }
                return true;
            }

            // 3. Kirim ke Spreadsheet Utama (6 Sheet Lengkap)
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload),
                redirect: 'follow'
            });

            if (!res.ok) {
                throw new Error('Respons server: ' + res.status + ' ' + res.statusText);
            }

            const json = await res.json();
            if (json && json.status === 'success') {
                localStorage.setItem(STORAGE_KEY_LASTSYNC, new Date().toISOString());
                updateModulKhususUI();

                if (!isSilent) {
                    if (typeof showFloatingToast === 'function') {
                        showFloatingToast('Data berhasil dikirim dan ditimpa ke Google Spreadsheet khusus!', 'success');
                    } else {
                        alert('✅ Sukses!\n\nData berhasil disimpan dan ditimpa dengan data terbaru pada Google Spreadsheet khusus.');
                    }
                }
                return true;
            } else {
                throw new Error(json.message || 'Gagal menyimpan ke Google Spreadsheet.');
            }
        } catch (err) {
            console.error('Error pushToModulKhususSpreadsheet:', err);
            if (!isSilent) {
                alert('Gagal Mengirim Data ke Google Spreadsheet:\n\n' + err.message + '\n\nPastikan URL Web App benar dan Deployment disetel akses: "Anyone".');
            }
            return false;
        } finally {
            pushButtons.forEach(btn => {
                btn.disabled = false;
                if (btn.dataset.origHtml) btn.innerHTML = btn.dataset.origHtml;
            });
        }
    };

    // ==========================================
    // MODAL PENGATURAN & SALIN KODE APPS SCRIPT
    // ==========================================
    window.openModulKhususSpreadsheetModal = function () {
        if (!isSuperAdminUser()) {
            alert('Akses Ditolak: Hanya Administrator Utama (Super Admin) yang berwenang mengatur URL integrasi Google Spreadsheet khusus ini.');
            return;
        }

        const modal = document.getElementById('modal-manage-modul-khusus-spreadsheet');
        if (!modal) return;

        const inputUrl = document.getElementById('input-modul-khusus-spreadsheet-url');
        if (inputUrl) {
            inputUrl.value = getModulKhususUrl();
        }

        const chkAutoSync = document.getElementById('chk-modul-khusus-autosync');
        if (chkAutoSync) {
            chkAutoSync.checked = localStorage.getItem(STORAGE_KEY_AUTOSYNC) !== 'false';
            if (!chkAutoSync.dataset.bound) {
                chkAutoSync.dataset.bound = 'true';
                chkAutoSync.addEventListener('change', function() {
                    localStorage.setItem(STORAGE_KEY_AUTOSYNC, this.checked ? 'true' : 'false');
                });
            }
        }

        const chkDeskripsiAutoSync = document.getElementById('chk-deskripsi-berita-autosync');
        if (chkDeskripsiAutoSync) {
            chkDeskripsiAutoSync.checked = localStorage.getItem(STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC) !== 'false';
            if (!chkDeskripsiAutoSync.dataset.bound) {
                chkDeskripsiAutoSync.dataset.bound = 'true';
                chkDeskripsiAutoSync.addEventListener('change', function() {
                    localStorage.setItem(STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC, this.checked ? 'true' : 'false');
                });
            }
        }

        const inputDeskripsiBeritaUrl = document.getElementById('input-deskripsi-berita-spreadsheet-url');
        if (inputDeskripsiBeritaUrl) {
            inputDeskripsiBeritaUrl.value = getDeskripsiBeritaUrl();
        }

        const chkVisitorAutoSync = document.getElementById('chk-visitor-counter-autosync');
        if (chkVisitorAutoSync) {
            chkVisitorAutoSync.checked = localStorage.getItem(STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC) !== 'false';
            if (!chkVisitorAutoSync.dataset.bound) {
                chkVisitorAutoSync.dataset.bound = 'true';
                chkVisitorAutoSync.addEventListener('change', function() {
                    localStorage.setItem(STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC, this.checked ? 'true' : 'false');
                });
            }
        }

        const inputVisitorUrl = document.getElementById('input-visitor-counter-spreadsheet-url');
        if (inputVisitorUrl) {
            inputVisitorUrl.value = localStorage.getItem('portalVisitorCounterSpreadsheetUrl') || '';
        }

        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    };

    window.closeModulKhususSpreadsheetModal = function () {
        const modal = document.getElementById('modal-manage-modul-khusus-spreadsheet');
        if (modal) modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };

    window.saveVisitorCounterConfig = function () {
        const inputUrl = document.getElementById('input-visitor-counter-spreadsheet-url');
        const chkAutoSync = document.getElementById('chk-visitor-counter-autosync');

        if (inputUrl) {
            const val = inputUrl.value.trim();
            if (val && !val.startsWith('https://script.google.com/macros/s/')) {
                alert('Format URL tidak valid!\n\nURL Web App Google Apps Script harus diawali dengan:\nhttps://script.google.com/macros/s/...');
                return;
            }
            localStorage.setItem('portalVisitorCounterSpreadsheetUrl', val);
        }

        if (chkAutoSync) {
            localStorage.setItem(STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC, chkAutoSync.checked ? 'true' : 'false');
        }

        if (typeof showFloatingToast === 'function') {
            showFloatingToast('Pengaturan URL & Auto-Sync Visitor Counter berhasil disimpan.', 'success');
        } else {
            alert('Pengaturan URL & Auto-Sync Visitor Counter berhasil disimpan!');
        }
    };

    window.testVisitorCounterConnection = async function () {
        const inputUrl = document.getElementById('input-visitor-counter-spreadsheet-url');
        const url = (inputUrl ? inputUrl.value.trim() : '') || localStorage.getItem('portalVisitorCounterSpreadsheetUrl') || '';
        if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
            alert('Masukkan URL Web App Visitor Counter yang valid terlebih dahulu.');
            return;
        }

        const btn = document.getElementById('btn-test-visitor-counter-conn');
        const origText = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Menguji...';
        }

        try {
            const res = await fetch(`${url}?action=status&t=${Date.now()}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                redirect: 'follow',
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Status respons: ' + res.status);
            const json = await res.json();
            if (json && json.status === 'success') {
                alert(`✅ Koneksi Berhasil!\n\nData Visitor Counter dari Spreadsheet:\n- Hari Ini: ${json.today}\n- Bulan Ini: ${json.month}\n- Tahun Ini: ${json.year}`);
            } else {
                throw new Error(json.message || 'Respon tidak valid');
            }
        } catch (err) {
            alert('❌ Gagal Terhubung:\n\n' + err.message + '\n\nPastikan Deployment Web App di Apps Script disetel izin:\n"Who has access: Anyone" (Siapa saja).');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origText;
            }
        }
    };

    window.copyVisitorCounterGasCode = function () {
        fetch('google_apps_script_visitor_counter.gs')
            .then(res => res.text())
            .then(text => {
                navigator.clipboard.writeText(text).then(() => {
                    if (typeof showFloatingToast === 'function') {
                        showFloatingToast('Kode Google Apps Script Visitor Counter berhasil disalin!', 'success');
                    } else {
                        alert('Kode Google Apps Script Visitor Counter berhasil disalin!');
                    }
                });
            })
            .catch(() => {
                alert('Silakan buka file google_apps_script_visitor_counter.gs untuk menyalin kode.');
            });
    };

    window.saveModulKhususSpreadsheetConfig = function () {
        if (!isSuperAdminUser()) return;

        const inputUrl = document.getElementById('input-modul-khusus-spreadsheet-url');
        const chkAutoSync = document.getElementById('chk-modul-khusus-autosync');

        if (inputUrl) {
            const val = inputUrl.value.trim();
            if (val && !val.startsWith('https://script.google.com/macros/s/')) {
                alert('Format URL tidak valid!\n\nURL Web App Google Apps Script harus diawali dengan:\nhttps://script.google.com/macros/s/...');
                return;
            }
            localStorage.setItem(STORAGE_KEY_URL, val);
        }

        if (chkAutoSync) {
            localStorage.setItem(STORAGE_KEY_AUTOSYNC, chkAutoSync.checked ? 'true' : 'false');
        }

        updateModulKhususUI();
        window.closeModulKhususSpreadsheetModal();

        if (typeof showFloatingToast === 'function') {
            showFloatingToast('Pengaturan URL & Auto-Sync Spreadsheet Khusus berhasil disimpan.', 'success');
        } else {
            alert('Pengaturan URL & Auto-Sync Spreadsheet Modul Khusus berhasil disimpan!');
        }
    };

    window.saveDeskripsiBeritaConfig = function () {
        if (!isSuperAdminUser()) return;
        const inputUrl = document.getElementById('input-deskripsi-berita-spreadsheet-url');
        const chkAutoSync = document.getElementById('chk-deskripsi-berita-autosync');

        if (inputUrl) {
            const val = inputUrl.value.trim();
            if (val && !val.startsWith('https://script.google.com/macros/s/')) {
                alert('Format URL tidak valid!\n\nURL Web App Google Apps Script harus diawali dengan:\nhttps://script.google.com/macros/s/...');
                return;
            }
            localStorage.setItem(STORAGE_KEY_DESKRIPSI_BERITA_URL, val);
        }

        if (chkAutoSync) {
            localStorage.setItem(STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC, chkAutoSync.checked ? 'true' : 'false');
        }

        if (typeof showFloatingToast === 'function') {
            showFloatingToast('Pengaturan URL & Auto-Sync Khusus Deskripsi & Berita berhasil disimpan.', 'success');
        } else {
            alert('Pengaturan URL & Auto-Sync Khusus Deskripsi & Berita berhasil disimpan!');
        }
    };

    window.testDeskripsiBeritaConnection = async function () {
        const inputUrl = document.getElementById('input-deskripsi-berita-spreadsheet-url');
        const url = (inputUrl ? inputUrl.value.trim() : '') || getDeskripsiBeritaUrl();

        if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
            alert('Masukkan URL Web App Khusus Deskripsi & Berita yang valid terlebih dahulu.');
            return;
        }

        const btn = document.getElementById('btn-test-deskripsi-berita-conn');
        const origText = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Menguji...';
        }

        try {
            const testUrl = url + (url.includes('?') ? '&' : '?') + 'action=getData&nocache=' + Date.now();
            const res = await fetch(testUrl, { method: 'GET', redirect: 'follow' });
            if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + res.statusText);
            const json = await res.json();
            if (json && json.status === 'success') {
                alert('✅ Koneksi Berhasil!\n\nGoogle Spreadsheet Khusus Deskripsi & Berita terhubung dengan sempurna.');
            } else {
                alert('⚠️ Terhubung dengan catatan:\n\n' + (json.message || 'Respons server tidak sesuai.'));
            }
        } catch (err) {
            alert('❌ Gagal Terhubung:\n\n' + err.message + '\n\nPastikan Web App sudah di-Deploy dengan izin akses "Anyone" (Siapa saja).');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origText;
            }
        }
    };

    window.copyDeskripsiBeritaGasCode = function () {
        fetch('google_apps_script_deskripsi_dan_berita.gs')
            .then(res => res.text())
            .then(text => {
                navigator.clipboard.writeText(text).then(() => {
                    if (typeof showFloatingToast === 'function') {
                        showFloatingToast('Kode Google Apps Script Khusus Deskripsi & Berita berhasil disalin!', 'success');
                    } else {
                        alert('Kode Google Apps Script Khusus Deskripsi & Berita berhasil disalin!');
                    }
                });
            })
            .catch(() => {
                alert('Silakan buka file google_apps_script_deskripsi_dan_berita.gs untuk menyalin kode.');
            });
    };

    window.testModulKhususSpreadsheetConnection = async function () {
        const inputUrl = document.getElementById('input-modul-khusus-spreadsheet-url');
        const url = inputUrl ? inputUrl.value.trim() : getModulKhususUrl();

        if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
            alert('Masukkan URL Web App Google Apps Script yang valid terlebih dahulu.');
            return;
        }

        const btn = document.getElementById('btn-test-modul-khusus-conn');
        const origText = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Menguji...';
        }

        try {
            const testUrl = url + (url.includes('?') ? '&' : '?') + 'action=getData&nocache=' + Date.now();
            const res = await fetch(testUrl, { method: 'GET', redirect: 'follow' });
            if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + res.statusText);
            const json = await res.json();
            if (json && json.status === 'success') {
                alert('✅ Koneksi Berhasil!\n\nGoogle Spreadsheet terhubung dengan sempurna dan siap digunakan untuk Tarik & Kirim Data.');
            } else {
                alert('⚠️ Terhubung dengan catatan:\n\n' + (json.message || 'Respons server tidak sesuai.'));
            }
        } catch (err) {
            alert('❌ Gagal Terhubung:\n\n' + err.message + '\n\nPastikan Web App sudah di-Deploy dengan "Who has access: Anyone".');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origText;
            }
        }
    };

    let currentGasModulTab = '6sheet';
    let gasCode6Sheet = "";
    let gasCodeDeskripsiBerita = "";

    window.switchGasModulTab = function(tab) {
        currentGasModulTab = tab;
        const btn6Sheet = document.getElementById('btn-tab-gas-6sheet');
        const btnDeskripsiBerita = document.getElementById('btn-tab-gas-deskripsiberita');
        const filenameDisplay = document.getElementById('modul-khusus-filename-display');
        const codeElement = document.getElementById('modul-khusus-script-code-text');
        const step3Text = document.getElementById('modul-khusus-step-3-text');

        if (tab === 'deskripsiberita') {
            if (btn6Sheet) {
                btn6Sheet.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition';
            }
            if (btnDeskripsiBerita) {
                btnDeskripsiBerita.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-xs cursor-pointer transition';
            }
            if (filenameDisplay) {
                filenameDisplay.innerText = 'google_apps_script_deskripsi_dan_berita.gs';
                filenameDisplay.className = 'text-purple-400 font-mono';
            }
            if (step3Text) {
                step3Text.innerHTML = 'Pilih fungsi <strong>initSheetDeskripsiDanBerita</strong> lalu klik <strong>Jalankan</strong>. 3 Sheet (Deskripsi Sub Modul, 15 Indikator SPM, & Berita) otomatis dibuat!';
            }
            if (codeElement) {
                if (gasCodeDeskripsiBerita) {
                    codeElement.innerText = gasCodeDeskripsiBerita;
                } else {
                    codeElement.innerText = 'Memuat kode google_apps_script_deskripsi_dan_berita.gs...';
                    fetch('google_apps_script_deskripsi_dan_berita.gs')
                        .then(res => res.text())
                        .then(text => {
                            gasCodeDeskripsiBerita = text;
                            if (currentGasModulTab === 'deskripsiberita') {
                                codeElement.innerText = text;
                            }
                        })
                        .catch(() => {
                            codeElement.innerText = 'Silakan buka file google_apps_script_deskripsi_dan_berita.gs untuk menyalin kode.';
                        });
                }
            }
        } else {
            if (btn6Sheet) {
                btn6Sheet.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 text-white shadow-xs cursor-pointer transition';
            }
            if (btnDeskripsiBerita) {
                btnDeskripsiBerita.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition';
            }
            if (filenameDisplay) {
                filenameDisplay.innerText = 'google_apps_script_modul_khusus.gs';
                filenameDisplay.className = 'text-cyan-400 font-mono';
            }
            if (step3Text) {
                step3Text.innerHTML = 'Pilih fungsi <strong>initModulKhususSheets</strong> lalu klik <strong>Jalankan</strong>. Seluruh 7 lembar sheet &amp; kolom dibuat seketika!';
            }
            if (codeElement) {
                codeElement.innerText = gasCode6Sheet || EMBEDDED_MODUL_KHUSUS_GAS_CODE;
            }
        }
    };

    window.copyModulKhususScriptCode = function () {
        const codeElement = document.getElementById('modul-khusus-script-code-text');
        if (!codeElement) return;

        const code = codeElement.innerText;
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('btn-copy-modul-khusus-code');
            if (btn) {
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check text-cyan-300 mr-1.5"></i> Kode Berhasil Disalin!';
                btn.classList.add('bg-cyan-700');
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.classList.remove('bg-cyan-700');
                }, 2500);
            }
            const scriptName = currentGasModulTab === 'deskripsiberita' ? 'Khusus Deskripsi, 15 Indikator & Berita (3 Sheet)' : 'Modul Mandiri (7 Sheet)';
            if (typeof showFloatingToast === 'function') {
                showFloatingToast(`Kode Apps Script ${scriptName} berhasil disalin ke clipboard!`, 'success');
            } else {
                alert(`Kode Apps Script ${scriptName} berhasil disalin ke clipboard!`);
            }
        }).catch(err => {
            alert('Gagal menyalin otomatis, silakan pilih teks kode dan salin manual.');
        });
    };

    window.downloadGasModulKhususFile = function () {
        const codeElement = document.getElementById('modul-khusus-script-code-text');
        const textToSave = codeElement ? codeElement.innerText : '';
        if (!textToSave) {
            alert('Teks kode belum termuat.');
            return;
        }

        const fileName = currentGasModulTab === 'deskripsiberita' ? 'google_apps_script_deskripsi_dan_berita.gs' : 'google_apps_script_modul_khusus.gs';
        const blob = new Blob([textToSave], { type: 'text/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (typeof showFloatingToast === 'function') {
            showFloatingToast(`File ${fileName} berhasil diunduh!`, 'success');
        }
    };

    const EMBEDDED_MODUL_KHUSUS_GAS_CODE = "/**\n * ==============================================================================\n * GOOGLE APPS SCRIPT: SPREADSHEET KHUSUS MODUL MANDIRI\n * Dinas Pendidikan dan Kebudayaan Kabupaten Madiun\n * ==============================================================================\n * Modul yang terhubung:\n * 1. Deskripsi Sub Modul (Nama Sub Modul & Deskripsi Lengkap Sub Bagian)\n *    - E-Kinerja (SPM #01)\n *    - Presensi Online Pegawai & Tendik (SPM #01)\n *    - Ijin Operasional Satuan Pendidikan (Lembaga #02)\n *    - Laporan RPJMD 2025 - 2029\n * 2. E-Kinerja & Capaian (SPM #01) -> Target & Triwulan 1 s/d 4\n * 3. Presensi Online Pegawai & Tendik (SPM #01) -> NIP & Persentase Kehadiran\n * 4. Ijin Operasional Satuan Pendidikan (Lembaga #02) -> Status Perizinan Satuan Pendidikan\n * 5. Laporan RPJMD 2025 - 2029 (Dokumen Perencanaan & Laporan Kinerja)\n * 6. Informasi Publik / Berita & Pengumuman Resmi\n *\n * FITUR UTAMA:\n * - Otomatis membuat lembar (sheet) dan header kolom jika belum tersedia\n * - Sheet \"Deskripsi_Sub_Modul\" khusus mendata Nama Sub Modul & Deskripsi Lengkap Sub Bagian\n * - Kompatibel penuh dan sinkron timbal-balik (mendukung sheet Deskripsi_Sub_Modul maupun Info_Sub_Modul)\n * - Menggunakan metode TIMPA DATA TERBARU (Overwrite) agar data selalu bersih & akurat\n * - Berdiri sendiri, tidak bercampur dengan spreadsheet portal 9 program utama maupun akun admin\n * ==============================================================================\n */\n\n// Konfigurasi Nama Sheet & Kolom Header Otomatis\nvar SHEET_CONFIGS = {\n  DESKRIPSI_SUB_MODUL: {\n    sheetName: \"Deskripsi_Sub_Modul\",\n    headerBg: \"#4C1D95\", // Dark Purple\n    headers: [\"No\", \"ID Sub Modul\", \"Kategori Modul\", \"Nama Sub Modul\", \"Deskripsi Lengkap Sub Bagian\", \"Waktu Pembaruan\"]\n  },\n  INFO_SUB_MODUL: {\n    sheetName: \"Info_Sub_Modul\",\n    headerBg: \"#4C1D95\", // Dark Purple\n    headers: [\"No\", \"ID Sub Modul\", \"Kategori Modul\", \"Nama Sub Modul\", \"Deskripsi Lengkap Sub Bagian\", \"Waktu Pembaruan\"]\n  },\n  EKINERJA: {\n    sheetName: \"E_Kinerja\",\n    headerBg: \"#065F46\", // Dark Emerald\n    headers: [\"No\", \"Nama Target Kinerja\", \"Target Kinerja\", \"Triwulan 1\", \"Triwulan 2\", \"Triwulan 3\", \"Triwulan 4\", \"Waktu Pembaruan\"]\n  },\n  PRESENSI: {\n    sheetName: \"Presensi_Online\",\n    headerBg: \"#0F766E\", // Dark Teal\n    headers: [\"No\", \"NIP\", \"Nama Pegawai / Guru\", \"Persentase Kehadiran\", \"Waktu Pembaruan\"]\n  },\n  IJIN_OPERASIONAL: {\n    sheetName: \"Ijin_Operasional\",\n    headerBg: \"#3730A3\", // Dark Indigo\n    headers: [\"No\", \"Status Sekolah\", \"Unit Kerja / Satuan Pendidikan\", \"Status Ijin Operasional\", \"Waktu Pembaruan\"]\n  },\n  RPJMD: {\n    sheetName: \"Laporan_RPJMD\",\n    headerBg: \"#0E7490\", // Dark Cyan\n    headers: [\"ID Dokumen\", \"Kategori\", \"Nomor Urut\", \"Singkatan Dokumen\", \"Judul Lengkap Dokumen\", \"Periode Tahun\", \"Ukuran File\", \"URL File PDF\", \"Penjelasan Naratif\", \"Waktu Pembaruan\"]\n  },\n  BERITA: {\n    sheetName: \"Berita_Pengumuman\",\n    headerBg: \"#1E293B\", // Dark Slate\n    headers: [\"ID Berita\", \"Judul Berita\", \"Kategori\", \"Tanggal Publikasi\", \"Ringkasan Isi\", \"Tautan Rujukan\", \"URL Foto Thumbnail\", \"Waktu Pembaruan\"]\n  }\n};\n\n/**\n * Fungsi inisialisasi awal sekali klik untuk membuat seluruh sheet dan header kolom secara instan\n */\nfunction initModulKhususSheets() {\n  var ss = SpreadsheetApp.getActiveSpreadsheet();\n  for (var key in SHEET_CONFIGS) {\n    if (key !== \"INFO_SUB_MODUL\") {\n      ensureSheetWithHeader(ss, SHEET_CONFIGS[key]);\n    }\n  }\n\n  // Otomatis isi baris bawaan Deskripsi Sub Modul jika sheet masih kosong\n  var deskripsiSheet = ss.getSheetByName(SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.sheetName);\n  if (deskripsiSheet && deskripsiSheet.getLastRow() <= 1) {\n    var nowStr = Utilities.formatDate(new Date(), \"GMT+7\", \"yyyy-MM-dd HH:mm:ss\");\n    var defaultInfo = [\n      [\"1\", \"ekinerja\", \"SPM (Standar Pelayanan Minimal)\", \"E-Kinerja\", \"Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.\", nowStr],\n      [\"2\", \"presensi-online\", \"SPM (Standar Pelayanan Minimal)\", \"Presensi Online\", \"Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.\", nowStr],\n      [\"3\", \"ijin-operasional\", \"Lembaga Sekolah (Lembaga #02)\", \"Ijin Operasional\", \"Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun.\", nowStr],\n      [\"4\", \"rpjmd\", \"Laporan RPJMD 2025 - 2029\", \"RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029\", \"Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.\", nowStr]\n    ];\n    deskripsiSheet.getRange(2, 1, defaultInfo.length, defaultInfo[0].length).setValues(defaultInfo);\n    for (var c = 1; c <= SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.headers.length; c++) {\n      deskripsiSheet.autoResizeColumn(c);\n    }\n  }\n\n  try {\n    SpreadsheetApp.getUi().alert(\"Inisialisasi Berhasil!\\n\\nSheet Modul Mandiri (Deskripsi_Sub_Modul, E_Kinerja, Presensi_Online, Ijin_Operasional, Laporan_RPJMD, Berita_Pengumuman) beserta kolom header telah selesai dibuat.\");\n  } catch(e) {\n    Logger.log(\"Inisialisasi Sheet selesai dibuat.\");\n  }\n}\n\n/**\n * Memastikan sheet dan kolom header tersedia secara otomatis\n */\nfunction ensureSheetWithHeader(ss, config) {\n  var sheet = ss.getSheetByName(config.sheetName);\n  if (!sheet) {\n    sheet = ss.insertSheet(config.sheetName);\n  }\n  \n  // Periksa apakah baris header sudah ada\n  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {\n    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);\n    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);\n    headerRange.setFontWeight(\"bold\");\n    headerRange.setBackground(config.headerBg);\n    headerRange.setFontColor(\"#FFFFFF\");\n    headerRange.setHorizontalAlignment(\"center\");\n    sheet.setFrozenRows(1);\n    \n    // Auto-resize kolom agar rapi\n    for (var c = 1; c <= config.headers.length; c++) {\n      sheet.autoResizeColumn(c);\n    }\n  }\n  return sheet;\n}\n\n/**\n * Endpoint GET: Digunakan untuk Tarik Data dari Spreadsheet\n */\nfunction doGet(e) {\n  try {\n    var ss = SpreadsheetApp.getActiveSpreadsheet();\n    var params = e ? e.parameter : {};\n    var action = params.action || \"getData\";\n\n    // Pastikan sheet utama dan header sudah siap otomatis\n    for (var key in SHEET_CONFIGS) {\n      if (key !== \"INFO_SUB_MODUL\") {\n        ensureSheetWithHeader(ss, SHEET_CONFIGS[key]);\n      }\n    }\n\n    if (action === \"getData\" || action === \"getAll\") {\n      var result = {\n        status: \"success\",\n        timestamp: new Date().toISOString(),\n        data: {\n          infoSubModul: getInfoSubModulData(ss),\n          ekinerja: getEkinerjaData(ss),\n          presensiOnline: getPresensiData(ss),\n          ijinOperasional: getIjinData(ss),\n          rpjmd: getRpjmdData(ss),\n          berita: getBeritaData(ss)\n        }\n      };\n      return createJsonResponse(result);\n    }\n\n    return createJsonResponse({ status: \"error\", message: \"Aksi tidak dikenal: \" + action });\n  } catch (err) {\n    return createJsonResponse({ status: \"error\", message: err.toString() });\n  }\n}\n\n/**\n * Endpoint POST: Digunakan untuk Kirim Data (Metode Timpa yang Terbaru)\n */\nfunction doPost(e) {\n  try {\n    var ss = SpreadsheetApp.getActiveSpreadsheet();\n    var postData = \"\";\n\n    if (e && e.postData && e.postData.contents) {\n      postData = e.postData.contents;\n    } else if (e && e.parameter && e.parameter.data) {\n      postData = e.parameter.data;\n    }\n\n    if (!postData) {\n      return createJsonResponse({ status: \"error\", message: \"Payload data kosong.\" });\n    }\n\n    var payload = JSON.parse(postData);\n    var nowStr = Utilities.formatDate(new Date(), \"GMT+7\", \"yyyy-MM-dd HH:mm:ss\");\n\n    // Pastikan seluruh sheet siap\n    for (var key in SHEET_CONFIGS) {\n      if (key !== \"INFO_SUB_MODUL\") {\n        ensureSheetWithHeader(ss, SHEET_CONFIGS[key]);\n      }\n    }\n\n    var updatedModules = [];\n\n    // 0. Simpan Deskripsi Sub Modul (Nama Sub Modul & Deskripsi Lengkap Sub Bagian)\n    if (payload.infoSubModul && Array.isArray(payload.infoSubModul)) {\n      saveInfoSubModulData(ss, payload.infoSubModul, nowStr);\n      updatedModules.push(\"Deskripsi Sub Modul (Nama & Deskripsi)\");\n    }\n\n    // 1. Simpan E-Kinerja (Jika ada dalam payload)\n    if (payload.ekinerja && Array.isArray(payload.ekinerja)) {\n      saveEkinerjaData(ss, payload.ekinerja, nowStr);\n      updatedModules.push(\"E-Kinerja\");\n    }\n\n    // 2. Simpan Presensi Online (Jika ada dalam payload)\n    if (payload.presensiOnline && Array.isArray(payload.presensiOnline)) {\n      savePresensiData(ss, payload.presensiOnline, nowStr);\n      updatedModules.push(\"Presensi Online\");\n    }\n\n    // 3. Simpan Ijin Operasional (Jika ada dalam payload)\n    if (payload.ijinOperasional && Array.isArray(payload.ijinOperasional)) {\n      saveIjinData(ss, payload.ijinOperasional, nowStr);\n      updatedModules.push(\"Ijin Operasional\");\n    }\n\n    // 4. Simpan Laporan RPJMD (Jika ada dalam payload)\n    if (payload.rpjmd && (Array.isArray(payload.rpjmd) || (payload.rpjmd.dokumen && Array.isArray(payload.rpjmd.dokumen)))) {\n      var rpjmdList = Array.isArray(payload.rpjmd) ? payload.rpjmd : payload.rpjmd.dokumen;\n      saveRpjmdData(ss, rpjmdList, nowStr);\n      updatedModules.push(\"Laporan RPJMD\");\n    }\n\n    // 5. Simpan Berita & Pengumuman (Jika ada dalam payload)\n    if (payload.berita && Array.isArray(payload.berita)) {\n      saveBeritaData(ss, payload.berita, nowStr);\n      updatedModules.push(\"Berita & Pengumuman\");\n    }\n\n    return createJsonResponse({\n      status: \"success\",\n      message: \"Data berhasil disimpan dan ditimpa dengan data terbaru pada Google Spreadsheet.\",\n      timestamp: nowStr,\n      updatedModules: updatedModules\n    });\n\n  } catch (err) {\n    return createJsonResponse({ status: \"error\", message: err.toString() });\n  }\n}\n\n// ==========================================\n// FUNGSI BACA DATA (GETTERS)\n// ==========================================\n\nfunction getInfoSubModulData(ss) {\n  var sheet = ss.getSheetByName(\"Deskripsi_Sub_Modul\") || ss.getSheetByName(\"Info_Sub_Modul\") || ensureSheetWithHeader(ss, SHEET_CONFIGS.DESKRIPSI_SUB_MODUL);\n  var lastRow = sheet.getLastRow();\n  if (lastRow < 2) return [];\n\n  var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();\n  return values.map(function(row) {\n    return {\n      no: row[0] != null ? row[0].toString() : \"\",\n      id: row[1] != null ? row[1].toString().trim().toLowerCase() : \"\",\n      kategori: row[2] != null ? row[2].toString() : \"\",\n      nama: row[3] != null ? row[3].toString() : \"\",\n      deskripsi: row[4] != null ? row[4].toString() : \"\",\n      waktuUpdate: row[5] != null ? row[5].toString() : \"\"\n    };\n  });\n}\n\nfunction getEkinerjaData(ss) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.EKINERJA);\n  var lastRow = sheet.getLastRow();\n  if (lastRow < 2) return [];\n  \n  var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();\n  return values.map(function(row) {\n    return [\n      row[0] != null ? row[0].toString() : \"\",\n      row[1] != null ? row[1].toString() : \"\",\n      row[2] != null ? row[2].toString() : \"\",\n      row[3] != null ? row[3].toString() : \"\",\n      row[4] != null ? row[4].toString() : \"\",\n      row[5] != null ? row[5].toString() : \"\",\n      row[6] != null ? row[6].toString() : \"\"\n    ];\n  });\n}\n\nfunction getPresensiData(ss) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.PRESENSI);\n  var lastRow = sheet.getLastRow();\n  if (lastRow < 2) return [];\n  \n  var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();\n  return values.map(function(row) {\n    return [\n      row[0] != null ? row[0].toString() : \"\",\n      row[1] != null ? row[1].toString() : \"\",\n      row[2] != null ? row[2].toString() : \"\",\n      row[3] != null ? row[3].toString() : \"\"\n    ];\n  });\n}\n\nfunction getIjinData(ss) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.IJIN_OPERASIONAL);\n  var lastRow = sheet.getLastRow();\n  if (lastRow < 2) return [];\n  \n  var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();\n  return values.map(function(row) {\n    return [\n      row[0] != null ? row[0].toString() : \"\",\n      row[1] != null ? row[1].toString() : \"\",\n      row[2] != null ? row[2].toString() : \"\",\n      row[3] != null ? row[3].toString() : \"\"\n    ];\n  });\n}\n\nfunction getRpjmdData(ss) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.RPJMD);\n  var lastRow = sheet.getLastRow();\n  if (lastRow < 2) return [];\n  \n  var values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();\n  return values.map(function(row) {\n    return {\n      id: row[0] != null ? row[0].toString() : \"\",\n      kategori: row[1] != null ? row[1].toString() : \"perencanaan\",\n      kategoriNama: (row[1] && row[1].toString().toLowerCase() === \"kinerja\") ? \"Laporan Kinerja\" : \"Dokumen Perencanaan\",\n      nomor: parseInt(row[2]) || 1,\n      nama: row[3] != null ? row[3].toString() : \"\",\n      judulLengkap: row[4] != null ? row[4].toString() : \"\",\n      tahun: row[5] != null ? row[5].toString() : \"2025 - 2029\",\n      ukuranFile: row[6] != null ? row[6].toString() : \"PDF\",\n      fileUrl: row[7] != null ? row[7].toString() : \"#\",\n      penjelasan: row[8] != null ? row[8].toString() : \"\",\n      tanggalUpdate: row[9] != null ? row[9].toString() : \"\"\n    };\n  });\n}\n\nfunction getBeritaData(ss) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.BERITA);\n  var lastRow = sheet.getLastRow();\n  if (lastRow < 2) return [];\n  \n  var values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();\n  return values.map(function(row, idx) {\n    var id = row[0] != null && row[0].toString() !== \"\" ? row[0].toString() : (\"berita-\" + (idx + 1));\n    var judul = row[1] != null ? row[1].toString() : \"\";\n    var kategori = row[2] != null && row[2].toString() !== \"\" ? row[2].toString() : \"Berita\";\n    var tanggal = row[3] != null ? row[3].toString() : \"\";\n    var ringkasan = row[4] != null ? row[4].toString() : \"\";\n    var link = row[5] != null && row[5].toString() !== \"\" ? row[5].toString() : \"#\";\n    var gambar = row[6] != null ? row[6].toString() : \"\";\n\n    return {\n      id: id,\n      judul: judul,\n      title: judul,\n      kategori: kategori,\n      category: kategori,\n      tanggal: tanggal,\n      date: tanggal,\n      ringkasan: ringkasan,\n      summary: ringkasan,\n      isi: ringkasan,\n      content: ringkasan,\n      link: link,\n      tautan: link,\n      gambar: gambar,\n      image: gambar\n    };\n  });\n}\n\n// ==========================================\n// FUNGSI SIMPAN & TIMPA DATA (SETTERS / OVERWRITE)\n// ==========================================\n\nfunction saveInfoSubModulData(ss, infoList, nowStr) {\n  if (!infoList || !Array.isArray(infoList) || infoList.length === 0) return;\n\n  var targetSheets = [\n    ensureSheetWithHeader(ss, SHEET_CONFIGS.DESKRIPSI_SUB_MODUL)\n  ];\n  var legacySheet = ss.getSheetByName(\"Info_Sub_Modul\");\n  if (legacySheet && legacySheet.getName() !== SHEET_CONFIGS.DESKRIPSI_SUB_MODUL.sheetName) {\n    targetSheets.push(legacySheet);\n  }\n\n  // Baca data yang sudah ada di sheet utama\n  var primarySheet = targetSheets[0];\n  var existingMap = {};\n  var lastRow = primarySheet.getLastRow();\n  if (lastRow >= 2) {\n    var oldValues = primarySheet.getRange(2, 1, lastRow - 1, 6).getValues();\n    oldValues.forEach(function(row) {\n      var id = row[1] != null ? row[1].toString().trim().toLowerCase() : \"\";\n      if (id) {\n        existingMap[id] = {\n          id: id,\n          kategori: row[2] != null ? row[2].toString() : \"\",\n          nama: row[3] != null ? row[3].toString() : \"\",\n          deskripsi: row[4] != null ? row[4].toString() : \"\",\n          waktuUpdate: row[5] != null ? row[5].toString() : \"\"\n        };\n      }\n    });\n  }\n\n  // Timpa dan perbarui dengan infoList terbaru yang dikirim dari panel admin\n  infoList.forEach(function(item) {\n    var id = (item.id != null) ? item.id.toString().trim().toLowerCase() : \"\";\n    if (!id) return;\n    existingMap[id] = {\n      id: id,\n      kategori: item.kategori || (existingMap[id] ? existingMap[id].kategori : \"\"),\n      nama: (item.nama != null && item.nama.toString().trim() !== \"\") ? item.nama.toString().trim() : (existingMap[id] ? existingMap[id].nama : \"\"),\n      deskripsi: (item.deskripsi != null) ? item.deskripsi.toString() : (existingMap[id] ? existingMap[id].deskripsi : \"\"),\n      waktuUpdate: nowStr\n    };\n  });\n\n  // 4 Modul Standar yang selalu dipertahankan urutannya\n  var standardOrder = [\n    { id: \"ekinerja\", kategori: \"SPM (Standar Pelayanan Minimal)\", defaultNama: \"E-Kinerja\", defaultDesc: \"Rincian dan pemantauan target kinerja serta evaluasi capaian per triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.\" },\n    { id: \"presensi-online\", kategori: \"SPM (Standar Pelayanan Minimal)\", defaultNama: \"Presensi Online\", defaultDesc: \"Rekapitulasi dan pemantauan tingkat kehadiran serta persentase absensi aparatur / pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Madiun.\" },\n    { id: \"ijin-operasional\", kategori: \"Lembaga Sekolah (Lembaga #02)\", defaultNama: \"Ijin Operasional\", defaultDesc: \"Data verifikasi dan pemantauan status perizinan operasional satuan pendidikan formal dan non-formal di Kabupaten Madiun.\" },\n    { id: \"rpjmd\", kategori: \"Laporan RPJMD 2025 - 2029\", defaultNama: \"RPJMD ( Rencana Pembangunan Jangka Menengah Daerah ) Tahun 2025 - 2029\", defaultDesc: \"Total 16 Dokumen Terpadu: 8 Dokumen Perencanaan & 8 Laporan Kinerja Daerah.\" }\n  ];\n\n  var finalRows = [];\n  standardOrder.forEach(function(std, idx) {\n    var cur = existingMap[std.id] || {};\n    var namaVal = (cur.nama != null && cur.nama !== \"\") ? cur.nama : std.defaultNama;\n    var safeDesc = (cur.deskripsi != null && cur.deskripsi !== \"\") ? cur.deskripsi : std.defaultDesc;\n    if (safeDesc.length > 45000) safeDesc = safeDesc.substring(0, 45000);\n\n    finalRows.push([\n      (idx + 1).toString(),\n      std.id,\n      cur.kategori || std.kategori,\n      namaVal,\n      safeDesc,\n      cur.waktuUpdate || nowStr\n    ]);\n  });\n\n  // Bersihkan dan timpa bersih baris data pada seluruh target sheets\n  targetSheets.forEach(function(targetSheet) {\n    clearDataRows(targetSheet);\n    targetSheet.getRange(2, 1, finalRows.length, finalRows[0].length).setValues(finalRows);\n    for (var c = 1; c <= 6; c++) {\n      targetSheet.autoResizeColumn(c);\n    }\n  });\n}\n\nfunction saveEkinerjaData(ss, rows, nowStr) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.EKINERJA);\n  clearDataRows(sheet);\n  if (!rows || rows.length === 0) return;\n\n  var output = rows.map(function(r) {\n    return [\n      r[0] || \"\",\n      r[1] || \"\",\n      r[2] || \"\",\n      r[3] || \"\",\n      r[4] || \"\",\n      r[5] || \"\",\n      r[6] || \"\",\n      nowStr\n    ];\n  });\n  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);\n}\n\nfunction savePresensiData(ss, rows, nowStr) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.PRESENSI);\n  clearDataRows(sheet);\n  if (!rows || rows.length === 0) return;\n\n  var output = rows.map(function(r) {\n    return [\n      r[0] || \"\",\n      r[1] || \"\",\n      r[2] || \"\",\n      r[3] || \"\",\n      nowStr\n    ];\n  });\n  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);\n}\n\nfunction saveIjinData(ss, rows, nowStr) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.IJIN_OPERASIONAL);\n  clearDataRows(sheet);\n  if (!rows || rows.length === 0) return;\n\n  var output = rows.map(function(r) {\n    return [\n      r[0] || \"\",\n      r[1] || \"\",\n      r[2] || \"\",\n      r[3] || \"\",\n      nowStr\n    ];\n  });\n  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);\n}\n\nfunction saveRpjmdData(ss, docs, nowStr) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.RPJMD);\n  clearDataRows(sheet);\n  if (!docs || docs.length === 0) return;\n\n  var output = docs.map(function(d, idx) {\n    return [\n      d.id || (\"rpjmd-dok-\" + (idx + 1)),\n      d.kategori || \"perencanaan\",\n      d.nomor != null ? d.nomor : (idx + 1),\n      d.nama || \"\",\n      d.judulLengkap || d.nama || \"\",\n      d.tahun || \"2025 - 2029\",\n      d.ukuranFile || \"PDF\",\n      d.fileUrl || \"#\",\n      d.penjelasan || \"\",\n      nowStr\n    ];\n  });\n  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);\n}\n\nfunction saveBeritaData(ss, newsList, nowStr) {\n  var sheet = ensureSheetWithHeader(ss, SHEET_CONFIGS.BERITA);\n  clearDataRows(sheet);\n  if (!newsList || newsList.length === 0) return;\n\n  var output = newsList.map(function(n, idx) {\n    var id = (n.id != null && n.id !== \"\") ? n.id.toString() : (\"berita-\" + (idx + 1));\n    var judul = (n.judul != null && n.judul !== \"\") ? n.judul : (n.title != null ? n.title : \"\");\n    var kategori = (n.kategori != null && n.kategori !== \"\") ? n.kategori : (n.category != null ? n.category : \"Berita\");\n    var tanggal = (n.tanggal != null && n.tanggal !== \"\") ? n.tanggal : (n.date != null ? n.date : \"\");\n    var ringkasan = (n.ringkasan != null && n.ringkasan !== \"\") ? n.ringkasan : (n.summary != null ? n.summary : (n.content != null ? n.content : (n.isi != null ? n.isi : \"\")));\n    var link = (n.link != null && n.link !== \"\") ? n.link : (n.tautan != null ? n.tautan : \"#\");\n    var gambar = (n.gambar != null && n.gambar !== \"\") ? n.gambar : (n.image != null ? n.image : \"\");\n\n    // Proteksi batas panjang string per sel Google Sheet (maksimal 50.000 karakter)\n    var safeGambar = gambar ? gambar.toString() : \"\";\n    if (safeGambar.length > 45000) {\n      safeGambar = safeGambar.substring(0, 45000);\n    }\n    var safeRingkasan = ringkasan ? ringkasan.toString() : \"\";\n    if (safeRingkasan.length > 45000) {\n      safeRingkasan = safeRingkasan.substring(0, 45000);\n    }\n\n    return [\n      id,\n      judul ? judul.toString() : \"\",\n      kategori ? kategori.toString() : \"Berita\",\n      tanggal ? tanggal.toString() : \"\",\n      safeRingkasan,\n      link ? link.toString() : \"#\",\n      safeGambar,\n      nowStr\n    ];\n  });\n  sheet.getRange(2, 1, output.length, output[0].length).setValues(output);\n}\n\n/**\n * Hapus seluruh baris data lama (mulai dari baris ke-2) agar ditimpa bersih\n */\nfunction clearDataRows(sheet) {\n  var lastRow = sheet.getLastRow();\n  var lastCol = sheet.getLastColumn();\n  if (lastRow >= 2 && lastCol >= 1) {\n    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();\n  }\n}\n\n/**\n * Helper JSON Response dengan Header CORS Lengkap\n */\nfunction createJsonResponse(data) {\n  return ContentService.createTextOutput(JSON.stringify(data))\n    .setMimeType(ContentService.MimeType.JSON);\n}\n";

    document.addEventListener('DOMContentLoaded', () => {
        if (!localStorage.getItem(STORAGE_KEY_URL)) {
            localStorage.setItem(STORAGE_KEY_URL, DEFAULT_MODUL_KHUSUS_URL);
        }
        if (!localStorage.getItem(STORAGE_KEY_DESKRIPSI_BERITA_URL)) {
            localStorage.setItem(STORAGE_KEY_DESKRIPSI_BERITA_URL, DEFAULT_DESKRIPSI_BERITA_URL);
        }
        if (!localStorage.getItem('portalVisitorCounterSpreadsheetUrl')) {
            localStorage.setItem('portalVisitorCounterSpreadsheetUrl', DEFAULT_VISITOR_COUNTER_URL);
        }
        if (localStorage.getItem(STORAGE_KEY_AUTOSYNC) === null) {
            localStorage.setItem(STORAGE_KEY_AUTOSYNC, 'true');
        }
        if (localStorage.getItem(STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC) === null) {
            localStorage.setItem(STORAGE_KEY_DESKRIPSI_BERITA_AUTOSYNC, 'true');
        }
        if (localStorage.getItem(STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC) === null) {
            localStorage.setItem(STORAGE_KEY_VISITOR_COUNTER_AUTOSYNC, 'true');
        }
        updateModulKhususUI();

        // Muat teks pratinjau Apps Script jika elemen ada
        const codeElementInit = document.getElementById('modul-khusus-script-code-text');
        if (codeElementInit) {
            codeElementInit.innerText = EMBEDDED_MODUL_KHUSUS_GAS_CODE;
        }
        const codeElement = document.getElementById('modul-khusus-script-code-text');
        if (codeElement && (!codeElement.innerText || codeElement.innerText.length < 50)) {
            fetch('google_apps_script_modul_khusus.gs')
                .then(res => res.text())
                .then(text => {
                    if (text && text.length > 50) {
                        codeElement.innerText = text;
                        gasCode6Sheet = text;
                    }
                })
                .catch(() => {});
        }
    });

    window.updateModulKhususUI = updateModulKhususUI;
})();
