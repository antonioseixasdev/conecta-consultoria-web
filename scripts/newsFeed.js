const SHEET_ID = '1Tjxryqg-54guASDGD_yzejiuMbpE8c0TsLTVpqNGQtE'; // ID correto da sua planilha
const SHEET_NAME = 'FEEDSXS'; // Nome da aba
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

function formatDate(dateValue) {
  // Se vier como string, tenta converter direto
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    if (!isNaN(date)) return date.toLocaleDateString('pt-BR');
  }
  // Se vier como número (serial do Google Sheets)
  if (typeof dateValue === 'number') {
    // Google Sheets: dias desde 1899-12-30
    const baseDate = new Date(Date.UTC(1899, 11, 30));
    baseDate.setUTCDate(baseDate.getUTCDate() + dateValue);
    return baseDate.toLocaleDateString('pt-BR');
  }
  return dateValue || '';
}

async function fetchNews() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  const rows = json.table.rows;
  return rows.map(row => ({
    title: row.c[0]?.v,
    date: row.c[1]?.v,
    source: row.c[2]?.v,
    category: row.c[3]?.v,
    summary: row.c[4]?.v,
  }));
}

export async function renderNewsFeed(containerId) {
  const container = document.getElementById(containerId);
  const news = await fetchNews();
  container.innerHTML = news.map(item => `
    <article class="news-item">
      <h3>${item.title}</h3>
      <div class="news-meta">
        <time>${formatDate(item.date)}</time>
        <span class="news-category">${item.category}</span>
        <span class="news-source">${item.source}</span>
      </div>
      <p>${item.summary}</p>
    </article>
  `).join('');
}