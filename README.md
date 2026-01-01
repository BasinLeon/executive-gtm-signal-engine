# LeonOS || Executive GTM Signal Engine

**Status:** Live v1.0
**Role:** Revenue Architect
**Demo:** [Launch Command Center](https://basinleon.github.io)

---

## ⚡ System Objective
Standard CRMs (Salesforce/HubSpot) are data warehouses, not decision engines. They obscure signal with administrative noise.

**The GTM Signal Engine** is a local-first operational tool designed to:
1.  **Force Decision Velocity:** Drag-and-drop physics require active deal stage management.
2.  **Eliminate Zombie Deals:** Visual aging creates immediate friction for stalled opportunities.
3.  **Generate Portable Artifacts:** Browser-native PDF generation converts live pipeline state into board-ready briefs.

## 🛠 Architecture & Stack

### Core Components
- **Frontend:** React (Functional Components + Hooks)
- **Styling:** Tailwind CSS (Utility-first architecture)
- **State Management:** LocalStorage (Zero-latency persistence)
- **Artifact Engine:** Native `window.print` with CSS `@media print` typography enforcement.

### Feature Vectors
| Vector | Status | Description |
| :--- | :--- | :--- |
| **A: Artifact Generator** | 🟢 **Shipped** | Zero-dependency PDF export for executive reviews. |
| **B: Drag-and-Drop** | 🟢 **Shipped** | Kanban-style physics for "War Room" & "Fractional" pipelines. |
| **C: Signal Scoring** | 🟡 *In Development* | Algorithmic weighting of deal probability vs. effort. |

## 📦 Local Deployment

This project is built to run locally for data privacy and speed.

```bash
# 1. Clone the repository
git clone https://github.com/BasinLeon/executive-gtm-signal-engine.git

# 2. Install dependencies
npm install

# 3. Initialize the Command Center
npm run dev
```

## 📜 Design Philosophy

> "If a Director can't forward it, it's not an artifact."

This system prioritizes **nouns and verbs** over adjectives. It is designed to reduce the "translation layer" between Revenue Operations and Executive Strategy.

---

*Built by Leon Basin. Architecture > Administration.*
