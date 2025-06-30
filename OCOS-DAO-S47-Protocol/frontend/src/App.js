import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import IndexPage from "./pages/index";
import VotingPage from "./pages/voting";
import TaleWalletsPage from "./pages/tale-wallets";
import MyWalletPage from "./pages/my-wallet";
import S47LegacyPage from "./pages/s47-legacy";
import GovernancePage from "./pages/governance";
import AboutPage from "./pages/about";
import FAQPage from "./pages/faq";
import NotFoundPage from "./pages/not-found";

function Navbar() {
  return (
    <nav className="w-full bg-gray-900 shadow-md px-4 py-3 flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-yellow-300 font-extrabold text-xl tracking-tight">OCOS-DAO</Link>
        <span className="text-xs text-gray-600 ml-2 hidden md:inline">S47 Protocol</span>
      </div>
      <div className="flex gap-3">
        <Link to="/voting" className="text-white hover:text-yellow-300 font-semibold px-3">Voting</Link>
        <Link to="/tale-wallets" className="text-white hover:text-yellow-300 font-semibold px-3">Tale Wallets</Link>
        <Link to="/my-wallet" className="text-white hover:text-yellow-300 font-semibold px-3">My Wallet</Link>
        <Link to="/s47-legacy" className="text-white hover:text-yellow-300 font-semibold px-3">S47 Legacy</Link>
        <Link to="/governance" className="text-white hover:text-yellow-300 font-semibold px-3">Governance</Link>
        <Link to="/about" className="text-white hover:text-yellow-300 font-semibold px-3">About</Link>
        <Link to="/faq" className="text-white hover:text-yellow-300 font-semibold px-3">FAQ</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/tale-wallets" element={<TaleWalletsPage />} />
            <Route path="/my-wallet" element={<MyWalletPage />} />
            <Route path="/s47-legacy" element={<S47LegacyPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <footer className="text-center py-6 text-gray-600 text-xs border-t border-gray-800 mt-12">
          OCOS-DAO S47 Protocol &copy; {new Date().getFullYear()} — Community-driven, Transparent, Unstoppable.
        </footer>
      </div>
    </Router>
  );
}
