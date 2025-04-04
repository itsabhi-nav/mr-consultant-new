import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set in your .env.local
  api_key: process.env.CLOUDINARY_API_KEY, // Set in your .env.local
  api_secret: process.env.CLOUDINARY_API_SECRET, // Set in your .env.local
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    // Convert file to base64 string
    const buffer = await file.arrayBuffer();
    const base64data = Buffer.from(buffer).toString("base64");
    const fileData = `data:${file.type};base64,${base64data}`;

    // Upload the file to Cloudinary with auto compression transformation
    const result = await cloudinary.uploader.upload(fileData, {
      folder: "projects",
      transformation: [
        {
          quality: "auto:good", // Auto compress with good quality
          fetch_format: "auto", // Convert to an optimal format (e.g., WebP)
        },
      ],
    });

    return new Response(
      JSON.stringify({ url: result.secure_url, public_id: result.public_id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return new Response("Upload failed", { status: 500 });
  }
}
