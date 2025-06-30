
# OCOS-DAO Frontend Pages

This directory contains all the main React/Next.js pages of the **OCOS-DAO S47 Protocol** application.
Each file represents a major user-facing route, mapped directly to the OCOS-DAO platform's key features.

---

## 📄 **Directory Structure & Page Descriptions**

```
/frontend/src/pages/
├── index.js         // Landing page & main dashboard
├── voting.js        // DAO voting panel (vote with OCOS tokens)
├── tale-wallets.js  // List and details of all Tale Wallets and their stats
├── my-wallet.js     // User's personal wallet: balance & voting history
├── s47-legacy.js    // S47 Legacy: protocol story, stats, transparency
├── governance.js    // DAO governance: proposals, voting, protocol rules
├── about.js         // About the project: mission, team, contacts
├── faq.js           // Frequently Asked Questions
└── not-found.js     // Custom 404 error page
```

---

## 🧭 **Page-by-Page Overview**

- **index.js**  
  Main landing page. High-level overview, latest protocol updates, quick access to all main modules.

- **voting.js**  
  Professional DAO voting panel. Users connect wallet, check OCOS balance, and vote for the future of S47 by supporting Tale Wallets.

- **tale-wallets.js**  
  Full list of all 47,000 Tale Wallets. Live vote stats, S47 distribution per wallet, filtering, and exploration features.

- **my-wallet.js**  
  User dashboard. Shows wallet address, live OCOS balance, full voting history. Only real blockchain data, no demo values.

- **s47-legacy.js**  
  All about the S47 digital legacy: story, protocol transparency, total stats, top Tale Wallets, and blockchain auditability.

- **governance.js**  
  DAO governance hub. Shows current and historical proposals, allows new proposal submissions, and outlines protocol rules.

- **about.js**  
  Project background, mission, philosophy, symbolic founders (S470SHI), team and core contributors, community links, and contact info.

- **faq.js**  
  Clear, accordion-style answers to common questions: protocol, voting, security, legacy, tokens, participation, and support.

- **not-found.js**  
  Custom 404 error page. Friendly, DAO-branded, and offers easy navigation back home.

---

## 💼 **Development Notes**

- All pages are written in professional, modern React (with optional Next.js routing compatibility).
- UI/UX is styled with Tailwind CSS for a clean, responsive, and dark-themed design.
- All blockchain data is pulled live from deployed smart contracts (OCOS Token, S47DaoVault, etc.).
- Pages are modular: add new sections or integrate additional blockchain modules as the protocol evolves.
- For new features, follow the naming and structure conventions shown here for easy onboarding and open-source clarity.

---

## 🚀 **Contributing**

- For new pages, copy this README header and document the new route clearly.
- For major UI/logic changes, update this README and the root project documentation.
- All code, comments, and commit messages should be clear, professional, and in English.

---

**OCOS-DAO S47 Protocol — Community-driven, transparent, unstoppable.**
