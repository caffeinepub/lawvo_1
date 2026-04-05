# Vakyom – The Legal Intelligence Workspace

## Current State
Vakyom currently operates as a multilingual legal guidance app with:
- Multi-screen mobile-first app (welcome, login, language select, dashboard, lawyer marketplace, chatbot, document scanner, admin)
- Rule-based chatbot with Hindi/Kannada Q&A
- Multi-role login (User, Lawyer, Admin)
- WhatsApp integration
- Backend canister with user/lawyer/case/chatbot data

## Requested Changes (Diff)

### Add
- Full SaaS marketing website with 11 immersive sections replacing the current app flow
- Section 1: Hero — full-screen with animated floating UI elements, headline, two CTAs
- Section 2: Interactive Product Walkthrough — tab system (Public User / Client / Lawyer) with simulated dashboards
  - Public User tab: AI chat interface with typing animation, language selector, legal guide cards
  - Client tab: case timeline, hearing alerts, document viewer, chat with lawyer simulation
  - Lawyer tab: full workspace — case list, document upload with OCR animation, draft generator, case alerts, client chat
- Section 3: Problem → Solution split-screen visual storytelling
- Section 4: Features Grid (8 features) with clickable modals, animations, mini demo UIs
- Section 5: Trust & Compliance cards (4 cards with badges)
- Section 6: Live Workflow Simulation — animated step-by-step flow diagram
- Section 7: Investor metrics section with animated counters
- Section 8: Testimonial simulation (3 cards)
- Section 9: Pricing with monthly/yearly toggle (3 plans)
- Section 10: Final CTA with urgency
- Section 11: Footer
- Cursor glow effect, scroll-triggered animations, glassmorphism cards
- Sticky navigation with smooth scrolling
- Early access / waitlist form (stores submissions in backend)

### Modify
- App.tsx: Replace current multi-screen routing with single-page SaaS site
- index.css: Add glassmorphism utilities, animation keyframes, cursor glow, scroll animations
- Backend: Add waitlist/early-access submission storage

### Remove
- Current app routing and all screen components (Welcome, LoginScreen, LanguageSelect, Dashboard, LawyerMarketplace, etc.) — these are replaced by the SaaS landing site
- The app will no longer route to those screens; they remain in the codebase but are not rendered

## Implementation Plan
1. Update backend (main.mo) to add `joinWaitlist(name, email, phone)` and `getWaitlistEntries()` calls
2. Regenerate backend bindings
3. Build new SaaS site as a single App.tsx using React components, one per section
4. Implement all 11 sections with premium dark navy/gold glassmorphism design
5. Add interactive tab walkthroughs with simulated dashboard UIs (all frontend-only, no real backend calls)
6. Features grid with modal system
7. Animated workflow diagram
8. Investor metrics with count-up animation
9. Pricing toggle (monthly/yearly)
10. Waitlist form that calls backend `joinWaitlist`
11. Cursor glow, scroll-triggered fade-in animations, smooth scrolling
12. Keep WhatsApp button, keep SEO meta tags, keep Vakyom name/logo
