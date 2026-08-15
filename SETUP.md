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

## 5. Before production

- [ ] `NODE_ENV=production` (makes the auth cookie `secure`, so HTTPS required)
- [ ] Regenerate `JWT_SECRET` (`openssl rand -hex 48`) — don't reuse the dev one
- [ ] Restrict Atlas network access to your server's IP
- [ ] Wire a real email provider for password resets — the reset link is
      currently only `console.log`ged by the API (`auth.controller.js`)
- [ ] Publish the Google OAuth consent screen (it's in testing mode until then,
      capped at 100 users)
- [ ] Compress `public/media/plane-window.mp4` (~25 MB today)
