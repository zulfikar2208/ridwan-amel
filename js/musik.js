const musik = document.getElementById("musikLatar");

if (musik) {

    // Ambil posisi lagu sebelumnya
    const posisiTerakhir = sessionStorage.getItem("posisiMusik");

    if (posisiTerakhir !== null) {
        musik.currentTime = parseFloat(posisiTerakhir);
    }

    // Simpan posisi lagu setiap 500ms
    setInterval(() => {
        if (!musik.paused) {
            sessionStorage.setItem(
                "posisiMusik",
                musik.currentTime
            );
        }
    }, 500);

    // Simpan ketika meninggalkan halaman
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem(
            "posisiMusik",
            musik.currentTime
        );
    });

    // Ketika halaman dibuka, coba lanjutkan
    musik.play().catch(() => {
        // Browser bisa memblokir autoplay
    });
}