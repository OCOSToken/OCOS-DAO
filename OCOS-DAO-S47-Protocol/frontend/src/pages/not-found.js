import React from "react";
import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-12 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-6xl font-extrabold mb-4 text-pink-400">404</h1>
        <h2 className="text-2xl font-bold mb-2 text-white">Page Not Found</h2>
        <p className="mb-6 text-gray-400 text-center">
          The page you’re looking for doesn’t exist on OCOS-DAO.<br />
          Maybe it was voted out by the community — or never existed!
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-pink-500 px-8 py-3 rounded-xl text-white font-semibold hover:bg-pink-700 transition"
        >
          Go Home
        </button>
        <div className="text-xs text-gray-500 mt-8 border-t border-gray-800 pt-4">
          <span className="font-semibold text-pink-300">OCOS-DAO</span> – Community first. Transparency always.
        </div>
      </div>
    </div>
  );
}
