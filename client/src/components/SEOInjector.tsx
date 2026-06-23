import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://www.lotlitesiec.com';

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEOInjector() {
  const location = useLocation();

  // Keep canonical in sync with the current route
  useEffect(() => {
    const canonical = `${BASE_URL}${location.pathname}`;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // Keep OG URL in sync too
    setMeta('og:url', canonical, true);
  }, [location.pathname]);

  // Fetch admin-configured global SEO overrides (title, description, keywords)
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/website-data/seo`);
        if (!res.ok) return;
        const json = await res.json();
        if (!json.data) return;
        const { title, description, keywords } = json.data;
        if (title) document.title = title;
        if (description) setMeta('description', description);
        if (keywords) setMeta('keywords', keywords);
      } catch (e) {
        console.error('Failed to fetch global SEO data', e);
      }
    };
    fetchSEO();
  }, []);

  return null;
}
