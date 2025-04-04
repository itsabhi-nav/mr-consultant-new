"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session:", error);
      else setSession(data.session);
    }
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => setSession(session)
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-6"
      >
        <div className="backdrop-blur-md bg-white/10 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold mb-6 text-neonBlue">
            Admin Login
          </h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (error) alert(error.message);
            }}
            className="flex flex-col gap-4 w-full max-w-sm"
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-neonBlue text-black font-bold rounded hover:bg-neonBlue/80 transition"
            >
              Login
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4 text-lg">What would you like to edit?</p>
      <div className="flex gap-8">
        <button
          onClick={() => router.push("/admin/projects")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Edit Services
        </button>
        <button
          onClick={() => router.push("/admin/blog")}
          className="px-6 py-3 bg-neonBlue text-black rounded hover:bg-neonBlue/80 transition"
        >
          Edit Blog Posts
        </button>
      </div>
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) console.error("Error signing out:", error);
        }}
        className="mt-8 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-lg"
      >
        Sign Out
      </button>
    </motion.div>
  );
}
