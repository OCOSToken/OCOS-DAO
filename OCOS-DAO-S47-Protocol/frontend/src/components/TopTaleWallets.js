// TopTaleWallets.js
import React from "react";

export default function TopTaleWallets({ wallets, onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-sky-400 tracking-tight">
        Top Tale Wallets Leaderboard
      </h2>
      <div className="grid grid-cols-1 divide-y divide-gray-700">
        {wallets.slice(0, 10).map((wallet, idx) => (
          <div
            key={wallet.id}
            className={`flex items-center justify-between py-4 px-3 transition group hover:bg-sky-950 cursor-pointer rounded-xl ${
              idx === 0 ? "bg-gradient-to-r from-sky-600 to-sky-900 text-white shadow-lg" : ""
            }`}
            onClick={() => onSelect && onSelect(wallet.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-sky-300 w-8 text-center">
                #{idx + 1}
              </span>
              <span className="font-mono font-semibold text-lg">
                Wallet #{wallet.id}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg">
                {wallet.voteCount.toLocaleString()} Votes
              </span>
              <span className="text-sky-400 text-sm">
                {wallet.s47Balance} S47
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right mt-2 text-xs text-gray-400">
        Data updates in real time.
      </div>
    </div>
  );
}
