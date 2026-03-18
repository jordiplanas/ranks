const TOKEN = "2v7k141f3zIWKosOjtHUYdaiUbBqI6g6";
const BASE_URL = "https://cupra.metaversotechnologies.com/score/";
const BLOQUE_ACTUAL = "electrification"; // Cámbialo según necesites

const Helpers = {
    getOrdinal: (n) => {
        const s = ["TH", "ST", "ND", "RD"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    slugify: (text) => text.toLowerCase().replace(/\s+/g, "-").trim(),
    getDisplayName: (name) => {
        const codes = { 
       es: "Spain", de: "Germany", fr: "France", it: "Italy", 
gb: "United Kingdom", mx: "Mexico", ro: "Romania", 
pl: "Poland", pt: "Portugal", ch: "Switzerland", 
at: "Austria", be: "Belgium", nl: "Netherlands", 
se: "Sweden", dk: "Denmark", no: "Norway", 
fi: "Finland", cz: "Czech Republic", ie: "Ireland",
tr: "Turkey", gr: "Greece", hu: "Hungary", au: "Australia",
hr: "Croatia", ma: "Morocco", co: "Colombia"
        };
        const code = name.toLowerCase().trim();
        return codes[code] || name;
    }
};

/**
 * LÓGICA PRINCIPAL
 */
document.addEventListener("DOMContentLoaded", async () => {
    const preloader = document.getElementById("preloader");
    const topContainer = document.getElementById("ranking-mercados");

    try {
        const response = await fetch(BASE_URL + BLOQUE_ACTUAL, {
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        const data = await response.json();

        // 1. Agrupar y procesar datos
        const countryStats = {};
        data.forEach(entry => {
            const country = entry.country || "N/A";
            const score = parseFloat(entry.score || 0);
            if (!countryStats[country]) {
                countryStats[country] = { name: country, totalScore: 0, count: 0 };
            }
            countryStats[country].totalScore += score;
            countryStats[country].count++;
        });

        // 2. Crear lista ordenada por media
        const list = Object.values(countryStats)
            .map(c => ({
                name: c.name,
                avgScore: (c.totalScore / c.count).toFixed(1),
                count: c.count
            }))
            .sort((a, b) => b.avgScore - a.avgScore);

        topContainer.innerHTML = list.slice(0, 3).map((item, i) => {
    const pos = i + 1;
    
    // 1. Usamos el código original (es, fr, ro) para buscar el archivo .svg
    const countryCode = item.name.toLowerCase().trim(); 
    
    // 2. Ruta corregida para GitHub Pages (incluyendo el nombre del repo /ranks/)
    const iconPath = `url('/ranks/assets/flags/${countryCode}.svg')`;
    
    // 3. Usamos la traducción para el texto (Romania en lugar de ro)
    const displayName = Helpers.getDisplayName(item.name);

    return `
        <div class="c-ranking__item position-${pos}">
            <div class="c-ranking__flag">
                <div class="c-flag" style="--bg-flag: ${iconPath};"></div>
            </div>
            <div class="c-ranking__position">${Helpers.getOrdinal(pos)}</div>
            <div class="c-ranking__name">${displayName}</div>
            <div class="c-ranking__num">${item.count} participantes</div>
            <div class="c-ranking__points">${item.avgScore} PTS</div>
        </div>`;
}).join("");

    } catch (e) {
        console.error("Error en el Dashboard:", e);
        if (topContainer) topContainer.innerHTML = "<p>Error al cargar datos.</p>";
    } finally {
        if (preloader) {
            preloader.classList.add("c-preloader--hidden");
        }
    }
});
