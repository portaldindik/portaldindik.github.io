/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - PART 1: DATA MASTER (PORTAL DINAS PENDIDIKAN MADIUN)
 * ==============================================================================
 * File ini berisi seluruh Data Default Awal dari 9 Fitur Utama & Konfigurasi Sheet.
 * Letakkan file ini di project Apps Script Anda bersama dengan Part 2.
 * ==============================================================================
 */

// Data Default Awal dari Portal Dindik Madiun (Sinkron 100% dengan Data.js Terbaru)
var DEFAULT_PORTAL_DATA = [
  {
    "id": "spm",
    "nomor": "01",
    "judul": "SPM (Standar Pelayanan Minimal)",
    "subjudul": "Standar mutu layanan pendidikan dasar dan menengah",
    "ikon": "fa-balance-scale",
    "warnaTema": {
      "gradient": "from-blue-600 to-cyan-500",
      "bgSoft": "bg-blue-50",
      "textAccent": "text-blue-600",
      "borderAccent": "border-blue-500",
      "glowColor": "rgba(37, 99, 235, 0.4)",
      "badgeBg": "bg-blue-100 text-blue-800"
    },
    "ringkasan": "Pemenuhan indikator SPM, penuntasan Zero ATS, aksi Satgas Kober, dan beasiswa terpadu.",
    "bagian": [
      {
        "id": "ikk",
        "nama": "IKK (Indikator Kinerja Kunci)",
        "tipe": "tabel",
        "deskripsi": "Capaian dan target Indikator Kinerja Kunci (IKK) urusan pendidikan dan kebudayaan.",
        "kolom": [
          "No.",
          "Nama Indikator",
          "Capaian 2025",
          "Target 2026",
          "Target 2027"
        ],
        "baris": [
          [
            "1",
            "Persentase anak usia 5-6 tahun yang berpartisipasi dalam pendidikan anak usia dini",
            "84,39 / 100",
            "100",
            "100"
          ],
          [
            "2",
            "Persentase anak usia 7-15 tahun yang berpartisipasi dalam pendidikan dasar",
            "84,03",
            "99,61",
            "99,62"
          ],
          [
            "3",
            "Persentase anak usia 7-18 tahun yang berpartisipasi dalam pendidikan kesetaraan",
            "45,82",
            "46,00",
            "46,02"
          ],
          [
            "4",
            "Persentase toilet Sekolah Dasar, Sekolah Menengah Pertama dalam kondisi baik",
            "44,62",
            "45,00",
            "45,02"
          ],
          [
            "5",
            "Persentase Ruang Kelas Sekolah Dasar, Sekolah Menengah Pertama dalam kondisi baik",
            "31,41",
            "35,00",
            "40,00"
          ],
          [
            "6",
            "Persentase jumlah warisan budaya yang dilestarikan",
            "100",
            "100",
            "100"
          ],
          [
            "7",
            "Persentase peningkatan jumlah masyarakat yang mengunjungi pusat seni dan pusat sejarah",
            "7,19",
            "7,50",
            "8,00"
          ]
        ]
      },
      {
        "id": "iku",
        "nama": "IKU (Indikator Kinerja Utama)",
        "tipe": "tabel",
        "deskripsi": "Target Indikator Kinerja Utama (IKU) Renstra 2025 - 2029 Dinas Pendidikan dan Kebudayaan.",
        "kolom": [
          "No.",
          "Indikator",
          "Satuan",
          "Baseline (2024)",
          "Target 2025",
          "Realisasi 2025",
          "Target 2026",
          "Target 2027",
          "Target 2028",
          "Target 2029",
          "Target 2030"
        ],
        "baris": [
          [
            "1",
            "Rata-rata Lama Sekolah",
            "Nilai",
            "8,20",
            "8,50",
            "8,21",
            "8,80",
            "9,10",
            "9,40",
            "9,70",
            "10,00"
          ],
          [
            "2",
            "Harapan Lama Sekolah",
            "Nilai",
            "13,27",
            "13,50",
            "13,28",
            "13,80",
            "14,10",
            "14,40",
            "14,70",
            "15,00"
          ],
          [
            "3",
            "Indeks Capaian SPM pendidikan",
            "Indeks",
            "83,04",
            "94,38",
            "98,77",
            "95,13",
            "95,88",
            "96,63",
            "97,38",
            "98,13"
          ],
          [
            "4",
            "Proporsi Penduduk berusia 15 Tahun keatas yang berkualifikasi pendidikan tinggi",
            "Persen",
            "6,95",
            "9,47",
            "7,40",
            "9,57",
            "9,71",
            "9,84",
            "10,19",
            "11,37"
          ],
          [
            "5",
            "Nilai Pemajuan Kebudayaan",
            "Persen",
            "99,25",
            "99,40",
            "100",
            "99,55",
            "99,70",
            "99,85",
            "100,00",
            "100,00"
          ],
          [
            "6",
            "Prosentase OPK yang dilestarikan",
            "Persen",
            "100",
            "100,00",
            "100",
            "100,00",
            "100,00",
            "100,00",
            "100,00",
            "100,00"
          ],
          [
            "7",
            "Persentase Cagar Budaya yang dikembangkan",
            "Persen",
            "1,09",
            "1,70",
            "3,60",
            "2,27",
            "2,63",
            "2,90",
            "3,13",
            "3,30"
          ]
        ]
      },
      {
        "id": "satgas-kober",
        "nama": "Satgas Kober (Komando Bersama)",
        "tipe": "kegiatan-foto",
        "deskripsi": "Aksi terpadu penanganan darurat dan pembinaan karakter pelajar.",
        "kegiatan": [
          {
            "judul": "Monitoring & Pendampingan Siswa Rawan Putus Sekolah",
            "tanggal": "12 September 2026",
            "keterangan": "Satgas Kober terjun ke wilayah Pilangkenceng untuk mediasi dan fasilitasi anak putus sekolah agar kembali ke bangku pendidikan formal/non-formal.",
            "gambar": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
          },
          {
            "judul": "Patroli Simpatik & Pembinaan Pelajar Jam Efektif",
            "tanggal": "28 Agustus 2026",
            "keterangan": "Kegiatan kolaboratif bersama Satpol PP dan Komite Sekolah di wilayah Caruban guna membina ketertiban peserta didik.",
            "gambar": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
          },
          {
            "judul": "Sosialisasi Ketahanan Mental & Anti-Bullying",
            "tanggal": "15 Agustus 2026",
            "keterangan": "Edukasi di SMP Negeri se-Kecamatan Mejayan untuk mewujudkan lingkungan ramah anak bebas perundungan.",
            "gambar": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "zero-ats",
        "nama": "Zero ATS (Anak Tidak Sekolah)",
        "tipe": "info-program",
        "deskripsi": "Inisiatif penuntasan anak tidak sekolah usia 7-18 tahun di Kabupaten Madiun melalui kolaborasi lintas sektor, verifikasi geospasial Si-Lacak ATS, dan intervensi pendidikan tepat sasaran.",
        "statistik": [
          {
            "label": "Total ATS Terdata",
            "nilai": "184 Anak"
          },
          {
            "label": "Putus Sekolah (DO)",
            "nilai": "78 Anak"
          },
          {
            "label": "Lulus Tdk Lanjut (LTM)",
            "nilai": "86 Anak"
          },
          {
            "label": "Belum Pernah Sekolah (BPB)",
            "nilai": "20 Anak"
          },
          {
            "label": "Kembali Bersekolah Formal",
            "nilai": "142 Anak"
          },
          {
            "label": "Diintegrasikan ke PKBM",
            "nilai": "42 Anak"
          }
        ],
        "tabelRekapAts": {
          "judul": "Tabel Rekapitulasi Penanganan ATS Berdasarkan Kategori & Jenjang",
          "keterangan": "Data agregat hasil pendataan dan intervensi terpadu lintas sektor Kabupaten Madiun.",
          "kolom": [
            "No.",
            "Kategori ATS",
            "Definisi & Kriteria Peserta",
            "Rincian Jenjang / Usia",
            "Jumlah Anak",
            "Kembali ke Formal",
            "Masuk PKBM",
            "Status"
          ],
          "baris": [
            [
              "1",
              "Putus Sekolah / Drop Out (DO)",
              "Berhenti sebelum menamatkan jenjang pendidikan dasar",
              "SD: 28 Anak | SMP: 50 Anak",
              "78",
              "58",
              "20",
              "100% Tertangani"
            ],
            [
              "2",
              "Lulus Tidak Melanjutkan (LTM)",
              "Lulus satu jenjang namun tidak lanjut ke jenjang atasnya",
              "SD-SMP: 48 Anak | SMP-SMA: 38 Anak",
              "86",
              "72",
              "14",
              "100% Tertangani"
            ],
            [
              "3",
              "Belum Pernah Bersekolah (BPB)",
              "Usia 7-18 tahun yang belum pernah bersekolah sama sekali",
              "Usia 7-12: 11 Anak | Usia 13-18: 9 Anak",
              "20",
              "12",
              "8",
              "100% Tertangani"
            ]
          ]
        },
        "poinPenting": [
          "Aplikasi Si-Lacak ATS terintegrasi tingkat Desa/Kelurahan se-Kabupaten Madiun untuk pemetaan koordinat domisili anak secara presisi.",
          "Fasilitasi seragam sekolah gratis, buku, sepatu, dan jaminan bebas seluruh iuran penunjang pendidikan.",
          "Pendampingan terpadu bersama Satgas Kober, Dinas Sosial, Dinas PMD, dan Pemerintah Desa setempat.",
          "Penyediaan program kelas kesetaraan fleksibel di Pusat Kegiatan Belajar Masyarakat (PKBM) bagi anak yang telah bekerja atau usia lanjut."
        ]
      },
      {
        "id": "beasiswa",
        "nama": "Program Beasiswa Terpadu",
        "tipe": "kegiatan-foto",
        "deskripsi": "Bantuan pendidikan KIP Daerah, PKS, dan beasiswa mahasiswa berprestasi Kabupaten Madiun.",
        "statistik": [
          {
            "label": "Total Penerima Beasiswa",
            "nilai": "3.200 Orang"
          },
          {
            "label": "KIP Daerah SD",
            "nilai": "1.650 Siswa"
          },
          {
            "label": "KIP Daerah SMP",
            "nilai": "800 Siswa"
          },
          {
            "label": "KIP Daerah PKBM",
            "nilai": "250 Siswa"
          },
          {
            "label": "Beasiswa PKS Kampus",
            "nilai": "250 Mahasiswa"
          },
          {
            "label": "Beasiswa Prestasi Mhs",
            "nilai": "250 Mahasiswa"
          }
        ],
        "kegiatan": [
          {
            "judul": "Penyaluran Simbolis Beasiswa KIP Daerah Jenjang SD & SMP",
            "tanggal": "16 September 2026",
            "keterangan": "Penyerahan beasiswa perlengkapan sekolah dan buku tabungan pendidikan bagi 2.450 siswa prasejahtera di Pendopo Ronggo Djoemeno Caruban.",
            "gambar": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
          },
          {
            "judul": "Fasilitasi Bantuan PKS (Pendidikan Khusus Siswa Rentan & Yatim)",
            "tanggal": "04 September 2026",
            "keterangan": "Intervensi langsung bantuan tanggap darurat bagi anak yatim/piatu dan korban bencana alam agar tetap melanjutkan proses belajar tanpa kendala biaya.",
            "gambar": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
          },
          {
            "judul": "Pembinaan & Evaluasi Mahasiswa Penerima Beasiswa Madiun Juara",
            "tanggal": "22 Agustus 2026",
            "keterangan": "Pengarahan berkala dan evaluasi capaian indeks prestasi kumulatif (IPK) bagi mahasiswa berprestasi asal Kabupaten Madiun di perguruan tinggi negeri mitra.",
            "gambar": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
          }
        ],
        "daftar": [
          {
            "nama": "KIP Daerah (Kartu Indonesia Pintar)",
            "cakupan": "Jenjang SD & SMP se-Kabupaten Madiun",
            "sasaran": "Siswa dari keluarga prasejahtera dan pemegang DTKS",
            "manfaat": "Bantuan uang tunai semesteran untuk perlengkapan sekolah"
          },
          {
            "nama": "PKS (Pendidikan Khusus Siswa Miskin)",
            "cakupan": "Bantuan darurat pencegahan putus sekolah",
            "sasaran": "Siswa yatim/piatu, korban bencana, dan kondisi rentan",
            "manfaat": "Intervensi langsung pendanaan buku, seragam, dan transportasi"
          },
          {
            "nama": "Beasiswa Perguruan Tinggi Madiun Juara",
            "cakupan": "Mahasiswa berprestasi ber-KTP Kabupaten Madiun",
            "sasaran": "Mahasiswa D4/S1 di PTN maupun PTS mitra unggulan",
            "manfaat": "Bantuan UKT dan uang saku prestasi akademik / non-akademik"
          }
        ]
      }
    ]
  },
  {
    "id": "lembaga-sekolah",
    "nomor": "02",
    "judul": "Lembaga Sekolah",
    "subjudul": "Basis data satuan pendidikan formal dan non-formal daerah",
    "ikon": "fa-school",
    "warnaTema": {
      "gradient": "from-emerald-600 to-teal-500",
      "bgSoft": "bg-emerald-50",
      "textAccent": "text-emerald-600",
      "borderAccent": "border-emerald-500",
      "glowColor": "rgba(5, 150, 105, 0.4)",
      "badgeBg": "bg-emerald-100 text-emerald-800"
    },
    "ringkasan": "Direktori lengkap sekolah formal (TK, SD, SMP) dan non-formal (PKBM, SKB, LKP) se-Kabupaten Madiun.",
    "bagian": [
      {
        "id": "formal",
        "nama": "Sekolah Formal",
        "tipe": "tabel",
        "deskripsi": "Rekapitulasi sekolah negeri dan swasta jenjang TK, SD, serta SMP.",
        "kolom": [
          "Jenjang",
          "Negeri",
          "Swasta",
          "Total Lembaga",
          "Total Siswa",
          "Total Guru"
        ],
        "baris": [
          [
            "TK / PAUD Formal",
            "12",
            "380",
            "392 Lembaga",
            "14.210 Siswa",
            "1.120 Guru"
          ],
          [
            "SD (Sekolah Dasar)",
            "404",
            "26",
            "430 Lembaga",
            "48.950 Siswa",
            "3.840 Guru"
          ],
          [
            "SMP (Sekolah Menengah Pertama)",
            "48",
            "19",
            "67 Lembaga",
            "21.340 Siswa",
            "1.790 Guru"
          ]
        ]
      },
      {
        "id": "non-formal",
        "nama": "Sekolah Non-Formal",
        "tipe": "tabel",
        "deskripsi": "Data lembaga kesetaraan, kursus keahlian, dan sanggar belajar.",
        "kolom": [
          "Jenis Lembaga",
          "Jumlah",
          "Program Unggulan",
          "Akreditasi Rata-rata",
          "Status"
        ],
        "baris": [
          [
            "PKBM (Pusat Kegiatan Belajar Masyarakat)",
            "22 Lembaga",
            "Paket A, B, C & Keterampilan Wirausaha",
            "B / A",
            "Aktif"
          ],
          [
            "SKB (Sanggar Kegiatan Belajar) Negeri",
            "1 Lembaga",
            "Pelatihan Vokasi, Kesetaraan & Keaksaraan",
            "A (Unggul)",
            "Aktif"
          ],
          [
            "LKP (Lembaga Kursus & Pelatihan)",
            "45 Lembaga",
            "Otomotif, Komputer, Menjahit, Tata Rias",
            "Terverifikasi",
            "Aktif"
          ],
          [
            "PAUD Non Formal (KB, SPS, TPA)",
            "310 Lembaga",
            "Stimulasi Dini & Karakter Mulia",
            "B",
            "Aktif"
          ]
        ]
      }
    ]
  },
  {
    "id": "psn",
    "nomor": "03",
    "judul": "PSN (Program Strategis Nasional)",
    "subjudul": "Penyelarasan agenda strategis nasional sektor pendidikan",
    "ikon": "fa-flag",
    "warnaTema": {
      "gradient": "from-indigo-600 to-purple-500",
      "bgSoft": "bg-indigo-50",
      "textAccent": "text-indigo-600",
      "borderAccent": "border-indigo-500",
      "glowColor": "rgba(79, 70, 229, 0.4)",
      "badgeBg": "bg-indigo-100 text-indigo-800"
    },
    "ringkasan": "Program prioritas Selamat Asri, Revitalisasi Sekolah, Budaya Sekolah Nyaman, dan MBG.",
    "bagian": [
      {
        "id": "selamat-asri",
        "nama": "Selamat Asri (Selasa & Jumat)",
        "tipe": "kegiatan-foto",
        "deskripsi": "Pembiasaan Selasa dan Jumat untuk lingkungan sekolah bersih, sehat, asri, dan religius berkarakter.",
        "kegiatan": [
          {
            "judul": "Gerakan Selasa Bersih & Literasi Budaya Daerah",
            "tanggal": "15 September 2026",
            "gambar": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
            "keterangan": "Pembiasaan membaca buku literasi daerah 15 menit sebelum pelajaran dan gotong royong membersihkan ruang kelas demi lingkungan belajar yang nyaman."
          },
          {
            "judul": "Sarapan Bersama Menu Seimbang (Selasa Ceria)",
            "tanggal": "08 September 2026",
            "gambar": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80",
            "keterangan": "Siswa dan guru membawa bekal sehat dengan komposisi gizi seimbang untuk dinikmati bersama di halaman sekolah, menumbuhkan kebersamaan dan kesehatan."
          },
          {
            "judul": "Senam Kesegaran Jasmani & Jumat Krida Pelajar",
            "tanggal": "18 September 2026",
            "gambar": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80",
            "keterangan": "Pelaksanaan senam kesegaran jasmani setiap Jumat pagi bersama seluruh warga sekolah untuk membangun ketahanan fisik dan semangat belajar siswa."
          },
          {
            "judul": "Aksi Jumat Bersih & Pemilahan Sampah Sekolah (Bank Sampah)",
            "tanggal": "11 September 2026",
            "gambar": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80",
            "keterangan": "Kerja bakti membersihkan lingkungan madani dan edukasi pemilahan sampah organik serta anorganik menuju program Adiwiyata berkelanjutan."
          },
          {
            "judul": "Jumat Religi & Penguatan Pendidikan Karakter (PPK)",
            "tanggal": "04 September 2026",
            "gambar": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80",
            "keterangan": "Doa bersama, tadarus, renungan keagamaan lintas keyakinan, dan pembinaan budi pekerti luhur guna memperkokoh akhlak generasi muda daerah."
          },
          {
            "judul": "Penanaman Tanaman Obat Keluarga (TOGA) & Penghijauan Sekolah",
            "tanggal": "28 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=700&q=80",
            "keterangan": "Aksi tanam pohon peneduh dan budidaya apotek hidup (TOGA) oleh siswa di sudut taman sekolah demi menciptakan suasana belajar yang asri dan teduh."
          }
        ],
        "statistik": [
          {
            "label": "Hari Selasa",
            "nilai": "Selasa Bersih & Literasi Budaya",
            "kegiatanMingguan": [
              {
                "minggu": "Minggu Ke 1",
                "kegiatan": "Literasi & Budaya Daerah",
                "detail": "Pembiasaan membaca buku kearifan lokal 15 menit sebelum pelajaran dan pelestarian budaya daerah."
              },
              {
                "minggu": "Minggu Ke 2",
                "kegiatan": "Selasa Ceria & Sarapan Sehat",
                "detail": "Edukasi gizi seimbang dan sarapan bekal sehat bersama guru dan siswa di lingkungan sekolah."
              },
              {
                "minggu": "Minggu Ke 3",
                "kegiatan": "Selasa Bersih & Lingkungan Asri",
                "detail": "Gotong royong membersihkan ruang kelas, pemilahan sampah, dan perawatan tanaman kelas."
              },
              {
                "minggu": "Minggu Ke 4",
                "kegiatan": "Selasa Berkarakter & Kreasi Siswa",
                "detail": "Penguatan budi pekerti luhur, pembiasaan tata krama, serta unjuk apresiasi kreasi seni."
              }
            ]
          },
          {
            "label": "Hari Jumat",
            "nilai": "Jumat Krida, Sehat & Religi",
            "kegiatanMingguan": [
              {
                "minggu": "Minggu Ke 1",
                "kegiatan": "Jumat Religi & Karakter (PPK)",
                "detail": "Doa bersama, tadarus Al-Qur'an / kitab suci lintas keyakinan, dan pembinaan budi pekerti luhur."
              },
              {
                "minggu": "Minggu Ke 2",
                "kegiatan": "Jumat Krida & Senam Kebugaran Jasmani",
                "detail": "Senam Kesegaran Jasmani (SKJ) bersama, jalan sehat gembira, dan aktivitas fisik menjaga kebugaran."
              },
              {
                "minggu": "Minggu Ke 3",
                "kegiatan": "Jumat Bersih & PSN Bebas Jentik",
                "detail": "Kerja bakti lingkungan sekolah, pembersihan saluran air, PSN cegah DBD, dan Bank Sampah."
              },
              {
                "minggu": "Minggu Ke 4",
                "kegiatan": "Jumat Berkah & Penghijauan (Asri)",
                "detail": "Aksi infaq / sedekah peduli sesama serta penanaman pohon peneduh & apotek hidup (TOGA)."
              }
            ]
          },
          {
            "label": "Partisipasi",
            "nilai": "100% Satuan Pendidikan",
            "rincianPartisipasi": [
              {
                "jenjang": "PAUD / TK",
                "judul": "PAUD & TK Negeri/Swasta",
                "cakupan": "Pembiasaan karakter usia dini, sarapan sehat & pola hidup bersih sehat."
              },
              {
                "jenjang": "SD / MI",
                "judul": "Sekolah Dasar (SD)",
                "cakupan": "Penerapan pembiasaan literasi budaya, senam kebugaran & gotong royong."
              },
              {
                "jenjang": "SMP / MTs",
                "judul": "Sekolah Menengah Pertama (SMP)",
                "cakupan": "Aksi lingkungan mandiri, Adiwiyata, & pembinaan religi berkarakter."
              },
              {
                "jenjang": "Nonformal",
                "judul": "Layanan PKBM & SKB",
                "cakupan": "Integrasi budaya hidup sehat, asri, dan karakter warga belajar madani."
              }
            ]
          }
        ],
        "rincianKegiatan": [
          {
            "nama": "Kerja Bakti Rutin",
            "ikon": "fa-broom",
            "warna": "amber",
            "tag": "Kebersihan Saluran",
            "deskripsi": "Membersihkan sampah dan membersihkan saluran air atau selokan di lingkungan sekitar."
          },
          {
            "nama": "Pemberantasan Sarang Nyamuk",
            "ikon": "fa-shield-virus",
            "warna": "rose",
            "tag": "Pencegahan DBD",
            "deskripsi": "Memastikan lingkungan tidak lembap dan bebas dari genangan air yang menjadi sarang nyamuk."
          },
          {
            "nama": "Penghijauan",
            "ikon": "fa-seedling",
            "warna": "emerald",
            "tag": "Lingkungan Asri & Sejuk",
            "deskripsi": "Melakukan penanaman pohon serta penataan taman agar lingkungan terlihat asri dan sejuk."
          }
        ],
        "waktuPelaksanaan": "Diwajibkan setiap hari Jumat (terutama di lingkungan sekolah dan perkantoran) dan dianjurkan juga pada setiap hari Selasa.",
        "poinPenting": [
          "Kerja Bakti Rutin: Membersihkan sampah dan membersihkan saluran air atau selokan di lingkungan sekitar.",
          "Pemberantasan Sarang Nyamuk: Memastikan lingkungan tidak lembap dan bebas dari genangan air yang menjadi sarang nyamuk.",
          "Penghijauan: Melakukan penanaman pohon serta penataan taman agar lingkungan terlihat asri dan sejuk.",
          "Waktu Pelaksanaan: Diwajibkan setiap hari Jumat (terutama di lingkungan sekolah dan perkantoran) dan dianjurkan juga pada setiap hari Selasa."
        ]
      },
      {
        "id": "revitalisasi",
        "nama": "Revitalisasi Sarana Sekolah",
        "tipe": "tabel",
        "deskripsi": "Progres renovasi sarana ruang kelas, UKS, dan laboratorium sekolah serta penetapan SK penerima bantuan.",
        "dokumenSK": {
          "nomor": "421.2/1845/402.106/2026",
          "judul": "Surat Keputusan Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Madiun tentang Penetapan Satuan Pendidikan Penerima Program Revitalisasi Sarana & Prasarana Sekolah Tahun Anggaran 2026",
          "tanggal": "20 Januari 2026",
          "pejabat": "Kepala Dinas Pendidikan dan Kebudayaan Kab. Madiun",
          "ukuran": "2.4 MB (Dokumen Resmi PDF)",
          "fileNama": "SK-Revitalisasi-Sekolah-Kab-Madiun-2026.pdf",
          "url": "#",
          "keterangan": "Memuat dasar hukum penetapan, petunjuk teknis pelaksanaan, dan lampiran daftar sekolah penerima bantuan rehabilitasi sarana prasarana sekolah bersumber DAK Fisik, APBD Kabupaten Madiun, dan APBN tahun anggaran 2026."
        },
        "kegiatan": [
          {
            "judul": "Rehabilitasi 6 Ruang Kelas & Laboratorium IPA (SDN Krajan 01 Mejayan)",
            "tanggal": "12 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Penyelesaian renovasi atap, lantai keramik, pencahayaan LED hemat energi, serta penambahan fasilitas laboratorium IPA terpadu demi menunjang kenyamanan belajar siswa."
          },
          {
            "judul": "Pembangunan Gedung UKS Terpadu & Sanitasi Ramah Anak (SMPN 2 Saradan)",
            "tanggal": "25 Juli 2026",
            "gambar": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Penyediaan fasilitas ruang UKS modern dengan standar kesehatan sekolah, toilet terpisah ramah difabel, dan sistem sanitasi bersih terintegrasi DAK Fisik."
          },
          {
            "judul": "Revitalisasi Ruang Perpustakaan Digital & Pojok Baca (SDN Purworejo 02 Geger)",
            "tanggal": "18 Juni 2026",
            "gambar": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Transformasi perpustakaan konvensional menjadi pusat literasi digital yang dilengkapi komputer pintar, koleksi buku kearifan lokal, dan sudut baca ramah anak."
          }
        ],
        "kolom": [
          "No",
          "Kecamatan",
          "Nama Sekolah",
          "Bentuk Revitalisasi",
          "Progres (%)",
          "Sumber Dana"
        ],
        "baris": [
          [
            "1",
            "Mejayan",
            "SDN Krajan 01",
            "Rehab 6 Ruang Kelas & Laboratorium",
            "100% (Selesai)",
            "DAK Fisik"
          ],
          [
            "2",
            "Saradan",
            "SMPN 2 Saradan",
            "Pembangunan Ruang UKS & Sanitasi",
            "92%",
            "DAK Fisik"
          ],
          [
            "3",
            "Geger",
            "SDN Purworejo 02",
            "Renovasi Perpustakaan & Atap Gedung",
            "100% (Selesai)",
            "APBD Kab."
          ],
          [
            "4",
            "Wungu",
            "SMPN 1 Wungu",
            "Revitalisasi Lapangan & Lab Komputer",
            "85%",
            "DAK Fisik"
          ],
          [
            "5",
            "Kebonsari",
            "SDN Balerejo 01",
            "Pembangunan Ruang Kelas Baru (RKB)",
            "90%",
            "APBN"
          ]
        ]
      },
      {
        "id": "bsan",
        "nama": "BSAN (Budaya Sekolah Aman & Nyaman)",
        "tipe": "info-program",
        "deskripsi": "Gerakan sekolah aman, ramah anak, dan bebas dari segala perundungan serta penetapan SK Satgas PPKSP.",
        "dokumenSK": {
          "nomor": "420/2108/402.106/2026",
          "judul": "Surat Keputusan Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Madiun tentang Pembentukan Satuan Tugas Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (Satgas PPKSP / TPPK) Kabupaten Madiun Tahun 2026",
          "tanggal": "15 Januari 2026",
          "pejabat": "Kepala Dinas Pendidikan dan Kebudayaan Kab. Madiun",
          "ukuran": "1.9 MB (Dokumen Resmi PDF)",
          "fileNama": "SK-Satgas-PPKSP-BSAN-Kab-Madiun-2026.pdf",
          "url": "#",
          "keterangan": "Memuat dasar hukum penetapan Satgas PPKSP Kabupaten, mandat pembentukan TPPK di 100% satuan pendidikan, SOP respon cepat darurat perundungan, dan jejaring perlindungan anak terpadu."
        },
        "kegiatan": [
          {
            "judul": "Deklarasi Sekolah Ramah Anak & Pakta Integritas Anti-Perundungan (SMPN 1 Geger)",
            "tanggal": "28 Juli 2026",
            "gambar": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Penandatanganan komitmen bersama warga sekolah untuk menciptakan ruang belajar bebas dari perundungan verbal, fisik, relasional, maupun siber demi rasa aman siswa."
          },
          {
            "judul": "Bimtek Fasilitator Sebaya Agen Perubahan 'Roots Anti-Bullying' (SMPN 2 Caruban)",
            "tanggal": "18 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pelatihan 30 siswa duta karakter terpilih sebagai motor penggerak kebaikan, agen pelaporan suportif, dan pendamping sebaya dalam menyelesaikan perselisihan secara damai."
          },
          {
            "judul": "Sosialisasi Barcode Kanal Pengaduan Darurat Kekerasan 24 Jam (SDN Krajan 02 Mejayan)",
            "tanggal": "8 September 2026",
            "gambar": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pemasangan dan simulasi pelaporan terenkripsi barcode hotline Satgas PPKSP di setiap kelas dan mading sekolah yang menjamin kerahasiaan identitas pelapor dan korban."
          }
        ],
        "statistik": [
          {
            "label": "Satgas TPPK Dibentuk",
            "nilai": "100% Sekolah"
          },
          {
            "label": "Kanal Aduan Aktif",
            "nilai": "24 Jam Online"
          },
          {
            "label": "Klinik Konseling",
            "nilai": "Tersedia Tiap SMP"
          }
        ],
        "poinPenting": [
          "Pemberlakuan SOP Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP).",
          "Pemasangan barcode hotline pelaporan darurat di sudut strategis sekolah.",
          "Pelatihan fasilitator sebaya 'Roots Anti-Perundungan' bagi siswa SMP."
        ]
      },
      {
        "id": "mbg",
        "nama": "MBG (Makan Bergizi Gratis)",
        "tipe": "tabel",
        "deskripsi": "Penyaluran dan pemetaan makan bergizi gratis bagi seluruh siswa.",
        "kolom": [
          "Status MBG",
          "Jumlah Sekolah",
          "Jumlah Siswa",
          "Keterangan Distribusi"
        ],
        "baris": [
          [
            "Sudah Menerima (Tahap 1 & 2)",
            "182 Sekolah",
            "24.600 Siswa",
            "Distribusi harian melalui dapur gizi terakreditasi Dinkes"
          ],
          [
            "Sedang Verifikasi Dapur Mitra",
            "95 Sekolah",
            "12.450 Siswa",
            "Penyiapan fasilitas sanitasi dan sentra distribusi"
          ],
          [
            "Tahap Penjadwalan Berikutnya",
            "153 Sekolah",
            "19.300 Siswa",
            "Menunggu giliran perluasan cakupan kuartal berjalan"
          ]
        ]
      },
      {
        "id": "adiwiyata",
        "nama": "Sekolah Adiwiyata",
        "tipe": "tabel",
        "deskripsi": "Gerakan Peduli & Berbudaya Lingkungan Hidup di Sekolah (PBLHS) serta pemetaan status Adiwiyata Mandiri, Nasional, Provinsi, Binaan, dan Tahap Persiapan.",
        "statistik": [
          {
            "label": "Total Satuan Pendidikan Terdata",
            "nilai": "430 Sekolah",
            "keterangan": "Jenjang SD & SMP se-Kabupaten Madiun"
          },
          {
            "label": "Sudah Berpredikat Adiwiyata",
            "nilai": "168 Sekolah",
            "keterangan": "Mandiri (18), Nasional (40), Provinsi & Kab (110)"
          },
          {
            "label": "Proses Menuju Adiwiyata",
            "nilai": "184 Sekolah",
            "keterangan": "Sekolah Binaan dalam pendampingan DLH & Dikbud"
          },
          {
            "label": "Belum Adiwiyata (Tahap Persiapan)",
            "nilai": "78 Sekolah",
            "keterangan": "Tahap inisiasi Pokja & sarana sanitasi dasar"
          }
        ],
        "kegiatan": [
          {
            "judul": "Pengelolaan Bank Sampah 3R & Budidaya Maggot (SMPN 1 Mejayan - Adiwiyata Mandiri)",
            "tanggal": "14 Juli 2026",
            "gambar": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pembiasaan pemilahan sampah organik dan anorganik dari sumbernya, produksi pupuk kompos cair, dan budidaya maggot BSF sebagai sarana edukasi zero-waste di lingkungan sekolah."
          },
          {
            "judul": "Konservasi Air, Sumur Resapan & Kebun TOGA (SDN Caruban 02 - Adiwiyata Nasional)",
            "tanggal": "5 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pemanfaatan kembali air limbah wudhu untuk kolam bioflok, penataan puluhan varietas Tanaman Obat Keluarga (TOGA), serta instalasi lubang resapan biopori di seluruh penjuru halaman sekolah."
          },
          {
            "judul": "Workshop Pendampingan Sekolah Binaan Menuju Adiwiyata (Gedung KPRI Mejayan)",
            "tanggal": "22 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Bimbingan teknis penyusunan Evaluasi Diri Sekolah (EDS) Gerakan PBLHS, integrasi kurikulum berwawasan lingkungan hidup, dan percepatan kesiapan penilaian Calon Sekolah Adiwiyata."
          }
        ],
        "kolom": [
          "No",
          "Status Kesiapan Adiwiyata",
          "Jenjang SD",
          "Jenjang SMP",
          "Total Satuan",
          "Persentase (%)",
          "Kriteria & Tahapan Pelaksanaan"
        ],
        "baris": [
          [
            "1",
            "Sudah Adiwiyata (Mandiri & Nasional)",
            "42 Sekolah",
            "16 Sekolah",
            "58 Sekolah",
            "13.5%",
            "Memiliki bank sampah aktif, konservasi energi, drainase ramah lingkungan, dan membina min. 3 sekolah lain."
          ],
          [
            "2",
            "Sudah Adiwiyata (Provinsi & Kabupaten)",
            "84 Sekolah",
            "26 Sekolah",
            "110 Sekolah",
            "25.6%",
            "Telah lolos verifikasi lapangan DLH & Dikbud dengan skor evaluasi PBLHS di atas 80 poin."
          ],
          [
            "3",
            "Proses Menuju Adiwiyata (Sekolah Binaan)",
            "140 Sekolah",
            "44 Sekolah",
            "184 Sekolah",
            "42.8%",
            "Sedang penyusunan dokumen Rencana Gerakan PBLHS, integrasi kurikulum KSP, dan penataan sarana komposter."
          ],
          [
            "4",
            "Belum Adiwiyata (Tahap Persiapan & Sosialisasi)",
            "65 Sekolah",
            "13 Sekolah",
            "78 Sekolah",
            "18.1%",
            "Pembentukan Kader Adiwiyata, penanaman pohon peneduh, dan persiapan sarana pemilahan sampah 3R di kelas."
          ]
        ]
      }
    ]
  },
  {
    "id": "psd",
    "nomor": "04",
    "judul": "PSD (Program Strategis Daerah)",
    "subjudul": "Akselerasi SDM unggul dan pemerataan pendidik Madiun",
    "ikon": "fa-chart-line",
    "warnaTema": {
      "gradient": "from-amber-500 to-orange-600",
      "bgSoft": "bg-amber-50",
      "textAccent": "text-amber-600",
      "borderAccent": "border-amber-500",
      "glowColor": "rgba(245, 158, 11, 0.4)",
      "badgeBg": "bg-amber-100 text-amber-800"
    },
    "ringkasan": "Peningkatan IPM pendidikan dan penataan penempatan ASN guru berbasis domisili.",
    "bagian": [
      {
        "id": "idm-ipm",
        "nama": "IPM / IDM Pendidikan",
        "tipe": "info-program",
        "deskripsi": "Indikator IPM pendidikan dan indeks desa membangun Kabupaten Madiun.",
        "statistik": [
          {
            "label": "IPM Kab. Madiun",
            "nilai": "73.48 (Tinggi)"
          },
          {
            "label": "Harapan Lama Sekolah",
            "nilai": "13.82 Tahun"
          },
          {
            "label": "Rata-rata Lama Sekolah",
            "nilai": "8.45 Tahun"
          },
          {
            "label": "Pertumbuhan per Tahun",
            "nilai": "+0.65 poin"
          }
        ],
        "poinPenting": [
          "Peningkatan mutu sarana pembelajaran berbasis teknologi di wilayah perbatasan.",
          "Pelatihan kompetensi digital bagi 100% kepala sekolah dan pendidik.",
          "Subsidi penunjang pendidikan inklusif untuk menjangkau seluruh lapisan masyarakat desa."
        ]
      },
      {
        "id": "domisili-asn",
        "nama": "Pendekatan Domisili ASN",
        "tipe": "info-program",
        "deskripsi": "Penempatan guru ASN mendekati domisili demi efektivitas mengajar.",
        "statistik": [
          {
            "label": "Guru Telah Didekatkan",
            "nilai": "348 Guru"
          },
          {
            "label": "Efisiensi Waktu Tempuh",
            "nilai": "Rata-rata -45 Menit"
          },
          {
            "label": "Tingkat Kepuasan Kerja",
            "nilai": "94.8%"
          }
        ],
        "poinPenting": [
          "Sistem zonasi cerdas berbasis GIS untuk memetakan jarak rumah guru dengan sekolah target.",
          "Prioritas bagi guru dengan masa pengabdian >5 tahun di wilayah terpencil.",
          "Mencegah kelelahan perjalanan sehingga energi mengajar guru tetap prima di kelas."
        ]
      },
      {
        "id": "one-village-one-center",
        "nama": "One Village One Center of Culture and Art",
        "subLabel": "Satu Desa Satu Padepokan Seni dan Budaya",
        "tipe": "info-program",
        "deskripsi": "Satu desa satu padepokan seni dan budaya sebagai wadah pelestarian tradisi, pembinaan sanggar seni rakyat, dan regulasi fasilitas kebudayaan desa.",
        "kegiatan": [
          {
            "judul": "Peresmian Padepokan Seni Desa & Penyerahan Hibah Gamelan (Desa Bodag, Kare)",
            "tanggal": "24 Februari 2026",
            "gambar": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Penyerahan hibah seperangkat gamelan perunggu dan peresmian balai padepokan seni desa sebagai sentra latihan rutin generasi muda dan pelestari kesenian lokal."
          },
          {
            "judul": "Bimtek Pamong Budaya Desa & Manajemen Sanggar Seni Tradisi (Kecamatan Mejayan)",
            "tanggal": "15 Maret 2026",
            "gambar": "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pelatihan tata kelola pertunjukan, pengarsipan warisan tutur, dan kurasi karya seni bagi para pamong budaya perwakilan desa se-Kabupaten Madiun."
          },
          {
            "judul": "Pagelaran Seni Padepokan Desa Malam Bulan Purnama (Kecamatan Dagangan)",
            "tanggal": "10 April 2026",
            "gambar": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pentas kolaborasi tari rakyat, karawitan anak, dan unjuk kreasi budaya antar-padepokan desa dalam menyemarakkan kalender wisata budaya daerah."
          }
        ],
        "statistik": [
          {
            "label": "Target Padepokan",
            "nilai": "206 Desa / Kelurahan"
          },
          {
            "label": "Padepokan Terbentuk",
            "nilai": "142 Desa Aktif"
          },
          {
            "label": "Pamong Budaya Desa",
            "nilai": "206 Tenaga Pendamping"
          },
          {
            "label": "Bantuan Sarana Gamelan",
            "nilai": "100% Kecamatan Terfasilitasi"
          }
        ],
        "poinPenting": [
          "Regulasi Terkait One Center One Culture and Art: Penetapan Perbup pedoman penyelenggaraan seni dan budaya desa.",
          "Satu Desa Satu Padepokan Seni dan Budaya: Sentra edukasi kebudayaan, pagelaran, dan wadah latihan bersama warga.",
          "Fasilitasi bantuan sarana alat musik tradisional dan pendampingan kurator seni daerah secara bertahap.",
          "Integrasi padepokan seni desa dengan kegiatan ekstrakurikuler budaya pada satuan pendidikan SD dan SMP sekitar."
        ]
      },
      {
        "id": "sebul",
        "nama": "Seni dan Budaya Lestari (SEBUL)",
        "subLabel": "Melestarikan Seni & Budaya Daerah - Kesenian Dongkrek",
        "tipe": "info-program",
        "deskripsi": "Melestarikan seni dan budaya daerah, menumbuhkan kecintaan terhadap budaya lokal, mengembangkan potensi seni dan budaya sebagai identitas dan kebanggaan daerah, berkarakter Terdidik Cerdas Terampil, Kesenian Dongkrek Menari Di Atas Ragam Budaya.",
        "kegiatan": [
          {
            "judul": "Pentas Kolosal 1.000 Pelajar Dongkrek 'Menari Di Atas Ragam Budaya' (Alun-Alun Caruban)",
            "tanggal": "18 Mei 2026",
            "gambar": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pementasan akbar Kesenian Dongkrek asli Madiun oleh ribuan pelajar SD dan SMP memperagakan tokoh Buto Bolo, Roro Ayu, dan Sesepuh Raden Ngabei Lo Prawirodipuro."
          },
          {
            "judul": "Workshop Karakter 'Terdidik Cerdas Terampil' Seni Tradisi bagi Pelajar (SMPN 1 Mejayan)",
            "tanggal": "12 Juni 2026",
            "gambar": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pelatihan gerak tari dan iringan musik korek, kendang, kentrung, gong beras yang menanamkan budi pekerti luhur dan kegigihan pengusir pagebluk."
          },
          {
            "judul": "Gebyar Festival Pelajar SEBUL: Identitas & Kebanggaan Budaya Madiun (Pendopo Ronggo Djoemeno)",
            "tanggal": "25 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Ajang tahunan unjuk kebolehan sanggar seni sekolah se-Kabupaten Madiun dalam melestarikan ragam tari daerah dan menumbuhkan kecintaan budaya lokal."
          }
        ],
        "statistik": [
          {
            "label": "Kesenian Dongkrek",
            "nilai": "WBTb Nasional Kemendikbud"
          },
          {
            "label": "Pelajar Terlatih Menari",
            "nilai": "18.500+ Siswa"
          },
          {
            "label": "Satuan Pendidikan Binaan",
            "nilai": "100% SD & SMP"
          },
          {
            "label": "Pagelaran SEBUL Tahunan",
            "nilai": "48 Festival Budaya"
          }
        ],
        "poinPenting": [
          "Melestarikan Seni dan Budaya Daerah: Perlindungan dan pelestarian aktif warisan adiluhung khas Kabupaten Madiun.",
          "Menumbuhkan Kecintaan Terhadap Budaya Lokal: Apresiasi dan kebanggaan generasi muda terhadap tradisi leluhur daerah.",
          "Mengembangkan Potensi Seni & Budaya Sebagai Identitas & Kebanggaan Daerah: Menjadikan Madiun sentra kesenian rakyat yang berkarakter.",
          "Terdidik Cerdas Terampil: Menjadikan seni pertunjukan sebagai media pembentukan karakter budi pekerti luhur, ketangkasan, dan kreativitas.",
          "Kesenian Dongkrek: Warisan Budaya Takbenda (WBTb) Indonesia yang menjadi ikon kebanggaan budaya Kabupaten Madiun.",
          "Menari Di Atas Ragam Budaya: Harmonisasi kreasi tari tradisional yang dinamis dan menjunjung keberagaman.",
          "Mencintai Lestari Budaya: Komitmen berkesinambungan seluruh satuan pendidikan dan pegiat kebudayaan."
        ]
      }
    ]
  },
  {
    "id": "prestasi",
    "nomor": "05",
    "judul": "Prestasi Dindik Kab. Madiun",
    "subjudul": "Rekam jejak mutu, sertifikasi, dan penghargaan kinerja",
    "ikon": "fa-trophy",
    "warnaTema": {
      "gradient": "from-rose-500 to-pink-600",
      "bgSoft": "bg-rose-50",
      "textAccent": "text-rose-600",
      "borderAccent": "border-rose-500",
      "glowColor": "rgba(244, 63, 94, 0.4)",
      "badgeBg": "bg-rose-100 text-rose-800"
    },
    "ringkasan": "Torehan predikat SAKIP, LAKIP, nilai SPM terbaik, Selamat Asri, dan Jawa Pos Award.",
    "bagian": [
      {
        "id": "sakip",
        "nama": "SAKIP",
        "tipe": "info-program",
        "deskripsi": "Evaluasi akuntabilitas kinerja instansi pemerintah dengan predikat A.",
        "statistik": [
          {
            "label": "Predikat Nilai",
            "nilai": "A (Sangat Baik)"
          },
          {
            "label": "Skor Evaluasi",
            "nilai": "84.75 Poin"
          },
          {
            "label": "Kepatuhan SOP",
            "nilai": "98.2%"
          }
        ],
        "poinPenting": [
          "Penyelarasan sasaran strategis kepala dinas hingga ke level staf pengelola teknis.",
          "Penerapan digital dashboard kinerja harian berbasis output riil layanan."
        ]
      },
      {
        "id": "lakip",
        "nama": "LAKIP",
        "tipe": "info-program",
        "deskripsi": "Laporan akuntabilitas tahunan transparan dan opini wajar tanpa pengecualian.",
        "statistik": [
          {
            "label": "Status Laporan",
            "nilai": "Tepat Waktu"
          },
          {
            "label": "Opini BPK",
            "nilai": "WTP (Wajar Tanpa Pengecualian)"
          },
          {
            "label": "Efisiensi Anggaran",
            "nilai": "97.6% Terserap Berkualitas"
          }
        ],
        "poinPenting": [
          "Dapat diakses publik secara terbuka sebagai komitmen transparansi anggaran.",
          "Menjadi rujukan evaluasi perencanaan anggaran tahun berikutnya."
        ]
      },
      {
        "id": "spm-prestasi",
        "nama": "Capaian SPM",
        "tipe": "info-program",
        "deskripsi": "Capaian pemenuhan standar pelayanan minimal peringkat atas Jatim.",
        "statistik": [
          {
            "label": "Peringkat Jatim",
            "nilai": "Top 5 Terbaik"
          },
          {
            "label": "Indeks SPM",
            "nilai": "92.30 (Tuntas Madya)"
          },
          {
            "label": "Apresiasi Nasional",
            "nilai": "Kemendikbudristek"
          }
        ],
        "poinPenting": [
          "Pelayanan administrasi sekolah digital tercepat.",
          "Penyaluran bantuan operasional sekolah tepat sasaran."
        ]
      },
      {
        "id": "jawa-pos-award",
        "nama": "Jawa Pos Award & Selamat Asri",
        "tipe": "kegiatan-foto",
        "deskripsi": "Apresiasi inovasi lingkungan sekolah asri, gerakan literasi budaya, dan capaian membanggakan satuan pendidikan Kabupaten Madiun.",
        "kegiatan": [
          {
            "judul": "Penganugerahan Trofi Bergengsi Jawa Pos Award",
            "tanggal": "14 November 2025",
            "gambar": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Penerimaan apresiasi bergengsi Jawa Pos Radar Madiun Award oleh Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Madiun atas komitmen kepeloporan inovasi Gerakan Selamat Asri dan literasi peduli lingkungan di seluruh satuan pendidikan."
          },
          {
            "judul": "Gelar Karya Eco-School & Inovasi Daur Ulang Mandiri Siswa",
            "tanggal": "08 Desember 2025",
            "gambar": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pameran unjuk kreasi inovasi daur ulang sampah plastik, pembuatan kompos organik sekolah, budidaya tanaman TOGA, dan pameran biopori ramah anak oleh perwakilan siswa SD-SMP se-Kabupaten Madiun di Graha Krida Praja Caruban."
          },
          {
            "judul": "Visitasi Lapangan & Verifikasi Budaya Sekolah Asri Berkelanjutan",
            "tanggal": "22 Januari 2026",
            "gambar": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Peninjauan langsung tim juri independen dan jurnalis Jawa Pos ke lingkungan sekolah untuk memverifikasi konsistensi gerakan pilah sampah dari sumbernya, penataan taman hijau sekolah, serta kebiasaan hidup bersih seluruh warga sekolah."
          }
        ],
        "statistik": [
          {
            "label": "Kategori Award",
            "nilai": "Inovasi Pembelajaran Lingkungan"
          },
          {
            "label": "Tahun Penganugerahan",
            "nilai": "2025 / 2026"
          },
          {
            "label": "Program Unggulan",
            "nilai": "Gerakan Selamat Asri"
          }
        ],
        "poinPenting": [
          "Apresiasi media terbesar Jawa Timur atas kebersihan dan estetika lingkungan sekolah se-Madiun.",
          "Menjadi model percontohan sekolah asri tingkat regional Jawa Timur."
        ]
      }
    ]
  },
  {
    "id": "kurikulum",
    "nomor": "06",
    "judul": "Kurikulum & Karakter",
    "subjudul": "Kurikulum Merdeka berpadu kearifan lokal Kampung Pesilat",
    "ikon": "fa-book-open",
    "warnaTema": {
      "gradient": "from-sky-500 to-blue-700",
      "bgSoft": "bg-sky-50",
      "textAccent": "text-sky-600",
      "borderAccent": "border-sky-500",
      "glowColor": "rgba(14, 165, 233, 0.4)",
      "badgeBg": "bg-sky-100 text-sky-800"
    },
    "ringkasan": "Perbup 48 Kampung Pesilat, Master Cete, Sekolah Karakter, 3 Bahasa, dan 5 Hari Sekolah.",
    "bagian": [
      {
        "id": "perbup-48",
        "nama": "Perbup 48 Kampung Pesilat",
        "tipe": "kegiatan-foto",
        "deskripsi": "Integrasi nilai luhur budi pekerti pencak silat dalam kurikulum muatan lokal satuan pendidikan.",
        "dokumenSK": {
          "nomor": "48 Tahun 2018",
          "judul": "Peraturan Bupati Madiun Nomor 48 Tahun 2018 tentang Muatan Lokal Pendidikan Karakter Berbasis Pencak Silat Kampung Pesilat pada Satuan Pendidikan Kabupaten Madiun",
          "tanggal": "18 Oktober 2018",
          "pejabat": "Bupati Madiun",
          "ukuran": "2.8 MB (Dokumen Resmi PDF)",
          "fileNama": "Perbup-48-Tahun-2018-Kampung-Pesilat-Kab-Madiun.pdf",
          "url": "#",
          "keterangan": "Regulasi resmi Peraturan Bupati Madiun Nomor 48 Tahun 2018 tentang penetapan muatan lokal wajib pencak silat, insersi budi pekerti 14 perguruan silat rukun bersatu, gerakan jurus dasar pembuka pelajaran, dan penguatan karakter rukun, disiplin, serta cinta damai."
        },
        "bukuInsersi": [
          {
            "jenjang": "SD",
            "judul": "Buku Insersi Pencak Silat SD",
            "subjudul": "Panduan Pembelajaran Karakter & Gerak Dasar Silat Ramah Anak",
            "tingkat": "Sekolah Dasar (Fase A, B, C)",
            "penulis": "Tim Pengembang Kurikulum Disdikbud Kab. Madiun & Praktisi Pencak Silat",
            "link": "https://anyflip.com/bhvka/lpdt/",
            "deskripsi": "Buku panduan digital insersi nilai budi pekerti, etika persaudaraan, dan senam jurus dasar pencak silat yang disesuaikan untuk karakteristik siswa Sekolah Dasar se-Kabupaten Madiun."
          },
          {
            "jenjang": "SMP",
            "judul": "Buku Insersi Pencak Silat SMP",
            "subjudul": "Modul Integrasi Falsafah Luhur & Penguatan Karakter Pesilat Remaja",
            "tingkat": "Sekolah Menengah Pertama (Fase D)",
            "penulis": "Tim Pengembang Kurikulum Disdikbud Kab. Madiun & Praktisi Pencak Silat",
            "link": "https://anyflip.com/bhvka/gvub/",
            "deskripsi": "Buku panduan digital pendalaman filosofi pencak silat, kepemimpinan, kerukunan antar perguruan, kedisiplinan, dan sportivitas bagi peserta didik jenjang SMP se-Kabupaten Madiun."
          }
        ],
        "kegiatan": [
          {
            "judul": "Senam Jurus Tunggal Dasar Pembuka Jam Pelajaran Setiap Pagi",
            "tanggal": "18 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pembiasaan rutin senam jurus tunggal dasar pencak silat Kampung Pesilat oleh siswa-siswi SD dan SMP di lapangan sekolah sebelum kegiatan belajar mengajar dimulai guna melatih kebugaran jasmani, konsentrasi, dan kedisiplinan belajar."
          },
          {
            "judul": "Pengukuhan Duta Kerukunan Pelajar 14 Perguruan Pencak Silat",
            "tanggal": "10 September 2026",
            "gambar": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Deklarasi ikrar persaudaraan sejati dan anti-permusuhan oleh perwakilan pelajar dari 14 perguruan silat se-Kabupaten Madiun di bawah naungan Forum Kampung Pesilat demi menjaga kerukunan, toleransi, dan persatuan daerah."
          },
          {
            "judul": "Gelar Festival Seni Bela Diri Tradisi Pelajar Kampung Pesilat",
            "tanggal": "15 November 2026",
            "gambar": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Unjuk kebolehan keterampilan jurus seni bela diri tradisi beregu dan perorangan antar satuan pendidikan se-Kabupaten Madiun sebagai wadah aktualisasi bakat, sportivitas, serta pelestarian warisan budaya dunia kebanggaan Madiun."
          }
        ],
        "statistik": [
          {
            "label": "Status Kurikulum",
            "nilai": "Mulok Wajib SD & SMP"
          },
          {
            "label": "Perguruan Terlibat",
            "nilai": "14 Perguruan Silat Guyub"
          },
          {
            "label": "Fokus Nilai",
            "nilai": "Budi Pekerti, Rukun, Disiplin"
          }
        ],
        "poinPenting": [
          "Gerakan jurus dasar pencak silat sebagai senam wajib pembuka pelajaran.",
          "Penanaman rasa persaudaraan dan perdamaian di kalangan generasi muda Kabupaten Madiun.",
          "Festival seni bela diri tradisi tahunan antar sekolah se-kabupaten."
        ]
      },
      {
        "id": "master-cete",
        "nama": "Master Cete (10 Klaster Tur Edukasi)",
        "tipe": "tabel",
        "deskripsi": "10 klaster tur edukasi tematik yang menaungi jejaring sekolah.",
        "kolom": [
          "No",
          "Nama Klaster Master Cete",
          "Lokasi Pusat",
          "Fokus Keunggulan",
          "Sekolah Jejaring"
        ],
        "baris": [
          [
            "1",
            "Klaster Pusaka Pesilat",
            "Mejayan / Caruban",
            "Kearifan Budaya & Silat",
            "SMPN 1 Mejayan, SDN Krajan 01, SDN Bangunsari 01"
          ],
          [
            "2",
            "Klaster Agrowisata Wilis",
            "Kare",
            "Edukasi Kopi, Hutan & Biosfer",
            "SMPN 1 Kare, SDN Morang 01, SDN Cermo 02"
          ],
          [
            "3",
            "Klaster Waduk Bening",
            "Saradan",
            "Konservasi Air & Flora Fauna",
            "SMPN 1 Saradan, SDN Pajaran 01, SDN Sugihwaras"
          ],
          [
            "4",
            "Klaster Religi Kuno",
            "Sewulan, Dagangan",
            "Sejarah, Kaligrafi & Karakter",
            "SMPN 1 Dagangan, SDN Sewulan, SDN Banjarsari"
          ],
          [
            "5",
            "Klaster Sentra Brem",
            "Kaliabu, Mejayan",
            "Wirausaha & Pangan Lokal",
            "SMPN 2 Mejayan, SDN Kaliabu 01, SDN Klecorejo"
          ],
          [
            "6",
            "Klaster Lumbung Padi",
            "Balerejo",
            "Pertanian Modern & Ketahanan Pangan",
            "SMPN 1 Balerejo, SDN Garon 01, SDN Warurejo"
          ],
          [
            "7",
            "Klaster Cagar Budaya",
            "Kecamatan Jiwan",
            "Arkeologi & Literasi Museum",
            "SMPN 1 Jiwan, SDN Kincang 01, SDN Sukolilo"
          ],
          [
            "8",
            "Klaster Seni Reyog & Dongkrek",
            "Mejayan",
            "Seni Pertunjukan Tradisional",
            "SMPN 3 Mejayan, SDN Caruban 02, SDN Mejayan 01"
          ],
          [
            "9",
            "Klaster Teknologi Ramah",
            "Geger",
            "Robotika Sederhana & Daur Ulang",
            "SMPN 1 Geger, SDN Purworejo 01, SDN Pagotan 02"
          ],
          [
            "10",
            "Klaster Ekowisata Umbul",
            "Dolopo",
            "Pariwisata & Olahraga Air",
            "SMPN 1 Dolopo, SDN Glonggong 01, SDN Candimulyo"
          ]
        ],
        "kegiatan": [
          {
            "judul": "Tur Edukasi Agrowisata Kopi & Hutan Lindung Lereng Wilis",
            "tanggal": "18 Agustus 2026",
            "keterangan": "Siswa jejaring Klaster Agrowisata Wilis (SMPN 1 Kare dan SDN Morang 01) melakukan pembelajaran luar kelas (Outdoor Learning) interaktif mengenai siklus budidaya kopi, konservasi ekosistem hutan lindung, dan perlindungan sumber mata air pegunungan.",
            "gambar": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
          },
          {
            "judul": "Eksplorasi Sejarah & Karakter di Klaster Religi Kuno Sewulan",
            "tanggal": "2 September 2026",
            "keterangan": "Kegiatan studi lapangan literasi sejarah dan penguatan karakter moral spiritual pelajar di kompleks cagar budaya bersejarah Masjid Kuno Sewulan Dagangan, mengenalkan manuskrip kaligrafi dan sejarah perkembangan pendidikan Islam Madiun.",
            "gambar": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
          },
          {
            "judul": "Praktik Wirausaha Edukatif di Klaster Sentra Brem Kaliabu",
            "tanggal": "14 September 2026",
            "keterangan": "Peserta didik mengamati langsung proses fermentasi alami ketan putih, teknik pengolahan higienis, serta strategi pengemasan produk pangan khas brem di sentra industri rumahan Kaliabu sebagai sarana penanaman jiwa kewirausahaan sejak dini.",
            "gambar": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
      {
        "id": "branding-sekolah",
        "nama": "Branding Sekolah Karakter & Syariah",
        "tipe": "tabel",
        "deskripsi": "Sekolah percontohan penguatan religiusitas, moral, dan karakter santun.",
        "kolom": [
          "No",
          "Nama Sekolah",
          "Branding Karakter",
          "Program Khas",
          "Capaian"
        ],
        "baris": [
          [
            "1",
            "SMPN 1 Mejayan",
            "Sekolah Karakter Berbasis Pesilat",
            "Jurus Rukun & Duta Perdamaian",
            "Sekolah Rujukan Nasional"
          ],
          [
            "2",
            "SMPN 1 Dolopo",
            "Sekolah Berbasis Syariah Madani",
            "Tahfidz Juz 30 & Sholat Dhuha Berjamaah",
            "Predikat Adiwiyata & Religi"
          ],
          [
            "3",
            "SMPN 1 Geger",
            "Sekolah Berbudaya Sains & Akhlak",
            "Lab Alam Terbuka & Kajian Karakter",
            "Juara I Madrasah/Sekolah Berkarakter"
          ],
          [
            "4",
            "SDN Krajan 01 Mejayan",
            "Sekolah Berbudaya Santun",
            "3S (Senyum, Sapa, Salam) & Bahasa Krama",
            "Sekolah Model Percontohan"
          ],
          [
            "5",
            "SMPN 2 Saradan",
            "Sekolah Hijau Peduli Sesama",
            "Infaq Sayur & Bank Sampah Berkah",
            "Apresiasi Provinsi"
          ]
        ]
      },
      {
        "id": "tiga-bahasa",
        "nama": "Penerapan Pembiasaan 3 Bahasa",
        "tipe": "tabel",
        "deskripsi": "Pembiasaan bahasa Indonesia, bahasa Inggris, dan krama inggil.",
        "kolom": [
          "Hari",
          "Bahasa yang Diterapkan",
          "Aktivitas Pembiasaan",
          "Tujuan Utama"
        ],
        "baris": [
          [
            "Senin & Rabu",
            "Bahasa Indonesia Baku & Baik",
            "Upacara, apel, diskusi kelas, dan presentasi belajar",
            "Membangun rasa nasionalisme & tutur kata formal"
          ],
          [
            "Selasa & Kamis",
            "Bahasa Inggris (English Day)",
            "Sapaan pagi, dialog interaktif sederhana, kuis kosakata",
            "Kesiapan menghadapi era global & percaya diri"
          ],
          [
            "Jumat & Sabtu",
            "Basa Jawa Krama Inggil",
            "Komunikasi dengan bapak/ibu guru & sesama teman",
            "Pelestarian unggah-ungguh adat Jawa & kesantunan"
          ]
        ]
      },
      {
        "id": "lima-hari-sekolah",
        "nama": "Implementasi 5 Hari Sekolah",
        "tipe": "info-program",
        "deskripsi": "Kebijakan pembelajaran efektif 5 hari sekolah (Senin–Jumat) yang diintegrasikan secara sinergis dengan Gerakan Ayo Nyantri untuk penguatan pendidikan karakter religius, pembiasaan ibadah harian, akhlakul karimah, serta optimalisasi waktu berkualitas bersama keluarga di akhir pekan.",
        "statistik": [
          {
            "label": "Waktu Belajar Efektif",
            "nilai": "Senin - Jumat (07.00 - 15.30 WIB)"
          },
          {
            "label": "Gerakan Ayo Nyantri",
            "nilai": "Madin, TPQ & Pesantren Weekend"
          },
          {
            "label": "Harmonisasi Akhir Pekan",
            "nilai": "Sabtu & Minggu Bakti Keluarga"
          }
        ],
        "ayoNyantri": {
          "judul": "Gerakan Ayo Nyantri: Penguatan Karakter Religius & Adab Pesantren",
          "subjudul": "Sinergi Kebijakan 5 Hari Sekolah dengan Lembaga Pendidikan Keagamaan di Kabupaten Madiun",
          "deskripsi": "Gerakan Ayo Nyantri merupakan program strategis Pemerintah Kabupaten Madiun yang mengintegrasikan kebijakan 5 hari sekolah dengan ekosistem pendidikan keagamaan lokal. Waktu sore hari dan akhir pekan (Sabtu–Minggu) dioptimalkan bagi peserta didik muslim untuk menimba ilmu agama di Madrasah Diniyah (Madin), TPQ, maupun Pondok Pesantren. Program ini membentengi generasi muda dari degradasi moral dan kecanduan gawai, sekaligus menanamkan akidah kuat, adab sopan santun santri, pembiasaan salat berjamaah, serta kecintaan membaca dan menghafal Al-Qur'an.",
          "pilar": [
            {
              "nama": "Sinergi Madin & TPQ Sore Hari",
              "ikon": "fa-book-quran",
              "keterangan": "Pemberian kelonggaran waktu bagi peserta didik untuk mengikuti pembelajaran dasar Al-Qur'an, tauhid, dan fiqih ibadah di Madin/TPQ desa setempat tanpa terbebani PR sekolah."
            },
            {
              "nama": "Pesantren Akhir Pekan (Weekend)",
              "ikon": "fa-mosque",
              "keterangan": "Program kemitraan pondok pesantren ramah anak untuk kegiatan mondok singkat (short-stay) dan kajian adab santri pada hari Sabtu-Minggu."
            },
            {
              "nama": "Pembiasaan Ibadah di Sekolah",
              "ikon": "fa-hands-praying",
              "keterangan": "Budaya rutin salat dhuha, salat zuhur dan asar berjamaah di sekolah, doa/asmaul husna pagi, serta penguatan Profil Pelajar Pancasila yang berakhlak mulia."
            }
          ]
        },
        "poinPenting": [
          "Integrasi Gerakan Ayo Nyantri: Mendorong peserta didik muslim aktif mengikuti kegiatan pendidikan keagamaan di Madin, TPQ, atau Pesantren pada sore hari dan akhir pekan.",
          "Bebas Tugas PR di Akhir Pekan: Sekolah tidak membebani peserta didik dengan tugas rumah (PR) akademik pada hari libur, memastikan hari Sabtu dan Minggu menjadi sarana kebersamaan keluarga dan penguatan religi.",
          "Pembiasaan Ibadah Berjamaah: Menjadikan salat zuhur dan asar berjamaah di sekolah sebagai sarana pembentukan kedisiplinan dan spiritualitas mandiri.",
          "Penguatan Karakter Religius & Budi Pekerti: Membina adab santun santri, toleransi sesama, serta pencegahan kenakalan remaja melalui ekosistem lingkungan belajar yang aman dan bermoral."
        ]
      }
    ]
  },
  {
    "id": "skor",
    "nomor": "07",
    "judul": "SKO (Sekolah Khusus Olah Raga)",
    "subjudul": "Pusat pembinaan atlet pelajar berbakat Kabupaten Madiun",
    "ikon": "fa-running",
    "warnaTema": {
      "gradient": "from-red-500 to-amber-600",
      "bgSoft": "bg-red-50",
      "textAccent": "text-red-600",
      "borderAccent": "border-red-500",
      "glowColor": "rgba(239, 68, 68, 0.4)",
      "badgeBg": "bg-red-100 text-red-800"
    },
    "ringkasan": "Seleksi calon atlet pelajar, beasiswa asrama, dan pemusatan latihan cabor unggulan.",
    "bagian": [
      {
        "id": "seleksi-skor",
        "nama": "Seleksi Calon Siswa SKO",
        "tipe": "info-program",
        "deskripsi": "Tahapan tes administrasi, fisik, dan bakat atlet jenjang SMP.",
        "statistik": [
          {
            "label": "Kuota Diterima",
            "nilai": "60 Siswa Atlet / Angkatan"
          },
          {
            "label": "Fasilitas",
            "nilai": "Asrama, Gizi & Pelatih Berlisensi"
          },
          {
            "label": "Biaya Pendidikan",
            "nilai": "100% Ditanggung APBD"
          }
        ],
        "poinPenting": [
          "Tahap 1: Tes Administrasi dan Rekam Jejak Piagam Prestasi Minimal Tingkat Kabupaten.",
          "Tahap 2: Tes Fisik, Daya Tahan Jantung (VO2Max), Kelincahan, dan Kesehatan Dokter.",
          "Tahap 3: Uji Bakat Teknik Khusus Cabang Olahraga bersama Tim KONI & Pelatih Profesional."
        ]
      },
      {
        "id": "cabor-unggulan",
        "nama": "Cabang Olahraga Binaan",
        "tipe": "tabel",
        "deskripsi": "Pembinaan cabang pencak silat, atletik, bulutangkis, dan renang.",
        "kolom": [
          "No",
          "Cabang Olahraga",
          "Satuan Pendidikan",
          "Tempat Latihan",
          "Fasilitas",
          "Target Prestasi",
          "Prestasi Terakhir"
        ],
        "baris": [
          [
            "1",
            "Pencak Silat",
            "SMPN 1 Mejayan (Sentra SKO) & Jejaring SMP se-Kab. Madiun",
            "Padepokan Silat Kab. Madiun",
            "Gelanggang Matras Standar Internasional, Body Protector, Samsak Latih, Ruang Kebugaran & Asrama Atlet",
            "Emas Popda & O2SN Jatim",
            "Juara Umum Kejurda Jatim 2025"
          ],
          [
            "2",
            "Atletik (Lari & Lompat)",
            "SMPN 1 Pilangkenceng & SMPN 2 Mejayan",
            "Stadion Pangeran Timoer Caruban",
            "Lintasan Lari Sintetis Tartan 8 Lintasan, Bak Pasir Lompat Jauh, Matras Lompat Tinggi & Peralatan Lempar Standar PASI",
            "Medali Kejurnas Pelajar",
            "1 Emas & 2 Perak O2SN"
          ],
          [
            "3",
            "Bulutangkis",
            "SMPN 1 Dolopo & SMPN 1 Geger",
            "GOR Bulutangkis Pemkab Madiun",
            "4 Lapangan Karpet Vinyl Standar BWF, Mesin Pelontar Shuttlecock, Fitness Center & Ruang Medis Fisioterapi",
            "Juara Sirkuit Regional",
            "Semifinalis Djarum Sirnas"
          ],
          [
            "4",
            "Renang",
            "SMPN 1 Jiwan & SMPN 2 Wungu",
            "Kolam Renang Standar Nasional Caruban",
            "Kolam Olimpik 50m (8 Lintasan), Starting Block Standar FINA, Papan Sentuh Digital & Ruang Pemulihan Atlet",
            "Limit Porprov Jatim",
            "3 Medali Perak Kejurda"
          ],
          [
            "5",
            "Sepak Takraw & Futsal",
            "SMPN 1 Wonoasri & SMPN 1 Balerejo",
            "Hall Olahraga Serbaguna Caruban",
            "Lapangan Interlock Indoor Standar Nasional, Tiang Net & Bola Kompetisi Resmi, Scoreboard Digital & Perlengkapan Proteksi",
            "Podium Popda Jawa Timur",
            "Juara 2 Piala Dispora Jatim"
          ]
        ]
      }
    ]
  },
  {
    "id": "spmb",
    "nomor": "08",
    "judul": "SPMB (Sistem Penerimaan Murid Baru)",
    "subjudul": "Portal penerimaan peserta didik baru transparan dan terpadu",
    "ikon": "fa-user-graduate",
    "warnaTema": {
      "gradient": "from-fuchsia-600 to-pink-500",
      "bgSoft": "bg-fuchsia-50",
      "textAccent": "text-fuchsia-600",
      "borderAccent": "border-fuchsia-500",
      "glowColor": "rgba(192, 38, 211, 0.4)",
      "badgeBg": "bg-fuchsia-100 text-fuchsia-800"
    },
    "ringkasan": "Petunjuk teknis jalur zonasi, afirmasi, perpindahan tugas, dan prestasi sekolah.",
    "bagian": [
      {
        "id": "spmb-formal",
        "nama": "SPMB Sekolah Formal",
        "tipe": "tabel",
        "deskripsi": "Informasi kuota jalur zonasi, afirmasi, dan prestasi TK, SD, SMP.",
        "kolom": [
          "Jalur Masuk",
          "Persentase Kuota",
          "Persyaratan Utama",
          "Status Seleksi"
        ],
        "baris": [
          [
            "Jalur Zonasi Domisili",
            "50% Kuota (SMP) / 70% (SD)",
            "KK Kabupaten Madiun minimal 1 tahun sesuai zona radius",
            "Otomatis sistem GIS"
          ],
          [
            "Jalur Afirmasi",
            "15% Kuota",
            "Kartu KIP/PKH/KKS bagi keluarga ekonomi kurang mampu",
            "Verifikasi berkas"
          ],
          [
            "Jalur Perpindahan Tugas Orang Tua",
            "5% Kuota",
            "SK Mutasi orang tua dari instansi/perusahaan resmi",
            "Verifikasi berkas"
          ],
          [
            "Jalur Prestasi Nilai & Lomba",
            "30% Kuota (SMP)",
            "Rapor kelas 4-6 dan piagam kejuaraan minimal kab.",
            "Peringkat skor piagam"
          ]
        ]
      },
      {
        "id": "spmb-non-formal",
        "nama": "SPMB Sekolah Non-Formal",
        "tipe": "tabel",
        "deskripsi": "Pendaftaran pendidikan kesetaraan Paket A, B, dan C di PKBM/SKB.",
        "kolom": [
          "Jenjang Paket",
          "Batas Usia",
          "Waktu Pendaftaran",
          "Biaya Pendidikan",
          "Keterangan"
        ],
        "baris": [
          [
            "Paket A (Setara SD)",
            "Tanpa Batas Usia",
            "Buka Sepanjang Tahun",
            "Gratis (Subsidi BOSDA)",
            "Fleksibel belajar tatap muka & modul"
          ],
          [
            "Paket B (Setara SMP)",
            "Tanpa Batas Usia",
            "Mei - Agustus 2026",
            "Gratis (Subsidi BOSDA)",
            "Disertai kursus komputer & wirausaha"
          ],
          [
            "Paket C (Setara SMA)",
            "Tanpa Batas Usia",
            "Mei - Agustus 2026",
            "Gratis (Subsidi BOSDA)",
            "Jurusan IPA/IPS, ijazah resmi negara"
          ]
        ]
      }
    ]
  },
  {
    "id": "uld",
    "nomor": "09",
    "judul": "ULD (Unit Layanan Disabilitas)",
    "subjudul": "Fasilitasi pendidikan inklusif anak berkebutuhan khusus",
    "ikon": "fa-wheelchair",
    "warnaTema": {
      "gradient": "from-teal-600 to-emerald-500",
      "bgSoft": "bg-teal-50",
      "textAccent": "text-teal-600",
      "borderAccent": "border-teal-500",
      "glowColor": "rgba(13, 148, 136, 0.4)",
      "badgeBg": "bg-teal-100 text-teal-800"
    },
    "ringkasan": "Regulasi SK Bupati ULD, pendampingan guru GPK, dan rekapitulasi siswa inklusi.",
    "bagian": [
      {
        "id": "sk-gpk",
        "nama": "SK ULD & Daftar Guru GPK",
        "tipe": "tabel",
        "deskripsi": "Regulasi SK Bupati pembentukan ULD, dokumentasi layanan asesmen & pendampingan inklusif, serta daftar guru GPK bersertifikat di sekolah inklusi.",
        "dokumenSK": {
          "nomor": "188.45/412/KPTS/402.012/2023",
          "judul": "Keputusan Bupati Madiun tentang Pembentukan Unit Layanan Disabilitas (ULD) Bidang Pendidikan Kabupaten Madiun",
          "tanggal": "12 Mei 2023",
          "pejabat": "Bupati Madiun",
          "ukuran": "3.2 MB (Dokumen Resmi PDF)",
          "fileNama": "SK-Bupati-Madiun-Pembentukan-ULD-Bidang-Pendidikan.pdf",
          "url": "#",
          "keterangan": "Regulasi resmi Keputusan Bupati Madiun tentang pembentukan Unit Layanan Disabilitas (ULD) pada Dinas Pendidikan dan Kebudayaan Kabupaten Madiun guna fasilitasi pemenuhan hak belajar anak berkebutuhan khusus, penyediaan akomodasi yang layak, pendampingan GPK bersertifikat, dan penyiapan asesmen diagnostik terpadu di seluruh satuan pendidikan formal dan non-formal."
        },
        "kegiatan": [
          {
            "judul": "Asesmen Diagnostik & Identifikasi Profil Belajar ABK oleh Tim Terpadu ULD",
            "tanggal": "14 Juli 2026",
            "gambar": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pelaksanaan asesmen diagnostik perkembangan dan pemetaan modalitas belajar anak berkebutuhan khusus oleh Tim Terpadu Psikolog dan Terapis ULD Dinas Pendidikan dan Kebudayaan Kabupaten Madiun guna merumuskan Program Pembelajaran Individual (PPI) berbasis potensi unik siswa."
          },
          {
            "judul": "Pendampingan Intensif Siswa Inklusi oleh Guru GPK di Kelas Pembelajaran Reguler",
            "tanggal": "12 Agustus 2026",
            "gambar": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Guru Pembimbing Khusus (GPK) mendampingi peserta didik disabilitas dalam adaptasi kurikulum materi ajar dan pemanfaatan alat peraga taktil/visual di SDN Bangunsari 01 Inklusi Mejayan demi memastikan lingkungan belajar aman, ramah, dan bebas diskriminasi."
          },
          {
            "judul": "Bimtek & Penguatan Kompetensi Diferensiasi Pembelajaran Guru GPK Kabupaten Madiun",
            "tanggal": "08 September 2026",
            "gambar": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
            "keterangan": "Pelatihan teknis berkelanjutan bagi guru GPK jenjang SD dan SMP se-Kabupaten Madiun bekerja sama dengan Balai Besar Guru Penggerak (BBGP) Jawa Timur dan Tim Ahli ULD untuk penguatan strategi diferensiasi asesmen, modifikasi materi ajar, dan intervensi sensori terpadu."
          }
        ],
        "kolom": [
          "No",
          "Nama Guru GPK",
          "NIP / NUPTK",
          "Satuan Pendidikan Penugasan",
          "Kecamatan"
        ],
        "baris": [
          [
            "1",
            "Siti Nurhaliza, S.Pd., Gr.",
            "19880412 201402 2 003",
            "SDN Bangunsari 01 Inklusi",
            "Mejayan"
          ],
          [
            "2",
            "Bambang Suprayitno, M.Pd.",
            "19820315 200901 1 008",
            "SMPN 1 Mejayan",
            "Mejayan"
          ],
          [
            "3",
            "Dewi Anggraini, S.Pd.",
            "19910920 201903 2 011",
            "SDN Purworejo 02",
            "Geger"
          ],
          [
            "4",
            "Rahmat Hidayat, S.Pd.",
            "19850704 201101 1 009",
            "SMPN 1 Dolopo Inklusi",
            "Dolopo"
          ],
          [
            "5",
            "Tri Wahyuni, S.Pd.I",
            "19930218 202012 2 015",
            "SDN Pajaran 01",
            "Saradan"
          ]
        ]
      },
      {
        "id": "rekap-inklusi",
        "nama": "Rekapitulasi Anak Disabilitas & Inklusi",
        "tipe": "tabel",
        "deskripsi": "Rekapitulasi data layanan peserta didik inklusi se-Kabupaten Madiun.",
        "kolom": [
          "Jenis Kebutuhan Khusus",
          "Jenjang TK",
          "Jenjang SD",
          "Jenjang SMP",
          "Total Terlayani",
          "Ketersediaan Sarpras"
        ],
        "baris": [
          [
            "Hambatan Penglihatan (Low Vision/Netra)",
            "4 Siswa",
            "14 Siswa",
            "9 Siswa",
            "27 Siswa",
            "Buku Braille & Screen Reader"
          ],
          [
            "Hambatan Pendengaran (Tunarungu)",
            "6 Siswa",
            "22 Siswa",
            "16 Siswa",
            "44 Siswa",
            "Guru Bahasa Isyarat & Visual"
          ],
          [
            "Hambatan Gerak / Motorik (Tunadaksa)",
            "5 Siswa",
            "19 Siswa",
            "12 Siswa",
            "36 Siswa",
            "Jalur Landai (Ramp) & Toilet Akses"
          ],
          [
            "Hambatan Intelektual & Belajar Khusus",
            "12 Siswa",
            "48 Siswa",
            "31 Siswa",
            "91 Siswa",
            "Kurikulum Modifikasi & PPI"
          ],
          [
            "Spektrum Autisme & ADHD",
            "8 Siswa",
            "26 Siswa",
            "15 Siswa",
            "49 Siswa",
            "Ruang Sensori & Pendamping GPK"
          ]
        ]
      }
    ]
  }
];

// Skema Pemetaan Sheet untuk 15 Tabel Utama
var TABLE_CONFIGS = [
  { sheetName: 'SPM_IKK', featureId: 'spm', subId: 'ikk', title: 'Indikator Kinerja Kunci (IKK)' },
  { sheetName: 'SPM_IKU', featureId: 'spm', subId: 'iku', title: 'Indikator Kinerja Utama (IKU)' },
  { sheetName: 'LEMBAGA_FORMAL', featureId: 'lembaga-sekolah', subId: 'formal', title: 'Sekolah Formal' },
  { sheetName: 'LEMBAGA_NONFORMAL', featureId: 'lembaga-sekolah', subId: 'non-formal', title: 'Sekolah Non-Formal' },
  { sheetName: 'PSN_REVITALISASI', featureId: 'psn', subId: 'revitalisasi', title: 'Revitalisasi Sarana Sekolah' },
  { sheetName: 'PSN_MBG', featureId: 'psn', subId: 'mbg', title: 'Makan Bergizi Gratis (MBG)' },
  { sheetName: 'PSN_ADIWIYATA', featureId: 'psn', subId: 'adiwiyata', title: 'Sekolah Adiwiyata' },
  { sheetName: 'KURIKULUM_MASTERCETE', featureId: 'kurikulum', subId: 'master-cete', title: 'Master Cete (10 Klaster Tur Edukasi)' },
  { sheetName: 'KURIKULUM_BRANDING', featureId: 'kurikulum', subId: 'branding-sekolah', title: 'Branding Sekolah Karakter & Syariah' },
  { sheetName: 'KURIKULUM_3BAHASA', featureId: 'kurikulum', subId: 'tiga-bahasa', title: 'Penerapan Pembiasaan 3 Bahasa' },
  { sheetName: 'SKO_CABOR', featureId: 'skor', subId: 'cabor-unggulan', title: 'Cabang Olahraga Binaan SKO' },
  { sheetName: 'SPMB_FORMAL', featureId: 'spmb', subId: 'spmb-formal', title: 'SPMB Sekolah Formal' },
  { sheetName: 'SPMB_NONFORMAL', featureId: 'spmb', subId: 'spmb-non-formal', title: 'SPMB Sekolah Non-Formal' },
  { sheetName: 'ULD_GURU_GPK', featureId: 'uld', subId: 'sk-gpk', title: 'SK ULD & Daftar Guru GPK' },
  { sheetName: 'ULD_REKAP_DISABILITAS', featureId: 'uld', subId: 'rekap-inklusi', title: 'Rekapitulasi Siswa Disabilitas & Inklusi' }
];
