const fs = require("fs");
const path = require("path");

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = (req, res) => {

    const namaTamu =
        req.query.to || "Bapak/Ibu/Saudara/i";

    const namaAman = escapeHtml(namaTamu);

    const filePath = path.join(
        process.cwd(),
        "index.html"
    );

    let html = fs.readFileSync(
        filePath,
        "utf8"
    );

    // =========================
    // PERBAIKI PATH ASSET
    // =========================

    html = html.replace(
        /href="\.\/style\//g,
        'href="/style/'
    );

    html = html.replace(
        /src="\.\/img\//g,
        'src="/img/'
    );

    html = html.replace(
        /src="\.\/audio\//g,
        'src="/audio/'
    );

    html = html.replace(
        /src="\.\/js\//g,
        'src="/js/'
    );

    html = html.replace(
        /href="\.\/([^"]+\.html)"/g,
        'href="/$1"'
    );

    // =========================
    // OPEN GRAPH
    // =========================

    const metaTags = `
        <meta property="og:type" content="website">

        <meta property="og:title"
              content="The Wedding of Amel & Ridwan">

        <meta property="og:description"
              content="Kepada Yth. ${namaAman} — Undangan Pernikahan Amel & Ridwan">

        <meta property="og:image"
              content="https://ridwan-amel.vercel.app/img/isii.webp">

        <meta property="og:url"
              content="https://ridwan-amel.vercel.app/?to=${encodeURIComponent(namaTamu)}">

        <meta name="twitter:card"
              content="summary_large_image">

        <meta name="twitter:title"
              content="The Wedding of Amel & Ridwan">

        <meta name="twitter:description"
              content="Kepada Yth. ${namaAman}">

        <meta name="twitter:image"
              content="https://ridwan-amel.vercel.app/img/isii.webp">
    `;

    html = html.replace(
        "</head>",
        metaTags + "\n</head>"
    );

    res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
    );

    res.status(200).send(html);
};