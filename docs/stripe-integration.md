# Stripe Integration Guide

This application currently operates on a sophisticated **Mock Payment Architecture** allowing the full traversal of subscription funnels, user states, and onboarding flows without active vendor locks. 

When your organization's real Stripe API keys become available, execute the following precise teardown path:

1. **Install SDKs:** Run `npm install stripe @stripe/stripe-js`
2. **Environment Configuration:** Inject `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` into your `.env.local` and production Vercel environment.
3. **Core API Swap:** Open `/lib/mockPayment.ts` and replace the stubbed functions (`createMockCheckoutSession`, `simulateMockWebhookEvent`) with their identical real counterparts from the `stripe` node SDK.
4. **Checkout UI Setup:** Open `/app/subscribe/page.tsx` and replace the fake HTML card form with the official `<Elements>` wrapper and `<PaymentElement />` component imported from `@stripe/react-stripe-js`.
5. **Webhook Live Integration:** Open `POST /api/payment/webhook/route.ts` and delete the simulator. Replace it with `stripe.webhooks.constructEvent(body, signature, secret)` utilizing the Next.js raw body parser. Move the database update logic exclusively into this webhook catching `checkout.session.completed` events, rather than fulfilling direct-to-database inside the initial `/api/payment/checkout/route.ts`.
6. **Database Alignments:** Globally replace all references of `mock_customer_id` with `stripe_customer_id` across your `lib/subscription.ts` helpers.
7. **Architectural Retainment:** Once these points are replaced, **DO NOT modify any page routing, onboarding logic, or Supabase table structures.** The entire app handles these seamlessly without needing to know that Stripe was swapped in over the mock!
