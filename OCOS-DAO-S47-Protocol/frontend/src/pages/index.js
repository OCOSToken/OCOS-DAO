import React from "react";

export default function IndexPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-10 mt-24 mb-12 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-sky-400 mb-3 text-center drop-shadow-lg">
          OCOS DAO — S47 Legacy Protocol
        </h1>
        <p className="text-xl text-gray-200 font-medium text-center max-w-lg mt-2 mb-6">
          The fate of <span className="font-bold text-sky-300">1.1 million S47</span> rests in the hands of a global DAO.<br />
          <span className="italic text-gray-400">
            Decentralized. Immutable. Community-governed.
          </span>
        </p>
        <div className="w-full flex flex-col items-center mb-7">
          <a
            href="/voting"
            className="px-8 py-3 rounded-xl bg-sky-600 font-semibold shadow-lg hover:bg-sky-800 text-lg transition-all"
          >
            Enter DAO Voting
          </a>
          <span className="mt-4 text-gray-400 text-sm">Connect your wallet to participate</span>
        </div>
        <div className="w-full flex flex-col items-center bg-gray-900/50 border border-gray-800 rounded-lg p-5 mt-4">
          <h2 className="text-xl font-semibold text-sky-300 mb-2">Protocol Overview</h2>
          <ul className="text-gray-200 text-base list-disc pl-6 space-y-1">
            <li>1,100,000 S47 in on-chain vault</li>
            <li>1,000,000,000 OCOS tokens ($47 fixed price, no inflation)</li>
            <li>47,000 Tale Wallets — each voted by the community</li>
            <li>All votes and flows are transparent, visible and auditable on-chain</li>
          </ul>
        </div>
        <blockquote className="mt-7 text-gray-400 italic border-l-4 border-sky-500 pl-4 text-base">
          “The fate of 1.1 million S47 is in your hands. Decide wisely.”<br />
          <span className="text-sky-400 font-bold">— S470SHI</span>
        </blockquote>
      </div>
      <footer className="text-gray-500 text-xs mt-6 mb-2">
        &copy; {new Date().getFullYear()} OCOS DAO. Powered by the community.
      </footer>
    </main>
  );
}
