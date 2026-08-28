const musik = document.getElementById("musikLatar");

if (musik) {

    // Ambil posisi terakhir
    const posisiTerakhir = localStorage.getItem("posisiMusik");

    if (posisiTerakhir) {
        musik.currentTime = parseFloat(posisiTerakhir);
    }

    // Simpan posisi lagu setiap 1 detik
    setInterval(() => {
        if (!musik.paused) {
            localStorage.setItem(
                "posisiMusik",
                musik.currentTime
            );
        }
    }, 1000);

    // Simpan juga sebelum pindah halaman
    window.addEventListener("beforeunload", () => {
        localStorage.setItem(
            "posisiMusik",
            musik.currentTime
        );
    });

    // Coba lanjutkan musik
    musik.play().catch(() => {
        console.log("Menunggu interaksi pengguna untuk memutar musik.");
    });
}