import React, { useState, useMemo } from "react";

const PAGE_SIZE = 100;

export default function TaleWalletsList({
  taleWallets = [],
  loading = false,
  onSelect = () => {},
}) {
  const [page, setPage] = useState(0);

  const pagedWallets = useMemo(() => {
    const start = page * PAGE_SIZE;
    return taleWallets.slice(start, start + PAGE_SIZE);
  }, [taleWallets, page]);

  const pageCount = Math.ceil(taleWallets.length / PAGE_SIZE);

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center">
        Tale Wallets
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="animate-spin rounded-full border-4 border-sky-400 border-t-transparent h-12 w-12"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pagedWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg flex flex-col items-center border border-sky-800 hover:border-sky-400 cursor-pointer transition-all duration-200"
                onClick={() => onSelect(wallet.id)}
              >
                <div className="text-sky-400 font-semibold text-lg mb-1">
                  #{wallet.id}
                </div>
                <div className="font-bold text-xl mb-1">
                  {wallet.voteCount.toLocaleString()} Votes
                </div>
                <div className="text-xs text-gray-300">
                  S47 Balance: {wallet.s47Balance}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className={`px-4 py-2 rounded-xl font-semibold shadow ${
                page === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-700 text-white"
              } transition-all`}
            >
              Previous
            </button>
            <span className="text-lg font-bold">
              Page {page + 1} of {pageCount}
            </span>
            <button
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className={`px-4 py-2 rounded-xl font-semibold shadow ${
                page >= pageCount - 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-700 text-white"
              } transition-all`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
