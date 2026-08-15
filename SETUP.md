# Med-Mart — setup you need to do

## 1. Run what exists today (email auth)

Two terminals:

```bash
cd server && npm run dev:memory
```

```bash
npm run dev
```

Then open http://localhost:5173/signup.

`dev:memory` runs the API against a throwaway in-memory MongoDB so you can
click through signup/login immediately. **Data disappears when you stop it.**
Swap to `npm run dev` (which uses `MONGODB_URI`) once you've done step 2.

Run the API test suite any time with `cd server && npm run test:smoke`.

### Two environment gotchas already handled

- **Port 5000 is taken by macOS AirPlay Receiver**, which answers every request
  with `403`. The API runs on **5001** instead. If you'd rather free 5000:
  System Settings → General → AirDrop & Handoff → turn off *AirPlay Receiver*.
- **Vite proxies `/api` → `localhost:5001`** (see `vite.config.js`). The browser
  only ever talks to `localhost:5173`, so there's no CORS preflight and the auth
  cookie is first-party. In production, point your host's `/api` at the API.

---

## 2. A real database (do this first — 5 minutes)

Easiest is **MongoDB Atlas free tier** (no install, works from anywhere):

1. Sign up at https://www.mongodb.com/cloud/atlas → create a free **M0** cluster.
2. **Database Access** → Add New Database User → note the username/password.
3. **Network Access** → Add IP Address → *Allow access from anywhere*
   (`0.0.0.0/0`) for now; lock this down before launch.
4. **Database → Connect → Drivers** → copy the connection string. It looks like
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/medmart`
5. Paste it into `server/.env` as `MONGODB_URI=`, then run `npm run dev`.

Prefer local? With Docker Desktop running:

```bash
docker run -d --name medmart-mongo -p 27017:27017 -v medmart-mongo-data:/data/db mongo:7
```

and keep the default `MONGODB_URI=mongodb://127.0.0.1:27017/medmart`.

---

## 3. Google Sign-In (needed before I build phase 2)

1. Go to https://console.cloud.google.com → create a project named `med-mart`.
2. **APIs & Services → OAuth consent screen**
   - User type: **External** → Create
   - App name `Med-Mart`, your support email, developer email → Save
   - Scopes: leave the defaults (`email`, `profile`, `openid`)
   - Test users: add your own Gmail while the app is unpublished
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Med-Mart Web`
   - **Authorised JavaScript origins:**
     - `http://localhost:5173`
     - later, your real domain e.g. `https://med-mart.in`
   - **Authorised redirect URIs:**
     - `http://localhost:5173`
     - later `https://med-mart.in`
   - Create → copy the **Client ID** and **Client secret**
4. Put them in `server/.env`:
   ```
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=xxxxx
   ```
   and add a root `.env` for the frontend:
   ```
   VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   ```

The Client ID is public (it ships in the browser bundle) — that's expected. The
**Client secret must stay server-side only**; never put it in a `VITE_` variable.

---

## 4. Phone OTP (needed before I build phase 3)

**Recommendation: Firebase Phone Auth**, not Twilio. Firebase gives you 10k
verifications/month free, handles the SMS delivery and the OTP itself, and has
built-in abuse protection (reCAPTCHA). Twilio costs from the first SMS
(~₹0.60 each in India), needs DLT sender-ID registration for Indian numbers,
and leaves you to generate, store and expire the codes yourself.

1. https://console.firebase.google.com → **Add project** (you can attach it to
   the same Google Cloud project from step 3).
