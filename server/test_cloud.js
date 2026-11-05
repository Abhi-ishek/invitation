import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Testing Cloudinary Cloud Name:', cloudinary.config().cloud_name);

async function run() {
  try {
    const res = await cloudinary.api.resources({ resource_type: 'video', max_results: 100 });
    console.log('Total videos found:', res.resources.length);
    res.resources.forEach((r, idx) => {
      console.log(`${idx + 1}. public_id: "${r.public_id}" | format: "${r.format}" | duration: ${r.duration} | url: "${r.secure_url}"`);
    });
  } catch (err) {
    console.error('Error fetching videos:', err);
  }
}

run();

