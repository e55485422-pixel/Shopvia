# Shopvia: E-commerce starter website

This project is a simple **step-by-step e-commerce website** you can open in a browser.

## Pages
- `index.html` → Home page with roadmap
- `products.html` → Product listing and add-to-cart buttons
- `cart.html` → Cart management with quantity controls
- `checkout.html` → Checkout form and order summary
- `style.css` → Shared design
- `script.js` → Product data + cart logic using `localStorage`

## How to run
1. Open this folder in your editor.
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit `http://localhost:8000`.

## Learning path (step by step)
1. **Structure**: Review each HTML page and how navigation links connect the pages.
2. **Styling**: Edit `style.css` colors, layout, and product card design.
3. **Data**: Update the `products` array in `script.js` with your real products.
4. **Cart logic**: Follow `addToCart`, `updateQty`, and `cartTotal`.
5. **Checkout integration**: Replace the submit behavior with real payment API calls (Stripe/Paystack).

## Suggested next improvements
- Add category filters and search
- Add product detail pages
- Add backend (Node.js + database)
- Add authentication and order history