2. **Build → Authentication → Get started → Sign-in method → Phone → Enable.**
3. Add `localhost` under **Authentication → Settings → Authorised domains**.
4. **Project settings → General → Your apps → Web app (`</>`)** → register →
   copy the `firebaseConfig` values into a root `.env`:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_APP_ID=
   ```
5. **Project settings → Service accounts → Generate new private key** →
   downloads a JSON file. From it, fill `server/.env`:
   ```
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY=
   ```
   Keep the JSON out of git. For `FIREBASE_PRIVATE_KEY`, wrap it in quotes and
   keep the `\n` escapes exactly as they appear.
6. **Test phone numbers** (Authentication → Sign-in method → Phone → *Phone
   numbers for testing*): add e.g. `+91 99999 99999` with code `123456` so we
   can develop without burning real SMS.

The client gets the OTP verified by Firebase and receives an ID token; the
backend verifies that token with the Admin SDK and then issues our own JWT
cookie, so phone/Google/email sessions all work the same way afterwards.

Rate limiting (max 3 OTP requests per number per 10 min) will sit on our
`/auth/phone/send-otp` route on top of Firebase's own protection.

---

## 5. Deploying to Vercel

The repo is already configured for it (`vercel.json` + `api/index.js`).

**How it's wired:** Vercel can't run a long-lived Express server, so the same
Express app is exported as a **serverless function** at `api/index.js`. Vercel
turns every file under `/api` into a function automatically, and `vercel.json`
routes `/api/*` there while sending every other path to `index.html` so
client-side routes like `/login` don't 404. Frontend and API end up on one
domain, so the auth cookie stays first-party exactly like in dev.

`server/src/config/db.js` caches the Mongo connection on `globalThis` — without
that, every request would open a new pool and blow through Atlas's connection
limit within minutes.

### Steps

1. **You must finish step 2 first (MongoDB Atlas).** The `dev:memory` database
   only exists inside a running process — it cannot work on serverless.
   In Atlas → Network Access, allow `0.0.0.0/0`, because Vercel's functions
   don't have fixed IPs.
2. https://vercel.com → **Add New → Project** → import
   `deepxxxdeep-cloud/MED-MART-CLOUD-HOST`.
3. Framework preset will detect **Vite**. Leave build settings as they are —
   `vercel.json` already specifies them.
4. **Environment Variables** (Settings → Environment Variables), for
   *Production* and *Preview*:
   ```
   MONGODB_URI       mongodb+srv://...        (from Atlas)
   JWT_SECRET        <run: openssl rand -hex 48>   ← a NEW one, not the dev value
   JWT_EXPIRES_IN    7d
   CLIENT_URL        https://<your-project>.vercel.app
   ```
   Don't set `NODE_ENV` — Vercel sets it to `production` itself, which is what
   flips the auth cookie to `secure`.
5. **Deploy.** Then check `https://<your-project>.vercel.app/api/health` — it
   should return `{"ok":true}`. If it 503s, the `MONGODB_URI` is wrong or Atlas
   is still blocking the IP.
6. Once you add Google/Firebase later, add those keys here too, and add the
   Vercel URL to the Google **authorised origins** and Firebase **authorised
   domains** lists.

### Worth knowing

- **The 25 MB video is the main risk.** Vercel will serve it, but first paint on
  a phone will be slow and it eats bandwidth on the free tier. Compress it
  before you share the link widely.
- Free-tier functions cold-start; the first API call after idle can take a
  second or two. Normal, not a bug.
- `server/` still runs standalone (`npm run dev`) for local work — the
  serverless wrapper doesn't replace it, it just re-uses the same app.

### If you'd rather not use serverless

Host the `server/` folder as a normal Node service on **Render** or **Railway**
(free tiers, no code changes — it's a plain Express app), keep the frontend on
Vercel, and set `VITE_API_URL=https://your-api-host.com/api` in Vercel. In that
setup the API is on a different domain, so `server/src/utils/token.js` needs
`sameSite: "none"` for the cookie to be accepted cross-site.

---

## 6. Razorpay — payments and payouts

Nothing charges anyone until these keys exist. Until then `/checkout` shows
"payments aren't switched on yet" and the API returns 503 rather than
creating an unpaid order.

### 6a. Account and test keys (start here)

1. Sign up at https://dashboard.razorpay.com — use your business email.
2. Stay in **Test Mode** (the toggle top-right). Test mode needs no KYC and
   uses fake cards, so you can build the whole flow before going live.
3. **Settings → API Keys → Generate Test Key.** You get a key id
   (`rzp_test_…`) and a secret, shown **once** — copy both now.
4. Put them in `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
   PLATFORM_COMMISSION_RATE=0.06
   ```
   The key id is public — it ships in the browser to identify the merchant.
   **The secret is server-only**; never put it in a `VITE_` variable.
5. Add the checkout script to `index.html`, just before `</body>`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
6. Test cards: `4111 1111 1111 1111`, any future expiry, any CVV. For UPI use
   `success@razorpay`.

### 6b. Webhook (do this before going live)

The browser callback can't be trusted on its own — a buyer may close the tab
or never return from a UPI app. Razorpay's webhook is what makes payment
state converge anyway, and it retries until it gets a 2xx.

1. **Settings → Webhooks → Add New Webhook.**
2. URL: `https://<your-domain>/api/webhooks/razorpay`
   (Vercel serves this from the same deployment.)
3. Secret: invent a strong one and put it in `server/.env` as
   `RAZORPAY_WEBHOOK_SECRET=…`
4. Subscribe to: `payment.captured`, `payment.failed`, `refund.processed`.
5. Local testing needs a public URL — run `npx localtunnel --port 5001` (or
   ngrok) and point the webhook at that address.

The route verifies Razorpay's signature over the **raw** request body, which
is why it is mounted before the JSON parser in `app.js`. Don't move it.

### 6c. Seller payouts (RazorpayX Route)

This is how Amazon and Flipkart settle sellers: the platform receives the
whole payment, holds it, and releases the seller's share after delivery.

1. **Razorpay Dashboard → Route** (needs completed KYC; test mode first).
2. Each seller becomes a **linked account**, created from the bank details on
   their Business Profile page. Only the last four digits and Razorpay's
   token are stored here — full account numbers stay with Razorpay.
3. Settlement in this build: a payout becomes eligible when the seller marks
   an order **delivered**, and batches run every 7 days.
4. Commission is deducted at order creation and recorded per order, so a
   later rate change never rewrites historical earnings.

### 6d. Going live

- Complete KYC, then **Settings → API Keys** in Live Mode for `rzp_live_…`
  keys, and swap both the key and the webhook secret.
- Point the webhook at the production domain.
- Money is never taken from the client: the order routes recompute price,
  total, commission and seller earning from the product record in the
  database. A tampered amount in the request is ignored — there's a test
  covering exactly this in `server/commerce.test.mjs`.

---

## 7. Admin access

The flagged-accounts queue is gated by an email allow-list rather than a role
field, so a privileged screen can't be reached just by signing up:

```
ADMIN_EMAILS=you@example.com,ops@example.com
```

Review UI is at `/admin/flagged-users`.

---

## 8. Before production

- [ ] `NODE_ENV=production` (makes the auth cookie `secure`, so HTTPS required)
- [ ] Regenerate `JWT_SECRET` (`openssl rand -hex 48`) — don't reuse the dev one
- [ ] Restrict Atlas network access to your server's IP
- [ ] Wire a real email provider for password resets — the reset link is
      currently only `console.log`ged by the API (`auth.controller.js`)
- [ ] Publish the Google OAuth consent screen (it's in testing mode until then,
      capped at 100 users)
- [ ] Compress `public/media/plane-window.mp4` (~25 MB today)
