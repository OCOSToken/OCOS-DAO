import React, { useState } from "react";

const FAQ_LIST = [
  {
    q: "What is OCOS-DAO?",
    a: "OCOS-DAO is a fully decentralized autonomous organization that manages and governs the S47 legacy — a digital inheritance originally entrusted by S470SHI to the global community. All decisions are made on-chain by OCOS token holders.",
  },
  {
    q: "Who is S470SHI?",
    a: "S470SHI is the symbolic founder and anonymous benefactor who entrusted 1.1 million S47 units to the OCOS-DAO, setting the stage for the world’s most transparent digital legacy protocol.",
  },
  {
    q: "What is S47?",
    a: "S47 is a symbolic digital asset, representing a unique legacy and value system, fully managed by the OCOS-DAO and governed by community vote.",
  },
  {
    q: "How does the voting system work?",
    a: "Every OCOS token holder can vote on the fate of S47 units by selecting Tale Wallets. The more OCOS you hold, the greater your voting power. Voting and allocations are recorded and executed by smart contracts on-chain.",
  },
  {
    q: "What are Tale Wallets?",
    a: "There are 47,000 Tale Wallets — special vaults that can receive S47 allocations. Each wallet’s destiny is determined by community voting.",
  },
  {
    q: "How do I participate?",
    a: "Connect your Web3 wallet, acquire OCOS tokens, and use the voting panel to support your chosen Tale Wallets. You can also submit proposals, vote on governance, and track your history in your personal dashboard.",
  },
  {
    q: "Is there a fixed supply of OCOS tokens?",
    a: "Yes. There are exactly 1,000,000,000 OCOS tokens. No more can ever be minted or created. The price per OCOS token is fixed at $47.",
  },
  {
    q: "Can I withdraw or transfer S47?",
    a: "S47 units are only distributed through the DAO’s community vote. Withdrawal or transfer is possible only according to the DAO's transparent, auditable smart contract rules.",
  },
  {
    q: "Is OCOS-DAO safe and secure?",
    a: "Yes. All operations are handled by open-source, audited smart contracts. There is no central authority or private admin keys. Everything is 100% on-chain and community controlled.",
  },
  {
    q: "How can I see the DAO’s history and audit everything?",
    a: "Every transaction, vote, proposal, and distribution is recorded on the blockchain. You can audit all actions using our public explorers and open-source repositories.",
  },
  {
    q: "Where can I get support or ask more questions?",
    a: "Join our official Telegram group, visit our GitHub, or email dao@ocos.io. The OCOS-DAO community and team are always ready to help.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-pink-400">Frequently Asked Questions</h2>
        <div>
          {FAQ_LIST.map((item, idx) => (
            <div key={idx} className="mb-4">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left focus:outline-none"
              >
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all">
                  <span className="font-semibold text-white">{item.q}</span>
                  <span className="text-pink-300">{openIdx === idx ? "−" : "+"}</span>
                </div>
              </button>
              {openIdx === idx && (
                <div className="p-4 text-gray-300 border-l-4 border-pink-400 bg-gray-950 rounded-b-xl">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 pt-8 border-t border-gray-800">
          Didn't find your answer? Join our <a href="https://t.me/OCOSDAO" target="_blank" rel="noopener noreferrer" className="underline text-pink-200">Telegram</a> or email <a href="mailto:dao@ocos.io" className="underline text-pink-200">dao@ocos.io</a>
        </div>
      </div>
    </div>
  );
}
