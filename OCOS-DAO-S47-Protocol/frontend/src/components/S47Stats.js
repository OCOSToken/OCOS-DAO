// S47Stats.js
import React from "react";

export default function S47Stats({
  totalS47 = 1100000,
  distributedS47 = 0,
  taleWalletCount = 47000,
  currentEpoch = 1,
  circulatingOcos = 0,
  totalOcos = 1000000000,
  nextDistributionDate = "TBA"
}) {
  const undistributedS47 = totalS47 - distributedS47;
  const percentDistributed = ((distributedS47 / totalS47) * 100).toFixed(2);

  return (
    <section className="w-full max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col gap-4 border border-sky-800">
      <h2 className="text-3xl font-extrabold text-sky-400 mb-3 tracking-tight">
        S47 Vault Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Total S47 in Vault</span>
          <span className="text-2xl font-bold text-white">{totalS47.toLocaleString()} S47</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Distributed S47</span>
          <span className="text-2xl font-bold text-green-400">{distributedS47.toLocaleString()} S47</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Undistributed S47</span>
          <span className="text-2xl font-bold text-yellow-400">{undistributedS47.toLocaleString()} S47</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Distribution Progress</span>
          <span className="text-2xl font-bold text-sky-300">{percentDistributed}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Tale Wallets</span>
          <span className="text-2xl font-bold text-sky-500">{taleWalletCount.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Current Epoch</span>
          <span className="text-2xl font-bold text-purple-400">#{currentEpoch}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Circulating OCOS</span>
          <span className="text-2xl font-bold text-pink-300">{circulatingOcos.toLocaleString()} OCOS</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300">Total OCOS Supply</span>
          <span className="text-2xl font-bold text-sky-400">{totalOcos.toLocaleString()} OCOS</span>
        </div>
        <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
          <span className="text-gray-300">Next Distribution Date</span>
          <span className="text-xl font-semibold text-orange-300">{nextDistributionDate}</span>
        </div>
      </div>
    </section>
  );
}
