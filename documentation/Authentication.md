# Authentication (Admin)

Sirf admin ko login chahiye. Patients ko account nahi banana padta.

## Flow

```
1. Admin email + password bhejta hai      POST /api/auth/login
2. Server email se admin dhundta hai (password field explicitly select karke)
3. bcrypt.compare(plain, hash)
4. Sahi hone par JWT banta hai: { id: <adminId> }, secret = JWT_SECRET, expiry = JWT_EXPIRES_IN
5. Frontend token localStorage mein rakhta hai (key: gpc_admin_token)
6. Axios interceptor har request mein  Authorization: Bearer <token>  lagata hai
7. Backend `protect` middleware: token verify -> admin DB se load -> req.admin
```

## bcrypt kyun?
Password ko one-way **hash** karte hain (12 salt rounds). Database leak ho jaye tab bhi original password nahi milta. Project `bcryptjs` use karta hai (same algorithm ka pure-JS version; Windows par bina C++ build tools ke install hota hai).

## JWT kyun?
Token mein admin ka `id` aur expiry hoti hai, signature `JWT_SECRET` se. Server ko session store nahi rakhna padta (stateless), isliye Render par scale/restart ke baad bhi login valid rehta hai.

## Files

| File | Kaam |
|---|---|
| `backend/models/Admin.js` | Password hashing hook, `matchPassword` |
| `backend/controllers/authController.js` | `login`, `me` |
| `backend/utils/generateToken.js` | JWT sign |
| `backend/middleware/auth.js` | `protect` (token verify) |
| `backend/routes/authRoutes.js` | Login route + rate limiter |
| `backend/routes/adminRoutes.js` | `router.use(protect)`: saare admin routes locked |
| `backend/utils/seedAdmin.js` | Pehla admin `.env` se banata hai |
| `frontend/src/context/AuthContext.jsx` | login/logout, refresh par `me` se session restore |
| `frontend/src/components/ProtectedRoute.jsx` | Frontend route guard |
| `frontend/src/services/api.js` | Token interceptor |

## Pehla admin kaise banta hai
Public signup route **jaanbujhkar nahi hai** (koi bhi admin na ban jaye). `.env` mein `ADMIN_EMAIL` / `ADMIN_PASSWORD` daalkar `npm run seed:admin` chalate hain.

## Security notes

- Galat email ya password dono par same message ("Email ya password galat hai"), taaki attacker ko pata na chale ki email exist karta hai.
- Login par rate limit: ek IP se 15 minute mein 10 attempts.
- `JWT_SECRET` kam se kam 16 characters ka hona zaroori hai (server start par check hota hai); 48+ random bytes best hai.
- Token expire hone par (`TokenExpiredError`) 401 aata hai aur admin ko dobara login karna padta hai.
- **Frontend route guard sirf UX hai.** Asli security backend ke `protect` middleware se hai; bina token ke API 401 deti hai.

## Known limitations

- Token localStorage mein hai: XSS ki surat mein chori ho sakta hai. Zyada secure option: httpOnly + Secure + SameSite cookie.
- Logout sirf client se token hata deta hai (stateless JWT ko server par revoke nahi karte).
- Change-password / forgot-password abhi nahi hai.
