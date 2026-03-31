# Swing for Change | Golf Charity Subscription Platform

![Swing for Change Platform](https://images.unsplash.com/photo-1535136104956-2e90e75ea8dc?auto=format&fit=crop&q=80&w=2000)

> A production-grade subscription-driven web application combining golf performance tracking, charity fundraising, and a complex algorithm-powered monthly draw engine. Built as a premium Next.js 14 Web Application.

---

## 🎯 Project Overview
**Swing for Change** completely re-imagines the concept of a typical "Golf Club". Gone are the dusty fairways and complex spreadsheets. This platform empowers players to:
- **Subscribe** securely to a monthly/yearly recurring membership.
- **Log** their latest Stableford scores using our rolling-window dynamic array logic.
- **Compete** automatically in monthly algorithmic prize draws.
- **Fundraise** for verified charities through fixed percentage mechanisms tied mathematically directly to their subscriptions.

---

## 🔥 Key Technical Features

### User Experience
- **Dynamic 5-Score Rolling Window**: An automated system that accepts Stableford integers (1-45), strictly retaining only the 5 most recent active scores while instantly dropping stale entries upon insertion.
- **Winnings Vault & Claim System**: Deep dashboard integration rendering total Vault winnings securely bypassed through aggressive database-level Row-Level Security (RLS). Supports screenshot Proof Uploads for claim verifications.
- **Charity Spotlight System**: Standalone, emotionally driven charity profiles featuring live fundraising trackers, upcoming JSON-based dynamic golf events, and decoupled direct-donation intercepts.

### The "Nuclear Engine" (Admin Execution & Logic)
- **Role-Based Access Control (RBAC)**: Deep Edge Middleware preventing unauthorized execution or page-loads using database-driven `is_admin` profiles.
- **The Draw Engine (`lib/drawEngine.ts`)**: 
  - Allows **Random** or **Algorithmic** calculation models.
  - Automatically assesses global total active subscriptions, derives the dynamic total prize pool, and issues mathematically accurate 40% (Jackpot), 35% (4-Match), and 25% (3-Match) fractional payout splits.
  - Integrates "Dry Run Simulations" for auditing prior to invoking the `Publish` function.

### Cloud Integration Architecture
- **Supabase PostgreSQL**: Deeply relational database utilizing UUID structures, aggressive `CHECK` constraints (locking array outputs to mathematically viable combinations), and strict authentication scoping.
- **Stripe Subscriptions**: Event-listening webhooks mapping payment states into secure database profiles.
- **Resend Email API**: High-deliverability transactional relays for "Winner Alerts" and global "Monthly Draw Result" campaign blasts.

---

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router, Server Components, API Routes)
- **Styling**: Tailwind CSS, generic vanilla CSS overrides, Framer Motion
- **Database / Auth**: Supabase (PostgreSQL, Service Role bypass patterns)
- **Payments**: Stripe Checkout & Webhooks
- **Emails**: Resend API
- **UI Libraries**: Sonner (Premium Toast notifications), Lucide SVG 

---

## ⚙️ Environment Variables Setup

Ensure you configure the `.env.local` accurately to bind these external APIs.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Infrastructure
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Resend Mail
RESEND_API_KEY=your_resend_api_key
```

---

## 🚀 Getting Started

1. **Clone the deployment locally:**
   ```bash
   git clone https://github.com/narang25/golfcharity.git
   cd golfcharity
   ```

2. **Install modules:**
   ```bash
   npm install
   ```

3. **Initialize external Supabase SQL Data:**
   Use the Supabase SQL editor to create the necessary tables (`users`, `scores`, `draws`, `draw_entries`, `prize_payouts`, `charities`, etc.). The codebase incorporates strong `is_admin` restrictions to isolate environments.

4. **Spin up the development environment:**
   ```bash
   npm run dev
   ```
   *The application will boot on `http://localhost:3000`.*

---

## 🛡 Platform Flow & Evaluation Guide

1. **Onboarding Pipeline:** New visitors select a subscription term, configure a charity target via the `/pricing` funnel, and log into the Dashboard. Wait to execute draws until users are in the Matrix.
2. **Member Logging**: Users visit `/dashboard` to execute their 5 Stableford submissions. The UI natively prevents future dates or invalid score bounds.
3. **Execution Day**: The designated DB Admin utilizes the yellow **Enter Back Office** route. They engage `/admin/draws`, verify projected algorithmic payouts based on real-time matrix distributions, and hit `Execute Publish`. 
4. **Verification End-Game**: The system bypasses strict validation loops to generate DB logs for `prize_payouts` and `draw_entries`. Affected winning users upload visual proof inside their vaulted dashboard to complete the cycle and move payouts to a Paid state!

---

## 📸 Platform Gallery

<details>
<summary><b>Click to expand and view the beautifully crafted interfaces and user journeys</b></summary>

<br>

<div align="center">

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.55.42%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.55.49%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.55.56%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.03%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.09%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.18%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.24%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.30%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.36%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.40%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.43%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.50%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.56.58%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.01%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.08%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.15%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.21%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.31%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.34%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

<img src="ss%20of%20website/Screenshot%202026-03-31%20at%209.57.40%E2%80%AFPM.png" alt="Platform Screenshot" width="800">
<br><br>

</div>

</details>
