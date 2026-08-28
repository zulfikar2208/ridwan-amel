let linkHasil = "";
let waLink = "";

// Kapital awal tiap kata
function capitalizeNama(nama) {
  return nama
    .toLowerCase()
    .replace(/\b\w/g, h => h.toUpperCase());
}

// Build template pesan
function buildPesan(nama, link) {
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Tanpa mengurangi rasa hormat, izinkan kami membagikan kabar bahagia pernikahan putra-putri kami: Amel dan Ridwan

Kepada Yth.
${nama}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Detail lengkap acara dapat dilihat melalui tautan undangan digital berikut:
${link}

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
}

function generateLink() {
  let nama = document.getElementById("nama").value.trim();

  if (!nama) {
    alert("Masukkan nama tamu dulu!");
    return;
  }

  nama = capitalizeNama(nama);
  const encodedNama = encodeURIComponent(nama);

  linkHasil = `https://ridwan-amel.vercel.app/?to=${encodedNama}`;
  document.getElementById("hasil").innerText = linkHasil;

  const pesan = buildPesan(nama, linkHasil);
  document.getElementById("templatePesan").value = pesan;

  waLink = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
}

function copyLink() {
  const link = document.getElementById("hasil").innerText;
  if (!link || link === "Link akan muncul di sini") {
    alert("Buat link dulu!");
    return;
  }
  copyToClipboard(link, "Link berhasil disalin!");
}

function kirimWhatsapp() {
  if (!waLink) {
    alert("Generate dulu!");
    return;
  }
  window.open(waLink, "_blank");
}

function copyPesan() {
  const pesan = document.getElementById("templatePesan").value;
  if (!pesan) {
    alert("Pesan belum dibuat!");
    return;
  }
  copyToClipboard(pesan, "Pesan berhasil disalin!");
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => alert(successMsg))
      .catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "0";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  textarea.setAttribute("readonly", "");
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, 999999);

  let berhasil = false;
  try { berhasil = document.execCommand("copy"); } catch (e) {}

  document.body.removeChild(textarea);
  alert(berhasil ? successMsg : "Gagal menyalin, copy manual ya.");
}