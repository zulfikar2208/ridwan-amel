document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // KONFIGURASI
    // =====================================================

    // Ubah tanggal acara di sini
    // Format: TAHUN-BULAN-TANGGAL JAM:MENIT:DETIK
const TARGET_TANGGAL = new Date("2026-10-04T09:00:00+07:00").getTime();

    // =====================================================
    // PARAMETER URL / NAMA TAMU
    // =====================================================

    const paramUrl = new URLSearchParams(window.location.search);

    const namaTamuMentah =
        paramUrl.get("to") || paramUrl.get("nama");

    const kategoriTamu = paramUrl.get("cat");

    const elNamaTamu = document.getElementById("namaTamu");


    // Tampilkan nama tamu
    if (namaTamuMentah && elNamaTamu) {

        try {
            elNamaTamu.textContent = decodeURIComponent(
                namaTamuMentah
            );
        } catch (error) {
            elNamaTamu.textContent = namaTamuMentah;
        }

    }


    // Ubah judul halaman
    if (namaTamuMentah) {

        try {
            document.title =
                "Undangan untuk " +
                decodeURIComponent(namaTamuMentah);
        } catch (error) {
            document.title =
                "Undangan untuk " + namaTamuMentah;
        }

    }


    // =====================================================
    // KATEGORI TAMU
    // =====================================================

    const elBadge = document.getElementById("badgeTamu");

    if (elBadge && kategoriTamu) {

        const labelKategori = {
            biasa: "Tamu Biasa",
            vip: "VIP",
            vvip: "VVIP"
        };

        const kategori = kategoriTamu.toLowerCase();

        elBadge.textContent =
            labelKategori[kategori] || "";

        if (labelKategori[kategori]) {
            elBadge.classList.add(
                "badge-" + kategori
            );
        }

    }


    // =====================================================
    // ELEMENT COVER & MUSIK
    // =====================================================

    const musicCover =
        document.getElementById("musicCover");

    const musicBtn =
        document.getElementById("musicBtn");

    const musicBtnLabel =
        document.getElementById("musicBtnLabel");

    const guestWrap =
        document.getElementById("guestWrap");

    const musik =
        document.getElementById("musikLatar");

    const musicControl =
        document.getElementById("musicControl");


    // =====================================================
    // STATUS UNDANGAN
    // =====================================================

    const SUDAH_DIBUKA_KEY =
        "undanganSudahDibuka";

    const sudahDibuka =
        sessionStorage.getItem(SUDAH_DIBUKA_KEY);


    // Jika undangan sebelumnya sudah dibuka
    if (sudahDibuka === "true") {

        // Sembunyikan cover
        if (musicCover) {
            musicCover.style.display = "none";
        }

        // Buka scroll halaman
        document.documentElement.classList.remove(
            "no-scroll"
        );

        document.body.classList.remove(
            "no-scroll"
        );

        // Tampilkan kontrol musik
        if (musicControl) {

            musicControl.classList.add(
                "show"
            );

            // Musik belum otomatis diputar
            musicControl.classList.add(
                "paused"
            );

        }

    } else {

        // Jika belum membuka undangan,
        // halaman tidak bisa di-scroll
        document.documentElement.classList.add(
            "no-scroll"
        );

        document.body.classList.add(
            "no-scroll"
        );

    }


    // =====================================================
    // FUNGSI BUKA UNDANGAN
    // =====================================================

    function bukaUndangan() {

        // Simpan status undangan
        sessionStorage.setItem(
            SUDAH_DIBUKA_KEY,
            "true"
        );


        // -------------------------------------------------
        // PUTAR MUSIK
        // -------------------------------------------------

        if (musik) {

            musik.volume = 0.6;

            musik.play()
                .then(function () {

                    if (musicControl) {

                        musicControl.classList.add(
                            "show"
                        );

                        musicControl.classList.remove(
                            "paused"
                        );

                    }

                })
                .catch(function (error) {

                    console.log(
                        "Musik tidak dapat diputar:",
                        error
                    );

                    // Tetap tampilkan tombol musik
                    if (musicControl) {

                        musicControl.classList.add(
                            "show"
                        );

                        musicControl.classList.add(
                            "paused"
                        );

                    }

                });

        }


        // -------------------------------------------------
        // SEMBUNYIKAN ISI COVER
        // -------------------------------------------------

        if (musicBtn) {
            musicBtn.classList.add("hidden");
        }

        if (musicBtnLabel) {
            musicBtnLabel.classList.add("hidden");
        }

        if (guestWrap) {
            guestWrap.classList.add("hidden");
        }


        // -------------------------------------------------
        // JALANKAN ANIMASI COVER
        // -------------------------------------------------

        if (musicCover) {
            musicCover.classList.add("hide");
        }


        // -------------------------------------------------
        // SETELAH ANIMASI SELESAI
        // -------------------------------------------------

        setTimeout(function () {

            // Sembunyikan cover sepenuhnya
            if (musicCover) {
                musicCover.style.display = "none";
            }

            // Buka scroll
            document.documentElement.classList.remove(
                "no-scroll"
            );

            document.body.classList.remove(
                "no-scroll"
            );

        }, 1200);

    }


    // =====================================================
    // KLIK TOMBOL BUKA UNDANGAN
    // =====================================================

    if (musicBtn) {

        musicBtn.addEventListener(
            "click",
            bukaUndangan,
            {
                once: true
            }
        );

    }


    // =====================================================
    // KONTROL MUSIK PLAY / PAUSE
    // =====================================================

    if (musicControl && musik) {

        musicControl.addEventListener(
            "click",
            function () {

                // Jika musik sedang berhenti
                if (musik.paused) {

                    musik.play()
                        .then(function () {

                            musicControl.classList.remove(
                                "paused"
                            );

                        })
                        .catch(function (error) {

                            console.log(
                                "Musik tidak dapat diputar:",
                                error
                            );

                        });

                } else {

                    // Jika musik sedang berjalan
                    musik.pause();

                    musicControl.classList.add(
                        "paused"
                    );

                }

            }
        );

    }


    // =====================================================
    // SALIN NOMOR REKENING
    // =====================================================

    const tombolSalin =
        document.getElementById("salinRekening");

    const nomorRekening =
        document.getElementById("noRekening");


    if (tombolSalin && nomorRekening) {

        tombolSalin.addEventListener(
            "click",
            async function () {

                // Ambil nomor rekening
                // dan hapus semua spasi
                const nomor =
                    nomorRekening.textContent
                        .replace(/\s/g, "");


                try {

                    // -----------------------------------------
                    // CARA UTAMA: CLIPBOARD API
                    // -----------------------------------------

                    if (
                        navigator.clipboard &&
                        window.isSecureContext
                    ) {

                        await navigator.clipboard.writeText(
                            nomor
                        );

                    } else {

                        // -------------------------------------
                        // FALLBACK UNTUK BROWSER TERTENTU
                        // -------------------------------------

                        const textarea =
                            document.createElement(
                                "textarea"
                            );

                        textarea.value = nomor;

                        textarea.style.position =
                            "fixed";

                        textarea.style.opacity =
                            "0";

                        textarea.style.left =
                            "-9999px";

                        document.body.appendChild(
                            textarea
                        );

                        textarea.focus();
                        textarea.select();

                        const berhasil =
                            document.execCommand(
                                "copy"
                            );

                        document.body.removeChild(
                            textarea
                        );

                        if (!berhasil) {
                            throw new Error(
                                "Copy gagal"
                            );
                        }

                    }


                    // -----------------------------------------
                    // BERHASIL DISALIN
                    // -----------------------------------------

                    const teksAwal =
                        tombolSalin.textContent;

                    tombolSalin.textContent =
                        "Tersalin ✓";


                    setTimeout(function () {

                        tombolSalin.textContent =
                            teksAwal;

                    }, 2000);


                } catch (error) {

                    console.error(
                        "Gagal menyalin:",
                        error
                    );

                    tombolSalin.textContent =
                        "Gagal disalin";


                    setTimeout(function () {

                        tombolSalin.textContent =
                            "Salin";

                    }, 2000);

                }

            }
        );

    }


    // =====================================================
    // HITUNG MUNDUR / COUNTDOWN
    // =====================================================

    const elHari =
        document.getElementById("hari");

    const elJam =
        document.getElementById("jam");

    const elMenit =
        document.getElementById("menit");

    const elDetik =
        document.getElementById("detik");


    // Variabel untuk menyimpan interval
    let countdownInterval;


    function updateCountdown() {

        // Waktu sekarang
        const sekarang = new Date().getTime();

        // Selisih waktu
        const selisih =
            TARGET_TANGGAL - sekarang;


        // -------------------------------------------------
        // JIKA ACARA SUDAH DIMULAI / LEWAT
        // -------------------------------------------------

        if (selisih <= 0) {

            if (elHari) {
                elHari.textContent = "00";
            }

            if (elJam) {
                elJam.textContent = "00";
            }

            if (elMenit) {
                elMenit.textContent = "00";
            }

            if (elDetik) {
                elDetik.textContent = "00";
            }


            // Hentikan countdown
            clearInterval(
                countdownInterval
            );

            return;
        }


        // -------------------------------------------------
        // HITUNG HARI
        // -------------------------------------------------

        const hari = Math.floor(
            selisih /
            (1000 * 60 * 60 * 24)
        );


        // -------------------------------------------------
        // HITUNG JAM
        // -------------------------------------------------

        const jam = Math.floor(
            (
                selisih %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


        // -------------------------------------------------
        // HITUNG MENIT
        // -------------------------------------------------

        const menit = Math.floor(
            (
                selisih %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


        // -------------------------------------------------
        // HITUNG DETIK
        // -------------------------------------------------

        const detik = Math.floor(
            (
                selisih %
                (1000 * 60)
            ) /
            1000
        );


        // -------------------------------------------------
        // TAMPILKAN KE HTML
        // -------------------------------------------------

        if (elHari) {

            elHari.textContent =
                String(hari).padStart(2, "0");

        }

        if (elJam) {

            elJam.textContent =
                String(jam).padStart(2, "0");

        }

        if (elMenit) {

            elMenit.textContent =
                String(menit).padStart(2, "0");

        }

        if (elDetik) {

            elDetik.textContent =
                String(detik).padStart(2, "0");

        }

    }


    // =====================================================
    // JALANKAN COUNTDOWN
    // =====================================================

    // Jalankan langsung saat halaman dibuka
    updateCountdown();

    // Update setiap 1 detik
    countdownInterval = setInterval(
        updateCountdown,
        1000
    );


    // =====================================================
    // ANIMASI ELEMEN SAAT DI-SCROLL
    // =====================================================

    let sudahScroll = false;

    const fadeDownElements = document.querySelectorAll(
        ".hero__konten, " +
        ".pasangan__foto-wrap, .pasangan__konten, " +
        ".detail-acara__judul, .detail-acara__item, .detail-acara__maps, " +
        ".cerita-kami__bingkai, .cerita-kami__judul, " +
        ".ls-entry, " +
        ".rsvp__info, .rsvp__form, .rsvp__note, " +
        ".gift-label, .gift-card, .gift-closing, .gift-footer-logo, " +
        ".hitung-mundur__judul, .hitung-mundur__waktu"
    );

    const fadeDownObserver =
        new IntersectionObserver(
            function (entries, observer) {

                if (!sudahScroll) return;

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -8% 0px"
            }
        );

    fadeDownElements.forEach(function (element) {
        element.classList.add("fade-down");
        fadeDownObserver.observe(element);
    });

    // Konten hero langsung terlihat tanpa menunggu scroll.
    document.querySelectorAll(".hero .fade-down")
        .forEach(function (element) {
            element.classList.add("is-visible");
        });

    window.addEventListener(
        "scroll",
        function () {
            sudahScroll = true;

            fadeDownElements.forEach(function (element) {
                const posisi = element.getBoundingClientRect();
                const terlihat =
                    posisi.top < window.innerHeight * 0.85 &&
                    posisi.bottom > window.innerHeight * 0.08;

                if (terlihat) {
                    element.classList.add("is-visible");
                    fadeDownObserver.unobserve(element);
                }
            });
        },
        { once: true, passive: true }
    );


    // =====================================================
    // TOGGLE CARD YANG BISA MEMANJANG (EXPAND / COLLAPSE)
    // =====================================================

    document.querySelectorAll(".card-embed").forEach(function (card) {

        const trigger =
            card.querySelector(".card-embed__trigger");

        const panel =
            card.querySelector(".card-embed__panel");

        const tombolTutup =
            card.querySelector(".card-embed__close");


        function bukaPanel() {

            panel.classList.add("is-open");

            trigger.setAttribute(
                "aria-expanded",
                "true"
            );

            setTimeout(function () {

                card.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 150);

        }


        function tutupPanel() {

            panel.classList.remove("is-open");

            trigger.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (trigger) {

            trigger.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    const sedangTerbuka =
                        panel.classList.contains(
                            "is-open"
                        );

                    sedangTerbuka ?
                        tutupPanel() :
                        bukaPanel();

                }
            );

        }


        if (tombolTutup) {

            tombolTutup.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    tutupPanel();

                }
            );

        }

    });


    // =====================================================
    // FORM RSVP (KIRIM KE GOOGLE APPS SCRIPT)
    // =====================================================

    const SCRIPT_URL_RSVP =
        "https://script.google.com/macros/s/AKfycbzGU5N76HrEd8nBZ1afu3ziHk5Vh714BPPPqog32EwmPGsLkx5duNzKPJnNq5vFLB9ybA/exec";

    const attendanceGroup =
        document.querySelector(".rsvp__attendance");

    const attendanceInput =
        document.getElementById("attendance");

    let selectedAttendance =
        attendanceInput?.value ||
        attendanceGroup?.querySelector(".rsvp__option.active")?.dataset.value ||
        "";


    if (attendanceGroup) {

        attendanceGroup.addEventListener(
            "click",
            function (e) {

                const tombol =
                    e.target.closest(".rsvp__option");

                if (!tombol || !attendanceGroup.contains(tombol)) return;

                [...attendanceGroup.children].forEach(
                    function (c) {
                        c.classList.remove("active");
                    }
                );

                tombol.classList.add("active");

                selectedAttendance =
                    tombol.dataset.value;

                if (attendanceInput) {
                    attendanceInput.value = selectedAttendance;
                }

            }
        );

    }


    const formRsvp =
        document.getElementById("rsvpForm");

    const tombolKirimRsvp =
        document.getElementById("submitBtn");

    const pesanStatusRsvp =
        document.getElementById("statusMsg");


    if (formRsvp) {

        formRsvp.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                pesanStatusRsvp.classList.remove(
                    "show",
                    "ok",
                    "err"
                );

                const nama =
                    document.getElementById("guestName")
                        .value.trim();

                const ucapan =
                    document.getElementById("wishMessage")
                        .value.trim();


                if (!nama || !selectedAttendance || !ucapan) {

                    pesanStatusRsvp.textContent =
                        "Mohon lengkapi nama, kehadiran, dan ucapan terlebih dahulu.";

                    pesanStatusRsvp.classList.add(
                        "show",
                        "err"
                    );

                    return;

                }


                tombolKirimRsvp.disabled = true;

                tombolKirimRsvp.textContent =
                    "Mengirim...";


                const dataKirim = {
                    name: nama,
                    attendance: selectedAttendance,
                    message: ucapan,
                    timestamp: new Date().toISOString()
                };


                try {

                    await fetch(
                        SCRIPT_URL_RSVP,
                        {
                            method: "POST",
                            mode: "no-cors",
                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },
                            body: JSON.stringify(dataKirim)
                        }
                    );

                    pesanStatusRsvp.textContent =
                        "RSVP berhasil dikirim.";

                    pesanStatusRsvp.classList.add(
                        "show",
                        "ok"
                    );

                    formRsvp.reset();
                    selectedAttendance = "";

                    if (attendanceInput) {
                        attendanceInput.value = "";
                    }

                } catch (error) {

                    pesanStatusRsvp.textContent =
                        "Gagal mengirim. Periksa koneksi atau coba lagi. (" +
                        error.message + ")";

                    pesanStatusRsvp.classList.add(
                        "show",
                        "err"
                    );

                    tombolKirimRsvp.disabled = false;

                    tombolKirimRsvp.textContent =
                        "Kirim RSVP";

                }

            }
        );

    }

});

