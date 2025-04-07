"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "lib/supabaseClient";
import Head from "next/head";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  MessageCircleMoreIcon,
  MapPin,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetails() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProps, setSimilarProps] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMap, setShowMap] = useState(false);
  // For the gallery carousel
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    async function fetchData() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) {
        setProperty(data);
        setIsBookmarked(localStorage.getItem(data.slug) === "bookmarked");

        const { data: similar } = await supabase
          .from("properties")
          .select("*")
          .neq("slug", slug)
          .eq("propertytype", data.propertytype)
          .limit(3);
        setSimilarProps(similar || []);
      } else {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, [slug]);

  const toggleBookmark = () => {
    if (!property) return;
    const current = localStorage.getItem(property.slug);
    if (current === "bookmarked") {
      localStorage.removeItem(property.slug);
      setIsBookmarked(false);
    } else {
      localStorage.setItem(property.slug, "bookmarked");
      setIsBookmarked(true);
    }
  };

  // Gallery navigation functions
  const nextGallery = () => {
    if (property && property.gallery_images?.length) {
      setCurrentGalleryIndex(
        (prevIndex) => (prevIndex + 1) % property.gallery_images.length
      );
    }
  };

  const prevGallery = () => {
    if (property && property.gallery_images?.length) {
      setCurrentGalleryIndex(
        (prevIndex) =>
          (prevIndex - 1 + property.gallery_images.length) %
          property.gallery_images.length
      );
    }
  };

  if (!property)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <>
      <Head>
        <title>{property.title} | Property Details</title>
        <meta
          name="description"
          content={`Explore ${property.title} at ${property.address}.`}
        />
        <meta property="og:title" content={property.title} />
        <meta property="og:description" content={property.address} />
        <meta
          property="og:image"
          content={property.main_image?.url || "/default.jpg"}
        />
      </Head>

      {/* Outer Container with 20px Top Margin */}
      <div className="mt-[20px] min-h-screen relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-30 blur-3xl animate-tilt"></div>
        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
            {/* Header: Main Image with Overlay Buttons */}
            <div className="relative">
              {property.main_image?.url ? (
                <motion.div
                  className="w-full h-96 flex items-center justify-center bg-gray-100"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <img
                    src={property.main_image.url}
                    alt={property.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-96 bg-gray-300 flex items-center justify-center text-gray-700">
                  No Image Available
                </div>
              )}
              {/* Bookmark Button */}
              <motion.button
                onClick={toggleBookmark}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-white/80 p-3 rounded-full shadow-lg"
                aria-label="Toggle Bookmark"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-6 h-6 text-blue-600" />
                ) : (
                  <Bookmark className="w-6 h-6 text-blue-600" />
                )}
              </motion.button>
              {/* Inquire Button */}
              <motion.a
                href={`https://wa.me/918310360414?text=Hi, I'm interested in "${property.title}" listed on your site.`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-4 left-4 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <MessageCircleMoreIcon className="w-5 h-5" />
                  <span>Inquire via WhatsApp</span>
                </div>
              </motion.a>
            </div>

            {/* Property Summary */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-gray-800"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {property.title}
                </motion.h1>
                <motion.div
                  className="mt-4 md:mt-0 flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{property.address}</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {property.price}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Main Content: Details & Description */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Property Details & Agent Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Property Details
                  </h2>
                  <ul className="mt-4 space-y-2 text-gray-700">
                    <li>
                      <strong>Bedrooms:</strong> {property.bedrooms || "N/A"}
                    </li>
                    <li>
                      <strong>Bathrooms:</strong> {property.bathrooms || "N/A"}
                    </li>
                    <li>
                      <strong>Area:</strong> {property.area || "N/A"}
                    </li>
                    <li>
                      <strong>Type:</strong> {property.propertytype || "N/A"}
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Agent Information
                  </h2>
                  <div className="mt-4 text-gray-700">
                    <p>
                      <strong>{property.agentname || "N/A"}</strong>
                    </p>
                    <p>Phone: {property.agentphone || "N/A"}</p>
                    <p>Email: {property.agentemail || "N/A"}</p>
                  </div>
                </div>
              </div>
              {/* Right Column: Description & Features */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Description
                  </h2>
                  <p className="mt-4 text-gray-700">
                    {property.description || "No description available."}
                  </p>
                </div>
                {property.features && property.features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Features
                    </h2>
                    <ul className="mt-4 list-disc list-inside text-gray-700">
                      {property.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Section: Gallery Carousel and Map Side by Side */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-gray-200">
              {/* Gallery Carousel */}
              {property.gallery_images &&
                property.gallery_images.length > 0 && (
                  <div className="relative">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Gallery
                    </h2>
                    <motion.div
                      className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg shadow-md overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={property.gallery_images[currentGalleryIndex].url}
                        alt={`Gallery Image ${currentGalleryIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </motion.div>
                    {/* Left Arrow */}
                    <button
                      onClick={prevGallery}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                      aria-label="Previous Image"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    {/* Right Arrow */}
                    <button
                      onClick={nextGallery}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                      aria-label="Next Image"
                    >
                      <ArrowRight className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                )}
              {/* Map */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Location
                </h2>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      property.address
                    )}&output=embed`}
                    allowFullScreen
                    title="Property Location"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            {similarProps.length > 0 && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Similar Properties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarProps.map((prop) => (
                    <Link
                      key={prop.slug}
                      href={`/buy-sell/${prop.slug}`}
                      className="block bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-xl transition"
                    >
                      {prop.main_image?.url ? (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                          <img
                            src={prop.main_image.url}
                            alt={prop.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-700">
                          No Image
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800">
                          {prop.title}
                        </h3>
                        <p className="text-sm text-gray-600">{prop.address}</p>
                        <p className="mt-2 font-semibold text-green-600">
                          {prop.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Listings */}
            <div className="p-6">
              <Link href="/buy-sell" className="text-blue-600 hover:underline">
                ← Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
