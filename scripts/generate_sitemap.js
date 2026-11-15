import { ALL_57_PRODUCTS } from '../server/src/syncCloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://weddingwishcraft.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/shop', priority: '0.9', changefreq: 'daily' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/shop?category=3D%20AI%20Invitation', priority: '0.8', changefreq: 'weekly' },
  { loc: '/shop?category=Royal%20Traditional', priority: '0.8', changefreq: 'weekly' },
  { loc: '/shop?category=Caricature%20%26%20Save%20The%20Date', priority: '0.8', changefreq: 'weekly' },
  { loc: '/shop?category=Minimal%20%26%20Modern', priority: '0.7', changefreq: 'weekly' },
  { loc: '/shop?category=Muslim%20Invitations', priority: '0.7', changefreq: 'weekly' },
  { loc: '/shop?category=South%20Indian', priority: '0.7', changefreq: 'weekly' },
  { loc: '/shop?category=Custom%20Designs', priority: '0.7', changefreq: 'weekly' },
];

function escapeXml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

for (const p of staticPages) {
  xml += `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
}

for (const p of ALL_57_PRODUCTS) {
  xml += `  <url>
    <loc>${BASE_URL}/product/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
  if (p.thumbnail) {
    xml += `    <image:image>
      <image:loc>${p.thumbnail}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
    </image:image>
`;
  }
  if (p.previewVideo) {
    xml += `    <video:video>
      <video:thumbnail_loc>${p.thumbnail}</video:thumbnail_loc>
      <video:title>${escapeXml(p.title)}</video:title>
      <video:description>${escapeXml(p.description)}</video:description>
      <video:content_loc>${p.previewVideo}</video:content_loc>
    </video:video>
`;
  }
  xml += `  </url>
`;
}

xml += `</urlset>
`;

const dest = path.resolve(__dirname, '../client/public/sitemap.xml');
fs.writeFileSync(dest, xml, 'utf8');
console.log(`✨ Generated sitemap at ${dest} with ${staticPages.length + ALL_57_PRODUCTS.length} URLs!`);

