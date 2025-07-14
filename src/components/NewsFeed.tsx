import React, { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  date: string;
  dateFormatted?: string;
  source: string;
  category: string;
  summary: string;
};

const SHEET_ID = "1Tjxryqg-54guASDGD_yzejiuMbpE8c0TsLTVpqNGQtE";
const SHEET_NAME = "FEEDSXS";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

export const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        try {
          const json = JSON.parse(text.substr(47).slice(0, -2));
          const rows = json.table.rows || [];
          setNews(
            rows.map((row: any) => ({
              title: row.c[0]?.v || "",
              date: row.c[1]?.v || "",
              dateFormatted: row.c[1]?.f || "",
              source: row.c[2]?.v || "",
              category: row.c[3]?.v || "",
              summary: row.c[4]?.v || "",
            }))
          );
        } catch (e) {
          setError("Erro ao processar dados das notícias.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar notícias.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: "center"}}>Carregando notícias...</div>;
  if (error) return <div style={{color: "red", textAlign: "center"}}>{error}</div>;

  return (
    <section
      style={{
        maxWidth: 750,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
        padding: "2rem",
        maxHeight: 550,
        overflowY: "auto",
        fontSize: "2rem",
        fontWeight: "bold",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Notícias</h2>
      <div id="news-feed">
        {news.map((item, idx) => (
          <article
            className="news-item"
            key={idx}
            style={{ borderBottom: "1px solid #eee", padding: "1.2rem 0" }}
          >
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#0ea5e9" }}>{item.title}</h3>
            <div
              className="news-meta"
              style={{
                color: "#888",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
                display: "flex",
                gap: "1.5rem",
              }}
            >
              <time>{item.dateFormatted || item.date}</time>
              <span className="news-category" style={{ fontWeight: "bold", color: "#f59e42" }}>
                {item.category}
              </span>
              <span className="news-source" style={{ fontStyle: "italic" }}>
                {item.source}
              </span>
            </div>
            <p style={{ margin: "0.5rem 0 0 0", color: "#222" }}>{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
};