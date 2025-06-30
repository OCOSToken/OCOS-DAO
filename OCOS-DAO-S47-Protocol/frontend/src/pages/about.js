import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-4 text-purple-400">About OCOS-DAO</h2>
        <p className="mb-6 text-lg text-gray-200">
          <span className="font-bold text-yellow-200">OCOS-DAO</span> is the world’s first truly decentralized digital legacy protocol. It empowers the global community to transparently manage, distribute, and evolve the legendary S47 inheritance originally entrusted by <span className="font-semibold text-purple-300">S470SHI</span>.
        </p>
        <div className="mb-8 text-gray-300">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Our Mission</h3>
          <ul className="list-disc pl-6 mb-3">
            <li>To ensure the fair, open, and community-driven management of the S47 legacy.</li>
            <li>To pioneer DAO-based digital inheritance and governance protocols.</li>
            <li>To prove that a collective can securely govern wealth at an unprecedented global scale.</li>
          </ul>
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Who is S470SHI?</h3>
          <p className="mb-3">
            S470SHI is the symbolic founder of the S47 legacy — a pseudonymous figure who catalyzed the creation of OCOS-DAO by gifting the legendary 1.1 million S47 units to humanity. The OCOS-DAO community now decides the destiny of this inheritance.
          </p>
          <h3 className="text-lg font-semibold text-purple-300 mb-2">What makes OCOS-DAO unique?</h3>
          <ul className="list-disc pl-6 mb-3">
            <li>1,100,000 S47 digital legacy units — fully controlled by the DAO.</li>
            <li>1,000,000,000 OCOS tokens, fixed price, maximum transparency.</li>
            <li>47,000 Tale Wallets, open voting and on-chain governance.</li>
            <li>All operations, distributions, and votes are public, auditable, and on-chain.</li>
            <li>No central authority, no secret keys, only pure community consensus.</li>
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Core Contributors</h3>
          <ul className="list-disc pl-6 text-gray-200">
            <li><span className="font-semibold">S470SHI</span> – Legacy Founder, Protocol Ideologist</li>
            <li><span className="font-semibold">Ocoshy Nakomoto</span> – Protocol Architect & AI Scribe</li>
            <li><span className="font-semibold">OCOS-DAO Community</span> – Collective Stewards</li>
          </ul>
        </div>
        <div className="mb-4 text-gray-400">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Contact & Community</h3>
          <p>
            Join us on <a href="https://github.com/OCOSToken" target="_blank" rel="noopener noreferrer" className="underline text-yellow-200">GitHub</a> and <a href="https://t.me/OCOSDAO" target="_blank" rel="noopener noreferrer" className="underline text-yellow-200">Telegram</a>. <br/>
            For questions, suggestions, or partnership, email <a href="mailto:dao@ocos.io" className="underline text-yellow-200">dao@ocos.io</a>
          </p>
        </div>
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
          <span className="font-semibold text-yellow-300">OCOS-DAO</span> — “History belongs to the community.”
        </div>
      </div>
    </div>
  );
}
