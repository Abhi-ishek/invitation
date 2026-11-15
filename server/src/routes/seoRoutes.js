import { Router } from 'express';
import { Product } from '../models/Product.js';

const router = Router();
const BASE_URL = process.env.CLIENT_URL || 'https://weddingwishcraft.com';

function escapeXml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// GET /sitemap.xml (dynamic sitemap directly from MongoDB Atlas)
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }, 'slug title description thumbnail previewVideo updatedAt').lean();
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

    for (const p of products) {
      const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today;
      xml += `  <url>
    <loc>${BASE_URL}/product/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
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

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Allow: /shop
Allow: /product/
Allow: /catalog
Allow: /about
Allow: /contact

Disallow: /checkout
Disallow: /cart
Disallow: /customize-order/
Disallow: /order-customization/
Disallow: /order-success/
Disallow: /track
Disallow: /wishlist
Disallow: /my-orders
Disallow: /payments
Disallow: /login
Disallow: /register
Disallow: /admin
Disallow: /api/

Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.status(200).send(robots);
});

export default router;

