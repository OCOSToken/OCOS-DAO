// Loader.js
import React from "react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-sky-500 border-b-sky-500 border-l-transparent border-r-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-sky-900 opacity-40 animate-spin-slow"></div>
        <div className="absolute inset-4 bg-sky-500 rounded-full opacity-60"></div>
      </div>
      <div className="mt-6 text-lg font-semibold text-sky-400 animate-pulse">
        {text}
      </div>
    </div>
  );
}

// Custom slow spin animation (add in Tailwind config if needed)
/*
module.exports = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2.5s linear infinite',
      },
    },
  },
}
*/
