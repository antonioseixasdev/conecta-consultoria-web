const SHEET_ID = '1Tjxryqg-54guASDGD_yzejiuMbpE8c0TsLTVpqNGQtE'; // ID correto da sua planilha
const SHEET_NAME = 'FEEDSXS'; // Nome da aba
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

function formatDate(dateValue, dateFormatted) {
  // Prioriza o formato exibido na planilha, se existir
  if (dateFormatted) return dateFormatted;
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    if (!isNaN(date)) return date.toLocaleDateString('pt-BR');
  }
  if (typeof dateValue === 'number') {
    const msPerDay = 24 * 60 * 60 * 1000;
    const baseDate = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(baseDate.getTime() + dateValue * msPerDay);
    return date.toLocaleDateString('pt-BR');
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
    dateFormatted: row.c[1]?.f, // pega o formato exibido na planilha
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
        <time>${formatDate(item.date, item.dateFormatted)}</time>
        <span class="news-category">${item.category}</span>
        <span class="news-source">${item.source}</span>
      </div>
      <p>${item.summary}</p>
    </article>
  `).join('');
}