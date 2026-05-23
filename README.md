# PartsHub — Complete Four-Portal HTML Mockups

Static HTML implementation of the **PartsHub** platform for all four user types: **Insurance**, **Garage**, **Supplier**, and **Admin Console**.

Aligned to the project knowledge base (Proposal v1.3, SRS v1.3, 549 BRD requirements, Insurance/Garage/Supplier flow docs, Dashboard spec, Reports spec, Subscription matrix, Venue Master concept, Onboarding master structures).

## Quick start

Open `index.html` in any modern browser — no build step, no backend.

## Structure

```
PartsHub/
├── index.html                       ← portal selector landing page
├── README.md
├── shared/                          ← shared design system
│   ├── styles.css
│   ├── icons.js
│   ├── sidebar.js                   ← shell renderer + notifications panel
│   └── logo.svg
│
├── insurance/   (~30 pages)
├── garage/      (~25 pages)
├── supplier/    (~25 pages)
└── admin/       (~25 pages)
```

## Pages per portal — full inventory

### Insurance (29 pages)
- **Auth**: login, register, forgot-password, 2fa, onboarding, approval-pending, my-account
- **Dashboard**: dashboard (KPIs, quick-action CTAs, claims pipeline chart, status bars, recent claims, garage quotations widget)
- **Claim Request flow**: claim-requests · claim-create · claim-create-damage · rfq-to-garage-create · garage-quotations-list · garage-quotations (compare) · supplier-rfq-create · supplier-quotations-compare · supplier-quotations-assign · finalized-claims
- **Garage Network**: partners · garage-details
- **Policies**: policies · policy-holders · payouts
- **Orders**: orders · order-details · replacement-refund · review-give
- **Inventory & Sell**: inventory · inventory-add · auction · auction-create · auction-detail · hot-deals · hot-deal-create · hot-deal-detail
- **Reports (6 specific reports per KB §48)**: Claims Analytics · Garage Performance Scorecard · Supplier Performance (RFQ Responsiveness + Outstanding) · Auction Effectiveness · Hot Deal Utilization · Outstanding Payments Summary
- **Other**: csv-import (4-step flow) · subscription · user-management · notifications

### Garage (25 pages)
- **Auth**: login, register, forgot-password, 2fa, onboarding, approval-pending, my-account
- **Dashboard**: dashboard (KPIs, **visual job pipeline**, **action-required alerts**, hot deals, quotation conversion, claim activity)
- **Claim & Quotation flow**: claim-requests · claim-detail (with accept/reject modals + Add Parts + Labor cost) · rfq-to-garage · quotation-list (my quotes) · quotation-detail · rfq-to-supplier · supplier-quotations · garage-quotations (compare)
- **Orders**: orders · review-give
- **Inventory & Sell**: inventory · auction · auction-detail (place bid) · hot-deals · hot-deal-detail (buy now)
- **Other**: garages, branches, reports, subscription, user-management, venue-master, notifications

### Supplier (25 pages)
- **Auth**: login, register, forgot-password, 2fa, onboarding, approval-pending, my-account
- **Dashboard**: dashboard (KPIs, **RFQ→Order pipeline**, **financial snapshot**, top selling parts, new RFQs)
- **RFQ → Quote → Order**: rfqs (list) · rfq-detail · quotations (builder) · orders
- **Invoicing**: invoice-list · invoice-detail
- **Replacement / Refund**: replacement-list · replacement-detail · refund-list · refund-detail
- **Inventory & Sell**: inventory · catalog · hot-deals · auction · auction-detail · auction-orders
- **Other**: shipments, reports, subscription, user-management, notifications · review-give

### Admin Console (28 pages)
- **Auth**: login, register, forgot-password, 2fa, my-account
- **Dashboard**: dashboard (platform activity, system health, recent signups, open tickets)
- **Governance**: **approvals queue** · approval-detail (KYC + license verification) · reviews (with flagged / dispute investigation) · contact-inquiry (inquiries + admin tasks) · roles (permission matrix) · payments (release queue)
- **Marketplace**: users · insurers · garages · suppliers · claims · orders · subscriptions (3-tier plans) · feature-groups
- **Master data**: vehicle-hierarchy (10-level taxonomy) · damage-categories · component-menu (parts catalog) · venue-master
- **Other**: settings, reports, overview, notifications

## Design system (`shared/styles.css`)

- **Brand**: `#E11D2A` red primary, near-white surfaces, light-blue zebra-striped tables (`#F4F8FD`)
- **Type**: Inter from Google Fonts, weights 400-900
- **Components**: page-card · panel · kpi · compare (quotation table) · stepper (5-step wizards) · timeline · pipeline (horizontal status flow) · modal (with backdrop) · dropzone · photo-grid · notif-panel · onboarding-rail · profile-head · bid-row · rating stars
- **Icons**: 50+ inline SVGs via `PHIcon(name, size)` from `shared/icons.js`
- **Shell**: sidebar + topbar auto-rendered by `shared/sidebar.js`. Pages declare context via body data attrs:

```html
<body data-portal="garage" data-page="claim-request" data-subpage="claim-detail" data-page-title="Claim Detail">
```

- **Notifications panel**: globally available — click the bell in the topbar of any signed-in page. Portal-specific notifications wired in `shared/sidebar.js`.

## Flows covered (vs. KB)

✅ Onboarding wizard (6 steps) — for Garage, Supplier, Insurance — with cascading specialisation (Garage) and supplier-type gating
✅ Approval-pending screen
✅ Full Claim lifecycle: Create → AI damage detection → RFQ to Garage(s) → Receive quotations → Compare → Select → Finalize parts → RFQ to Supplier(s) → Compare → Assign per part → Generate orders → Order tracking with timeline → Replacement/Refund → Review
✅ Garage flow: Receive RFQ → Accept/Reject modals → Build quotation with parts + labor → Submit → Track decision
✅ Supplier flow: RFQ Detail → Quote Builder → Quotation list → Order fulfilment → Invoice → Replacement/Refund handling
✅ Auction: List → Create → Detail with bid history → Place bid → Award & generate order (Insurance, Garage, Supplier all covered)
✅ Hot Deals: List → Create (Insurance, Supplier) → Detail with Buy Now (Garage, Supplier) → Close modal → Delete modal → Order details
✅ Inventory: List with type filter (Parts/Vehicles) → Add (master catalog autofill + editable qty/price)
✅ CSV Import: 4-step flow with field mapping, conflict detection, import summary
✅ My Account: 4 tabs (Profile / Documents / Security / Activity) — across all 4 portals
✅ Reviews & Ratings: Post-order review form + admin moderation
✅ 6 Insurance reports (Claims, Garage Perf, Supplier Perf, Auction, Hot Deal, Outstanding)
✅ Admin governance: KYC queue → License verification → Approve/Reject with notes
✅ Roles & Permissions matrix (12 modules × 5 CRUD ops)
✅ Vehicle Hierarchy (10-level cascading taxonomy)
✅ Damage Categories master
✅ Subscription tier matrix (Starter / Pro / Business)
✅ Feature Groups (9 groups mapped to plans)

## Caveats

- Mock data throughout (UAE-themed names, AED currency, Dubai/Abu Dhabi/Sharjah/Al Ain locations)
- Forms are non-functional — submitting any login navigates straight to the dashboard
- Designed for desktop ≥ 1280px width — responsive/mobile work is a separate iteration
- Some secondary list pages remain as "stub" tables with placeholder data — the 60+ pages above cover all KB-documented flows in detail
- No AI/ML, payment gateway, or backend wiring — this is a presentation-grade clickable mockup, not a working app
