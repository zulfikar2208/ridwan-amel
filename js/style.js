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

});