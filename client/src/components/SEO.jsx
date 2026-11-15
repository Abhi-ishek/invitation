import { useEffect } from 'react';

const DEFAULT_TITLE = 'Wedding Wishcraft | Luxury 3D AI & Royal Wedding Invitation Videos';
const DEFAULT_DESC =
  'Create personalized 4K wedding invitation videos in 24 hours. Choose from 57+ luxury themes: hyper-realistic 3D AI couple avatars, royal palace mandaps, traditional Hindi Shubh Vivah, and whimsical animated love stories starting at ₹300.';
const BASE_URL = 'https://weddingwishcraft.com';
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/vrljkq9h/video/upload/c_scale,f_auto,q_auto,so_1,w_1200,h_630,c_fill/Sample_1.jpg';

function updateMetaTag(selector, attrName, attrValue, content) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLinkTag(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export default function SEO({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonicalUrl,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | Wedding Wishcraft` : DEFAULT_TITLE;
  const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : `${BASE_URL}${window.location.pathname}`;

  useEffect(() => {
    // 1. Document Title
    document.title = fullTitle;

    // 2. Primary Meta Tags
    updateMetaTag('meta[name="title"]', 'name', 'title', fullTitle);
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }

    // 3. Robots
    const robotsContent = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    updateMetaTag('meta[name="robots"]', 'name', 'robots', robotsContent);

    // 4. Canonical
    updateLinkTag('canonical', fullCanonical);

    // 5. Open Graph
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonical);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', image);

    // 6. Twitter
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    updateMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', fullCanonical);

    // 7. Dynamic JSON-LD Structured Data
    const SCRIPT_ID = 'dynamic-seo-jsonld';
    let scriptElement = document.getElementById(SCRIPT_ID);

    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = SCRIPT_ID;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.text = JSON.stringify(jsonLd);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Clean up dynamic JSON-LD on unmount
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) existingScript.remove();
    };
  }, [fullTitle, description, keywords, fullCanonical, image, type, noindex, jsonLd]);

  return null;
}

