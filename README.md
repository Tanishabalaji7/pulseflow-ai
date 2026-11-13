# PulseFlow AI — Intelligent Engineering Velocity Platform
> **SANKAR GROUP** | Front-End Development Internship Assessment Submission  
> **Candidate Track:** Front-End Development  
> **Product Category:** SaaS Landing Page (Developer Tools & Team Velocity)

---

## 🚀 Live Demo & Quick Start

You can review this application in two ways:

### Option 1: Instant Local View (Zero Setup)
Simply double-click [`index.html`](file:///Users/tanishabalaji/project/index.html) or open it directly in any modern browser (Chrome, Edge, Firefox, Safari).  
*No build steps, dependencies, or npm installations are required.*

### Option 2: Run via Local Dev Server
If you prefer running through a local development server:
```bash
# Using Python
python3 -m http.server 3000

# OR using Node / npx
npx serve -l 3000 .
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Assignment Requirements Compliance Matrix

| Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **1. Navigation Bar** | Fixed glassmorphism header with glowing SVG brand logo, smooth-scroll links, Dark/Light mode switcher, "Sign In" link, "Get Started" CTA, and animated mobile drawer menu. | ✅ Complete |
| **2. Hero Section** | Engaging headline, value description, dual CTAs ("Start Free Trial" modal trigger & "Request Demo" scroll), trust badges, and an **interactive SaaS dashboard mockup** with live sprint health metrics, velocity bar chart, and AI autopilot feed. | ✅ Complete |
| **3. Features (≥ 3)** | **5 feature blocks** laid out in a modern Bento Grid: Predictive Cycle Intelligence, Smart PR Routing, Autonomous Async Standups, Burnout Sentinel, and SOC-2 Security. | ✅ Complete |
| **4. About / How It Works** | **Interactive 3-step walkthrough** with active step tabs and a dynamic terminal/code preview screen that updates based on the selected step. | ✅ Complete |
| **5. Pricing (≥ 2 plans)** | **3 transparent tiers** (Developer Starter, Growth & Pro [Popular], and Enterprise) with an **interactive Monthly vs. Annual toggle** offering 20% savings. CTAs pre-select the appropriate plan in the signup modal. | ✅ Complete |
| **6. Contact / Footer** | **Two-column contact section** with value propositions, direct contact email, and an **interactive Demo Request Form** featuring real-time input validation, loading button state, animated success confirmation card, and reset button. Comprehensive 4-column footer with live status indicator and newsletter signup. | ✅ Complete |
| **7. Working Interactions** | Smooth scroll with navbar offset, interactive modals, theme persistence, accessible accordion FAQ, mobile drawer, and floating toast alert system. | ✅ Complete |
| **8. Responsiveness** | Fully responsive CSS Grid and Flexbox layouts tested across desktop, tablet, and mobile breakpoints (1024px, 768px, 480px). | ✅ Complete |

---

## 🛠️ Technology Stack & Architecture

- **HTML5 (Semantic & Accessible):** Structured using standard semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) with ARIA attributes (`aria-expanded`, `aria-selected`, `aria-modal`, `role="tablist"`, `role="dialog"`, `role="alert"`).
- **CSS3 (Modern & Modular):**
  - **Design System:** Comprehensive CSS custom properties (`:root` and `[data-theme="light"]`) for instantaneous theme switching.
  - **Layout:** CSS Grid (Bento grid, pricing columns) and Flexbox (navigation, cards, headers).
  - **Visual Polish:** Glassmorphism (`backdrop-filter`), subtle glowing shadows, gradient accents, and micro-interactions.
  - **Zero External Heavy Frameworks:** Pure, highly optimized vanilla CSS without dependency bloat.
- **Vanilla ES6+ JavaScript:**
  - Fast, modular script architecture with event delegation and resilient local file support.
  - Form validation engine with regex email verification, length constraints, and inline feedback.
  - Accessible keyboard navigation (supports `Escape` key for drawers and modals).
  - Web Storage API (`localStorage`) for persisting theme choices.

---

## 📂 Project Structure

```
pulseflow-ai/
├── index.html              # Main semantic HTML5 landing page
├── css/
│   ├── main.css            # Design tokens, variables, typography, reset & base styles
│   └── components.css      # Component styling (Navbar, Hero, Bento Grid, Modal, Forms, Toast)
├── js/
│   ├── app.js              # Complete application logic (Self-contained, works with file:// and http://)
│   ├── theme.js            # Modular theme management logic (reference)
│   ├── validation.js       # Modular form validation rules (reference)
│   └── interactions.js     # Modular UI event handlers (reference)
├── package.json            # Convenience scripts (npm start, npm run serve)
└── README.md               # Detailed project documentation & assignment report
```

---

## 🔍 Key Features & Interactions Walkthrough

### 1. Interactive Theme Switcher (Dark / Light Mode)
- Default theme is modern high-contrast Dark Mode (developer SaaS aesthetic).
- Clicking the sun/moon icon in the navigation bar toggles the theme instantly using CSS custom properties.
- Remembers user preference across sessions via `localStorage` and falls back to system `prefers-color-scheme`.

### 2. Form Validation & Submission Feedback
- **Demo Request Form:**
  - Real-time inline validation on input and blur events.
  - Verifies required fields, minimum character lengths, and valid email syntax (`name@domain.com`).
  - Displays red border rings and clear error feedback messages if validation fails.
  - On valid submission, shows an animated loading state on the button ("Reserving Demo Slot...").
  - Transitions to an animated **Success Card** highlighting the user's email with a "Book Another Demo / Reset" option.
  - Triggers a non-intrusive floating **Toast Notification** at the bottom right.
- **Sign Up / Get Started Modal:**
  - Clicking any "Get Started" or "Start Trial" button opens an accessible modal dialog.
  - Clicking a plan's CTA (e.g. "Start 14-Day Pro Trial") automatically pre-selects that tier inside the modal's dropdown.
  - Includes password length checks and full feedback.

### 3. Dynamic Pricing Calculator
- Users can switch between **Monthly Billing** and **Annual Billing**.
- Toggling immediately updates the displayed rates ($29/mo &rarr; $23/mo for Pro, $79/mo &rarr; $64/mo for Enterprise) and displays a green discount tag ("Save 20% + 2 Mo Free").

### 4. Interactive "How It Works" Tab Switcher
- Clicking on Step 1, Step 2, or Step 3 highlights the corresponding step and dynamically swaps the live code terminal preview in the adjacent panel.

### 5. Mobile Responsive Drawer
- Below 768px screen width, desktop navigation cleanly collapses into a hamburger toggle button.
- Tapping the hamburger opens an off-canvas drawer with smooth transition, backdrop blur, and body scroll lock.
- Closes smoothly on link tap, backdrop tap, or `Escape` key press.

---

## ♿ Accessibility (a11y) Considerations

- **Keyboard Accessible:** Modals and mobile drawers close with the `Escape` key.
- **ARIA Standards:** Uses `aria-expanded` on accordion buttons and mobile toggle, `aria-selected` on tabs, and `aria-modal="true"` on dialogs.
- **Focus States:** High-visibility outline focus rings on interactive inputs and buttons.
- **Color Contrast:** Both dark and light mode palettes maintain WCAG AA contrast standards for readability.

---

## 👤 Submission Details
- **Assignment:** SANKAR GROUP Front-End Development Internship Assessment
- **Role:** Front-End Developer Intern Candidate