// Wedding Gift Section - Salin Nomor Rekening
// Kompatibel dengan iOS Safari, Android Chrome, dan browser desktop.

function salinRekening() {
  const rekEl = document.getElementById('rekNumber');
  const btn = document.getElementById('copyBtn');
  const nomor = rekEl.innerText.replace(/\s/g, '');

  copyTeks(nomor)
    .then(() => tampilkanSukses(btn))
    .catch(() => {
      // Jika semua metode gagal, minta pengguna menyalin manual
      alert('Nomor rekening: ' + nomor + '\n\nSilakan salin secara manual.');
    });
}

function copyTeks(teks) {
  // Metode 1: Clipboard API modern (didukung Android Chrome, iOS Safari 13.4+, desktop)
  // Hanya berjalan di konteks aman (HTTPS) atau localhost.
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(teks);
  }

  // Metode 2: Fallback pakai elemen input sementara + execCommand
  // Diperlukan untuk iOS Safari versi lama / halaman non-HTTPS.
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('input');
      input.value = teks;
      input.setAttribute('readonly', '');
      input.classList.add('gift-copy-fallback-input');
      document.body.appendChild(input);

      const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);

      if (isIOS) {
        // iOS butuh setSelectionRange, bukan select() biasa
        input.contentEditable = true;
        input.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(input);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        input.setSelectionRange(0, teks.length);
      } else {
        input.select();
      }

      const berhasil = document.execCommand('copy');
      document.body.removeChild(input);

      berhasil ? resolve() : reject(new Error('execCommand gagal'));
    } catch (err) {
      reject(err);
    }
  });
}

function tampilkanSukses(btn) {
  const teksAsli = btn.innerText;
  btn.innerText = 'Berhasil disalin!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.innerText = teksAsli;
    btn.classList.remove('copied');
  }, 2000);
}