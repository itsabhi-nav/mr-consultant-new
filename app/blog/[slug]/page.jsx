"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";
import CommentsSection from "../components/CommentsSection";
import RelatedPosts from "../components/RelatedPosts";
import ReadingProgress from "../components/ReadingProgress";
import ScrollToTop from "../components/ScrollToTop";
import TableOfContents from "../components/TableOfContents";

export default function SinglePostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) {
        console.error("Error fetching post:", error);
      } else {
        const transformed = {
          ...data,
          coverImage: data.coverimage,
          isFeatured: data.isfeatured,
          date: new Date(data.created_at).toLocaleDateString(),
        };
        setPost(transformed);
      }
      setLoading(false);
    }
    if (slug) fetchPost();
  }, [slug]);

  const handleLike = async () => {
    if (!post) return;
    setLikeLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .update({ likes: post.likes + 1 })
      .eq("id", post.id)
      .select();
    if (error) {
      console.error("Error updating likes:", error);
    } else if (data && data.length > 0) {
      setPost((prev) => ({ ...prev, likes: data[0].likes }));
    }
    setLikeLoading(false);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url: shareUrl });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-red-500">Post not found!</h2>
      </div>
    );
  }

  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <button
          onClick={() => router.push("/blog")}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
        >
          Back to Blog
        </button>
        <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <TableOfContents content={post.content} />
        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-extrabold mb-2 glow">{post.title}</h1>
          <p className="text-sm opacity-70 mb-4">
            Published on {post.date} · {readTime} min read
          </p>
          <div
            className="leading-7"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        {/* Gallery Section */}
        {post.gallery &&
          Array.isArray(post.gallery) &&
          post.gallery.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {post.gallery.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-auto rounded shadow-md"
                  />
                ))}
              </div>
            </div>
          )}
        {post.author && (
          <div className="flex items-center gap-4 bg-black bg-opacity-50 p-4 rounded-xl">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h4 className="font-bold text-lg">{post.author.name}</h4>
              <p className="text-sm opacity-80">{post.author.bio}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="bg-neonBlue text-black px-4 py-2 rounded hover:opacity-80 transition"
          >
            Like {post.likes ? `(${post.likes})` : ""}
          </button>
          <button
            onClick={handleShare}
            className="border border-neonBlue px-4 py-2 rounded hover:bg-neonBlue hover:text-black transition"
          >
            Share
          </button>
        </div>
        <RelatedPosts currentPostId={post.id} category={post.category} />
        <CommentsSection postId={post.id} />
      </motion.div>
    </>
  );
}
