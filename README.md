# Govindpura Poly Clinic Website

Jhotwara, Jaipur ke **Govindpura Poly Clinic** ke liye full-stack (MERN) website: patients online appointment book kar sakte hain, enquiry bhej sakte hain, reviews dekh/likh sakte hain, aur clinic staff ek secure admin dashboard se sab kuch manage kar sakta hai.

**Stack:** React + Vite · Node.js + Express · MongoDB + Mongoose · JWT + bcrypt · Bootstrap + custom CSS

## Features

**Public website:** Home, About, Services, Doctors, Appointment Booking, Patient Enquiry (Contact page), Reviews (submit + read), Gallery, Contact + Google Map.

**Admin dashboard (`/admin`):** Overview counts, appointments (status: Pending / Confirmed / Completed / Cancelled), enquiries (read/unread), doctors CRUD, services CRUD, review approval, gallery add/remove, website content edit (clinic name, about, address, phone, timings, map).

## Important: clinic ki details

Is project mein **koi nakli doctor, qualification, service, phone, timing ya review hardcode nahi hai.** Naya database khali hota hai, aur public pages "jaldi aayega" jaisa empty state dikhate hain. Sab kuch admin dashboard se aap khud daalein:

- Website content: clinic ka tagline, about text, phone, email, WhatsApp, timings, Google Maps link
- Doctors: naam, specialization, qualification, experience, photo URL
- Services: title, description
- Gallery: clinic ki asli photos ke URLs

Sirf do cheezein pehle se likhi hain (aapke diye hue naam/jagah se): clinic ka naam **"Govindpura Poly Clinic"** aur address **"Jhotwara, Jaipur"**, aur home page ki ek generic headline. Teeno admin dashboard > Website content se badal sakte hain. Map by default naam + address se Google Maps search dikhata hai; exact location ka embed URL admin mein daalein.

Sirf design preview ke liye optional nakli data: `npm run seed:sample` (naam mein `[SAMPLE]`). Publish se pehle `npm run seed:sample:remove` zaroor chalayein.

## Requirements

- Node.js 18 ya naya (https://nodejs.org, LTS)
- MongoDB Atlas free cluster (ya local MongoDB)

## Local setup

```bash
# 1) Project folder ke andar
cd Govindpura-Poly-Clinic-Website

# 2) Backend
cd backend
npm install
cp .env.example .env        # Windows CMD: copy .env.example .env
# .env kholkar MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD bharein
npm run seed:admin          # pehla admin user banata hai
npm run dev                 # http://localhost:5000

# 3) Frontend (naye terminal mein)
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

- Website: http://localhost:5173
- Admin login: http://localhost:5173/admin/login (ya footer ka "Staff login")
- API health check: http://localhost:5000/api/health

`JWT_SECRET` ke liye random string banane ka tareeka:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Environment variables

**backend/.env** (`.env.example` dekhein)

| Variable | Kaam |
|---|---|
| `PORT` | Server port (Render khud set karta hai) |
| `NODE_ENV` | `development` ya `production` |
| `CLIENT_URL` | Frontend ka URL (CORS). Ek se zyada ho to comma se alag karein |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Token sign karne ka secret (kam se kam 16, best 32+ characters) |
| `JWT_EXPIRES_IN` | Token validity, e.g. `7d` |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Sirf `npm run seed:admin` ke liye |

**frontend/.env**

| Variable | Kaam |
|---|---|
| `VITE_API_URL` | Backend API ka base URL, `/api` ke saath |

Asli `.env` files kabhi Git/ZIP mein share na karein.

## Scripts

**backend:** `npm run dev` (nodemon) · `npm start` · `npm run seed:admin` · `npm run seed:sample` · `npm run seed:sample:remove` · `npm run test:smoke`

**frontend:** `npm run dev` · `npm run build` · `npm run preview`

## API smoke test (optional)

Backend chalate hue, **sirf test database par**:
```bash
cd backend
API_URL=http://localhost:5000/api ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpass npm run test:smoke
```
(Windows PowerShell: `$env:API_URL="..."; $env:ADMIN_EMAIL="..."; $env:ADMIN_PASSWORD="..."; npm run test:smoke`)

## Deployment

Poori guide: [documentation/Deployment-Guide.md](documentation/Deployment-Guide.md) (MongoDB Atlas, Render, Vercel).

## Documentation

- [Project Architecture](documentation/Project-Architecture.md)
- [Database Design](documentation/Database-Design.md)
- [API Documentation](documentation/API-Documentation.md)
- [Authentication](documentation/Authentication.md)
- [Deployment Guide](documentation/Deployment-Guide.md)
- [Interview Questions](documentation/Interview-Questions.md)

## Known limitations (honest list)

- Images (doctor photo, service image, gallery) **URL se** lagti hain; file upload feature nahi hai.
- Appointment time free-form hai (clinic ke asli slots pata nahi the, isliye fixed slots nahi banaye). Appointment sirf *request* hai; clinic phone par confirm karta hai.
- Password reset / change-password abhi nahi hai. Naya admin banane ya password badalne ke liye `seed:admin` ya database use karein.
- Ek hi admin role hai (multi-role nahi).
- JWT browser ke localStorage mein rehta hai (simple approach; production-grade hardening ke liye httpOnly cookie better hai).
- Email/SMS notifications nahi hain.
- Render free tier par server idle hone ke baad pehli request dheemi hoti hai.
- Google Fonts aur Google Maps ke liye internet chahiye.
