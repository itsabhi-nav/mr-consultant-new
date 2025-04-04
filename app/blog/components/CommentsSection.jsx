"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  async function handleAddComment() {
    if (!newComment.trim()) return;
    const { error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, author: "Anonymous", content: newComment }]);
    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setNewComment("");
      fetchComments();
    }
  }

  return (
    <div className="mt-8 bg-black bg-opacity-50 p-4 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neonBlue"></div>
        </div>
      ) : (
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 border-b border-gray-700 pb-2"
            >
              <p className="text-neonBlue font-bold">{comment.author}</p>
              <p className="text-sm">{comment.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 bg-black bg-opacity-40 border border-neonBlue rounded px-3 py-2 focus:outline-none"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-neonBlue text-black px-4 py-2 rounded hover:opacity-80 transition"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
