import React, { useEffect, useState } from "react";

const mockHistory = [
  {
    round: 1,
    date: "2025-07-01",
    winners: [
      { walletId: 13, votes: 25100, s47: 50 },
      { walletId: 81, votes: 14700, s47: 30 },
      { walletId: 999, votes: 13000, s47: 20 },
    ],
    totalDistributed: 100,
  },
  {
    round: 2,
    date: "2025-07-15",
    winners: [
      { walletId: 81, votes: 26000, s47: 70 },
      { walletId: 47, votes: 14300, s47: 30 },
    ],
    totalDistributed: 100,
  },
  // ... More rounds
];

export default function DistributionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // TODO: Replace mock data with API or contract call if needed
    setHistory(mockHistory);
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl shadow-xl p-6 mt-10 backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-4 text-sky-400">
        S47 Distribution History
      </h2>
      <div className="space-y-8">
        {history.map((round) => (
          <div
            key={round.round}
            className="bg-gray-900 rounded-xl p-4 shadow-md border border-sky-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">
                Round #{round.round}
              </span>
              <span className="text-gray-300 text-sm">
                {round.date}
              </span>
              <span className="font-semibold text-sky-300">
                Total Distributed: {round.totalDistributed} S47
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-800 text-sky-200">
                    <th className="px-3 py-1 rounded-tl-lg">Tale Wallet</th>
                    <th className="px-3 py-1">Votes</th>
                    <th className="px-3 py-1 rounded-tr-lg">S47 Awarded</th>
                  </tr>
                </thead>
                <tbody>
                  {round.winners.map((w) => (
                    <tr
                      key={w.walletId}
                      className="hover:bg-gray-800 transition"
                    >
                      <td className="px-3 py-1 font-semibold">
                        #{w.walletId}
                      </td>
                      <td className="px-3 py-1">{w.votes.toLocaleString()}</td>
                      <td className="px-3 py-1 text-sky-400 font-bold">
                        {w.s47}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No distribution history yet.
          </div>
        )}
      </div>
    </div>
  );
}
