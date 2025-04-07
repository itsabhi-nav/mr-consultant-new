import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicIdFromUrl(url) {
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const publicIdWithExt = parts[1];
  const dotIndex = publicIdWithExt.lastIndexOf(".");
  return dotIndex !== -1
    ? publicIdWithExt.substring(0, dotIndex)
    : publicIdWithExt;
}

export async function POST(req) {
  try {
    const { gallery } = await req.json();
    const results = {};

    if (gallery && Array.isArray(gallery)) {
      results.gallery = [];
      for (const imgUrl of gallery) {
        const publicId = getPublicIdFromUrl(imgUrl);
        if (publicId) {
          const res = await cloudinary.uploader.destroy(publicId);
          results.gallery.push(res);
        }
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    return new Response("Error deleting images", { status: 500 });
  }
}
