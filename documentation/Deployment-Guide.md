# Deployment Guide

Order: **1) MongoDB Atlas -> 2) Render (backend) -> 3) Vercel (frontend) -> 4) Render par CLIENT_URL update**

Pehle project ko GitHub par push karein (`.env` aur `node_modules` `.gitignore` ki wajah se nahi jayenge):

```bash
cd Govindpura-Poly-Clinic-Website
git init
git add .
git commit -m "Initial commit"
# GitHub par naya repo banao, phir:
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

---

## 1. MongoDB Atlas (database)

1. mongodb.com/atlas par account banao, **M0 Free** cluster chuno (region: Mumbai `ap-south-1` Jaipur ke liye paas hai).
2. **Database Access** > Add New Database User: username + password (special characters se bachein, warna URL-encode karna padega). Role: *Read and write to any database*.
3. **Network Access** > Add IP Address > `0.0.0.0/0` (Render ka IP badalta rehta hai).
4. **Connect > Drivers** se connection string copy karein aur database ka naam `/govindpura-clinic` end mein jodein:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/govindpura-clinic?retryWrites=true&w=majority
   ```

## 2. Render (backend)

1. render.com > **New > Web Service** > GitHub repo connect karein.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. **Environment Variables:**

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | Atlas connection string |
   | `JWT_SECRET` | lamba random string (32+ chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | abhi `http://localhost:5173` rakh do; Vercel ke baad update karenge |

   (`PORT` Render khud set karta hai, use mat daalein.)
4. Deploy karein. Ban jane par URL milega, jaise `https://govindpura-clinic-api.onrender.com`. Test: `https://<url>/api/health` kholkar JSON dikhna chahiye.

**Pehla admin banana (production database mein):** Render free plan par shell nahi milta, isliye apne computer se:
```bash
cd backend
# .env mein MONGO_URI = production Atlas string, aur ADMIN_EMAIL / ADMIN_PASSWORD (mazboot password) rakhein
npm run seed:admin
```
Kaam hone ke baad `.env` mein se ye values hata dein ya file ko safe rakhein. `.env` Git mein commit na karein.

## 3. Vercel (frontend)

1. vercel.com > **Add New > Project** > wahi GitHub repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variable:**
   - `VITE_API_URL` = `https://<your-render-url>/api`  (end mein `/api` zaroori)
4. Deploy. `frontend/vercel.json` ki rewrite rule ki wajah se `/admin`, `/doctors` jaise URLs par refresh karne par 404 nahi aata.

> `VITE_` variables **build time** par bundle mein jaate hain. Value badalne par Vercel mein **Redeploy** karna padta hai.

## 4. CORS final karein

Render > Environment > `CLIENT_URL` ko Vercel ke URL se badlo, jaise `https://your-app.vercel.app` (end mein `/` nahi). Ek se zyada origin (custom domain + vercel.app) ho to comma se alag karein:
```
CLIENT_URL=https://your-app.vercel.app,https://www.yourclinic.in
```
Render service redeploy hogi. Phir website kholkar appointment form test karein.

## 5. Go-live checklist

- [ ] `/admin/login` se login ho raha hai
- [ ] Admin > Website content mein asli details daali (about, phone, timings, map)
- [ ] Doctors aur Services asli details ke saath add kiye
- [ ] Gallery mein clinic ki asli photos ke URLs daale
- [ ] Agar `seed:sample` chalaya tha to `npm run seed:sample:remove` kiya
- [ ] Test appointment aur enquiry bheji aur admin mein dikhi
- [ ] Mobile par website check ki
- [ ] `.env` files GitHub par nahi hain

## 6. Common problems

| Problem | Wajah / Fix |
|---|---|
| Browser console mein CORS error | `CLIENT_URL` mein Vercel URL galat hai ya `/` laga hai |
| Form submit par "Server se connect nahi ho pa raha" | `VITE_API_URL` galat ya `/api` missing; Vercel redeploy karein |
| Pehli request bahut slow (30-60 sec) | Render free tier idle hone par so jata hai |
| `MongoDB connection error` (Render logs) | Atlas Network Access mein `0.0.0.0/0`, ya password mein special characters |
| `bad auth` | Atlas user/password galat |
| Login 401 | Production DB mein `seed:admin` nahi chala, ya email/password galat |
| Refresh par 404 (Vercel) | `frontend/vercel.json` missing / Root Directory `frontend` set nahi |
| Server start par "JWT_SECRET set karein" | Render env mein `JWT_SECRET` 16+ chars ka daalein |

## 7. Free tier notes

- Render free: idle ke baad sleep, monthly hours limited.
- Atlas M0: 512 MB storage, ek clinic website ke liye kaafi.
- Vercel hobby: personal/non-commercial use ke liye; clinic ki commercial site ke liye unki terms/plan check karein.
