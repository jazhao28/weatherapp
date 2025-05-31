"use client";

import { useEffect, useState } from "react";

interface LocationNewsProps {
  location: string;
  className?: string;
}

interface NewsArticle {
  title: string;
  abstract: string;
  url: string;
  published_date: string;
}

export default function LocationNews({
  location,
  className = "",
}: LocationNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
            location
          )}&api-key=${process.env.NEXT_PUBLIC_NYT_API_KEY}`
        );
        const data = await response.json();

        if (data.response && data.response.docs) {
          setArticles(
            data.response.docs.slice(0, 3).map((doc: any) => ({
              title: doc.headline.main,
              abstract: doc.abstract,
              url: doc.web_url,
              published_date: new Date(doc.pub_date).toLocaleDateString(),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [location]);

  if (isLoading) {
    return (
      <div
        className={`w-full h-[200px] bg-gray-100 rounded-lg animate-pulse ${className}`}
      />
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3">
        Latest News from {location}
      </h3>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h4 className="font-medium text-blue-600 hover:text-blue-800">
              {article.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{article.abstract}</p>
            <p className="text-xs text-gray-500 mt-2">
              {article.published_date}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
