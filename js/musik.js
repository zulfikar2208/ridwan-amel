const musik = document.getElementById("musikLatar");

if (musik) {

    // =========================
    // AMBIL POSISI TERAKHIR
    // =========================
    const posisi = sessionStorage.getItem("posisiMusik");

    if (posisi) {
        musik.currentTime = parseFloat(posisi);
    }

    // =========================
    // SIMPAN POSISI LAGU
    // =========================
    setInterval(() => {
        if (!musik.paused) {
            sessionStorage.setItem(
                "posisiMusik",
                musik.currentTime
            );
        }
    }, 500);

    // =========================
    // SIMPAN SEBELUM PINDAH
    // =========================
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem(
            "posisiMusik",
            musik.currentTime
        );
    });
}