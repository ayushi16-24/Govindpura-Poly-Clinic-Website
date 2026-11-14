# Project Architecture

## 1. Overview

Ye ek **MERN** application hai: **M**ongoDB, **E**xpress.js, **R**eact, **N**ode.js. Frontend aur backend alag-alag deploy hote hain aur sirf REST API (JSON over HTTPS) ke through baat karte hain.

```
Patient / Admin (Browser)
        |
        v
React + Vite SPA            (Vercel)
        |   Axios  ->  HTTPS + JSON
        v
Express.js REST API         (Render)
   Routes -> Middleware (rate-limit, auth, validation) -> Controllers -> Models
        |   Mongoose
        v
MongoDB Atlas               (Cloud database)
```

## 2. Technology stack aur kyun

| Technology | Kaam | Kyun chuna |
|---|---|---|
| React 19 | UI components | Reusable components, bada ecosystem, job market mein demand |
| Vite | Frontend build tool / dev server | Bahut fast start aur build |
| React Router | Client-side pages (`/doctors`, `/admin`...) | Page reload ke bina navigation |
| Axios | HTTP calls | Interceptors se token automatically lag jata hai, error handling aasaan |
| Bootstrap 5 + custom CSS | Styling | Bootstrap se responsive grid; custom CSS se medical blue + teal theme |
| Node.js | Backend runtime | Frontend jaisi hi language (JavaScript) |
| Express 5 | REST API framework | Chhota, simple, middleware pattern |
| MongoDB + Mongoose | Database | Flexible documents; Mongoose schema + validation deta hai |
| JWT (jsonwebtoken) | Admin login token | Stateless authentication, server par session store nahi chahiye |
| bcryptjs | Password hashing | Password kabhi plain text mein save nahi hota |
| express-validator | Input validation | Galat/malicious data database tak nahi pahunchta |
| helmet | Security headers | Common web attacks se basic protection |
| express-rate-limit | Brute-force/spam control | Login aur public forms par limit |
| cors | Cross-origin control | Sirf hamara frontend API call kar sake |
| morgan | Request logging | Debugging |
| dotenv | `.env` se config | Secrets code se bahar |

## 3. Folder structure

```
Govindpura-Poly-Clinic-Website/
├── frontend/
│   ├── index.html                 # Vite entry HTML, Google Fonts link
│   ├── vercel.json                # SPA rewrite (refresh par 404 na aaye)
│   ├── .env.example               # VITE_API_URL
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx               # App start, Router + Context providers
│       ├── App.jsx                # Saare routes
│       ├── services/api.js        # Axios instance + saare API functions
│       ├── context/
│       │   ├── AuthContext.jsx    # Admin login state
│       │   └── SiteContext.jsx    # Clinic content (name, phone...) sab pages ke liye
│       ├── hooks/useFetch.js      # GET data load karne ka hook
│       ├── components/            # Navbar, Footer, ServiceCard, DoctorCard, MapEmbed...
│       ├── pages/                 # Home, About, Services, Doctors, Appointment, Reviews, Gallery, Contact
│       │   └── admin/             # AdminLogin, AdminDashboard, panels, ResourcePanel
│       └── styles/theme.css       # Colors, typography, layout
├── backend/
│   ├── server.js                  # Entry: env load, DB connect, listen
│   ├── app.js                     # Express app: middleware + routes
│   ├── config/db.js               # MongoDB connection
│   ├── models/                    # Mongoose schemas (8)
│   ├── controllers/               # Business logic
│   ├── routes/                    # authRoutes, publicRoutes, adminRoutes
│   ├── middleware/                # auth (JWT), validate, validators, errorHandler
│   ├── utils/                     # generateToken, pick, seedAdmin, seedSample
│   ├── tests/smoke.test.js        # API smoke test
│   └── .env.example
├── documentation/
├── README.md
└── .gitignore
```

## 4. Important files ka purpose

**Backend**

- `server.js`: `.env` load karta hai, `JWT_SECRET` check karta hai, database connect karke server start karta hai. App ko alag file (`app.js`) mein rakha hai taaki testing aasaan ho.
- `app.js`: Express app banata hai: helmet, CORS, JSON parser, routes, aur sabse aakhir mein `notFound` + `errorHandler`.
- `config/db.js`: Mongoose connection. Fail hone par process exit.
- `middleware/auth.js` (`protect`): `Authorization: Bearer <token>` verify karta hai aur admin ko `req.admin` mein rakhta hai.
- `middleware/validators.js` + `validate.js`: Har form ke rules (phone, email, date, rating...) aur errors ko 400 response mein badalna.
- `middleware/errorHandler.js`: Har error ko ek jaisa JSON `{ success:false, message }` mein badalta hai (CastError, ValidationError, duplicate key, JWT errors).
- `controllers/*`: Har resource ka logic. `pick()` helper sirf allowed fields save karta hai (mass-assignment se bachav).
- `routes/publicRoutes.js`: Bina login ke endpoints. `routes/adminRoutes.js`: Saare routes par `router.use(protect)`.

**Frontend**

- `services/api.js`: Ek jagah saare API calls. Interceptor har request mein token jodta hai.
- `context/AuthContext.jsx`: Login/logout aur `me` check (page refresh par token se admin wapas pehchanta hai).
- `context/SiteContext.jsx`: Website content ek baar fetch karke Navbar, Footer, Home, Contact sab ko deta hai.
- `components/ProtectedRoute.jsx`: Login ke bina `/admin` khulne par login page par bhejta hai.
- `pages/admin/ResourcePanel.jsx`: Doctors, Services aur Gallery ke liye ek hi reusable add/edit/delete manager (DRY principle).

## 5. Data flow examples

**Patient appointment book karta hai**
1. Patient `/appointment` form bharta hai.
2. `bookAppointment()` (Axios) `POST /api/appointments` bhejta hai.
3. Express: rate limiter -> validators (naam, phone, future date) -> controller.
4. Controller check karta hai ki chuna hua doctor/service active hai, phir `Appointment.create()`.
5. `201` + success message wapas; form reset.
6. Admin dashboard mein wo "Pending" dikhta hai.

**Admin status badalta hai**
1. Admin login -> JWT token localStorage mein.
2. Dropdown se status choose -> `PATCH /api/admin/appointments/:id/status` (token header ke saath).
3. `protect` token verify -> validator status check -> DB update -> updated record wapas.

## 6. Security measures

- Passwords bcrypt (12 rounds) se hash; `select: false` se queries mein by default nahi aate.
- JWT sirf `/api/admin/*` aur `/api/auth/me` par zaroori.
- Login par rate limit (15 min mein 10 attempts); public forms par bhi limit.
- Server-side validation; client-side `required` sirf convenience hai.
- CORS sirf `CLIENT_URL` ke origins ko allow karta hai.
- `helmet` security headers; JSON body size limit 100kb.
- Reviews moderation: submit hone par `isApproved=false`, admin approve kare tabhi public.
- Production mein error stack trace response mein nahi bhejta.
