import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("File received:", file.name, file.type, file.size); // Debug

    // Convert file to base64 string
    const buffer = await file.arrayBuffer();
    const base64data = Buffer.from(buffer).toString("base64");
    const fileData = `data:${file.type};base64,${base64data}`;

    // Upload to Cloudinary with auto compression
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(fileData, {
      folder: "properties",
      transformation: [{ quality: "auto:good", fetch_format: "auto" }],
    });

    console.log("Upload successful:", result); // Debug
    return new Response(
      JSON.stringify({ url: result.secure_url, public_id: result.public_id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error.message, error);
    return new Response(
      JSON.stringify({
        error: "Failed to upload image",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
