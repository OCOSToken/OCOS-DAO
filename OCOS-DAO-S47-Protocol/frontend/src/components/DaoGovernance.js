import React, { useState } from "react";
import { FaVoteYea, FaRegCheckCircle } from "react-icons/fa";

const initialProposals = [
  {
    id: 1,
    title: "Increase S47 distribution round frequency",
    description: "Proposal to reduce the duration between S47 distribution rounds from 1 month to 2 weeks.",
    votesFor: 87,
    votesAgainst: 14,
    status: "Active"
  },
  {
    id: 2,
    title: "Charity allocation for global educational funds",
    description: "Allocate 5% of the S47 legacy to global education charities as decided by the DAO.",
    votesFor: 125,
    votesAgainst: 9,
    status: "Active"
  },
];

export default function DaoGovernance({ wallet, canVote = true }) {
  const [proposals, setProposals] = useState(initialProposals);
  const [newProposal, setNewProposal] = useState({ title: "", description: "" });
  const [voted, setVoted] = useState({});
  const [adding, setAdding] = useState(false);

  // Submit a new proposal
  const handleAddProposal = () => {
    if (!newProposal.title || !newProposal.description) return;
    const id = proposals.length + 1;
    setProposals([
      ...proposals,
      {
        id,
        title: newProposal.title,
        description: newProposal.description,
        votesFor: 0,
        votesAgainst: 0,
        status: "Active"
      }
    ]);
    setNewProposal({ title: "", description: "" });
    setAdding(false);
  };

  // Vote function
  const handleVote = (id, type) => {
    if (voted[id]) return;
    setProposals(proposals.map(p =>
      p.id === id
        ? {
            ...p,
            votesFor: type === "for" ? p.votesFor + 1 : p.votesFor,
            votesAgainst: type === "against" ? p.votesAgainst + 1 : p.votesAgainst,
          }
        : p
    ));
    setVoted({ ...voted, [id]: true });
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-950 rounded-2xl shadow-lg p-6 mt-8 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaVoteYea className="text-sky-500" /> DAO Governance Proposals
      </h2>
      {proposals.map(p => (
        <div
          key={p.id}
          className="mb-4 p-4 rounded-xl bg-gray-900 border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-lg">{p.title}</span>
              <span className={`ml-4 px-2 py-0.5 rounded-full text-xs ${p.status === "Active" ? "bg-sky-600" : "bg-gray-700"}`}>
                {p.status}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 font-bold">For: {p.votesFor}</span>
              <span className="text-red-400 font-bold">Against: {p.votesAgainst}</span>
            </div>
          </div>
          <div className="text-gray-300 mt-2">{p.description}</div>
          <div className="mt-3 flex gap-2">
            {canVote && p.status === "Active" && !voted[p.id] ? (
              <>
                <button
                  onClick={() => handleVote(p.id, "for")}
                  className="px-4 py-1 bg-sky-600 rounded-xl hover:bg-sky-700 transition font-semibold"
                >
                  Vote For
                </button>
                <button
                  onClick={() => handleVote(p.id, "against")}
                  className="px-4 py-1 bg-gray-700 rounded-xl hover:bg-gray-600 transition font-semibold"
                >
                  Vote Against
                </button>
              </>
            ) : (
              <span className="flex items-center gap-1 text-gray-400">
                <FaRegCheckCircle /> {voted[p.id] ? "You voted" : "Voting closed"}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Add Proposal Section */}
      {wallet && (
        <div className="mt-6">
          <button
            onClick={() => setAdding(!adding)}
            className="px-4 py-2 bg-emerald-600 rounded-xl shadow font-semibold hover:bg-emerald-700 transition"
          >
            {adding ? "Cancel" : "Submit New Proposal"}
          </button>
          {adding && (
            <div className="mt-4 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <input
                type="text"
                className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Proposal title"
                value={newProposal.title}
                onChange={e => setNewProposal({ ...newProposal, title: e.target.value })}
              />
              <textarea
                className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Proposal description"
                value={newProposal.description}
                onChange={e => setNewProposal({ ...newProposal, description: e.target.value })}
              />
              <button
                onClick={handleAddProposal}
                className="w-full px-4 py-2 bg-sky-500 rounded-xl font-semibold hover:bg-sky-700 mt-2"
              >
                Submit Proposal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
