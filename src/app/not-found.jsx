"use client";

import React from "react";
import Link from "next/link"; // or 'react-router-dom' if using plain React
import { motion } from "framer-motion";
import { MoveLeft, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-white overflow-hidden text-slate-900 selection:bg-indigo-100 selection:text-indigo-600">
      
      {/* Background Decor Elements (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-50/50 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-50/50 blur-[100px]" />

      <div className="z-10 container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Animated 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-black text-[150px] leading-none text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-blue-500 select-none md:text-[200px]"
        >
          404
        </motion.h1>

        {/* Subtitle & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 space-y-4"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Page not found
          </h2>
          <p className="max-w-md text-lg text-slate-600">
            {/* FIX IS HERE: Replaced ' with &apos; */}
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:ring-4 hover:ring-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Go Back
          </button>
        </motion.div>
      </div>
      
      {/* Footer minimal credit or help link */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-sm text-slate-400"
      >
        Need help? <a href="/contact" className="hover:text-indigo-600 transition-colors">Contact Support</a>
      </motion.div>

    </div>
  );
};

export default NotFound;