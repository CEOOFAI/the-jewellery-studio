# The Jewellery Studio: E-Commerce Roadmap

*Created: 2026-03-13*
*Status: Future feature, not started. Build when client is ready to sell online.*

## Summary

Add online purchasing to the jewellery studio site using Stripe. When the client adds a product through the existing dashboard, it automatically becomes buyable online. No extra setup needed from the client.

## Why Stripe (Not Shopify)

| | Stripe | Shopify |
|---|---|---|
| Monthly cost | £0 | £25+/month |
| Transaction fee | 1.5% + 20p (UK/EU) | 2% + payment processor fees |
| Works with existing stack | Yes (Supabase + Vercel) | No, requires rebuild |
| Client effort | None, just add products as usual | Learn new platform |

**Bottom line:** Stripe costs nothing until a sale happens. Shopify costs money from day one and means rebuilding the site on their platform.

## How It Works

1. Client adds product in dashboard (same as now)
2. Backend automatically creates a Stripe Product + Price via API
3. Public site shows "Buy Now" button alongside the existing "Enquire via WhatsApp"
4. Customer clicks "Buy Now", gets Stripe Checkout (hosted by Stripe, no card details on our end)
5. Stripe handles payment, sends confirmation email
6. Client gets notified, order appears in dashboard

## Hybrid Approach (Recommended)

Keep WhatsApp enquiries for high-ticket items (people want to talk before spending £2,000+). Add "Buy Now" for items under a threshold the client sets. Best of both worlds.

The client could toggle per-product in the dashboard: "Allow online purchase" yes/no.

## What Needs Building

### 1. Stripe Integration Layer
- Stripe account setup for client
- API integration: create/update/delete Stripe Products + Prices when dashboard products change
- Webhook endpoint to receive payment confirmations from Stripe

### 2. Database Changes
- New `orders` table (order ID, product, customer info, payment status, shipping address, timestamps)
- New fields on `products` table: `stripe_product_id`, `stripe_price_id`, `allow_online_purchase`
- Optional: `shipping_cost` field per product or flat rate

### 3. Public Site Changes
- "Buy Now" button on products where online purchase is enabled
- Cart system (optional, could start with direct single-item checkout)
- Stripe Checkout redirect flow
- Order confirmation page

### 4. Dashboard Changes
- "Allow online purchase" toggle per product
- Orders tab: view incoming orders, mark as shipped/completed
- Sales stats: revenue, orders count, etc.

### 5. Backend (Supabase Edge Functions)
- Product sync to Stripe on create/update/delete
- Stripe webhook handler (payment succeeded, payment failed, refunds)
- Order creation on successful payment

### 6. Notifications
- Email to client when order comes in
- Email to customer with order confirmation
- Optional: WhatsApp notification to client

### 7. Shipping Logic
- Shipping address collection at checkout
- Flat rate or per-product shipping cost
- UK vs international shipping options (Gibraltar is unique here)

## Cost to Client

- **Stripe fees only:** 1.5% + 20p per UK/EU card transaction, 2.5% + 20p international
- **No monthly fees, no subscriptions**
- **Your add-on charge:** £400 (per your pricing sheet for e-commerce integration)

## Rough Build Order

1. Stripe account + API keys setup
2. Product sync (dashboard -> Stripe)
3. Single-item "Buy Now" checkout flow
4. Webhook handler + order creation
5. Orders view in dashboard
6. Cart system (if needed, can start without)
7. Shipping logic
8. Email notifications

## Notes

- Stripe handles PCI compliance, so no security headaches with card data
- Stripe Checkout is a hosted page, meaning we don't build payment forms
- Can start simple (single item buy) and add cart later
- The existing dashboard barely needs changing, just a toggle and an orders tab
