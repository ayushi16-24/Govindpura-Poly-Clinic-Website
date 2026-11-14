# API Documentation

**Base URL:** `http://localhost:5000/api` (local) · `https://<your-service>.onrender.com/api` (production)
**Format:** JSON. Protected routes ke liye header: `Authorization: Bearer <token>`.

**Success:** `{ "success": true, "data": ... }` (ya `message`)
**Error:** `{ "success": false, "message": "..." }` (+ `stack` sirf development mein)

| Status | Matlab |
|---|---|
| 200 / 201 | OK / Created |
| 400 | Validation error, invalid ID, duplicate |
| 401 | Token nahi mila / expire / galat login |
| 404 | Route ya record nahi mila |
| 429 | Rate limit cross |
| 500 | Server error |

## Health

| Method | Path | Auth | Kaam |
|---|---|---|---|
| GET | `/health` | No | Server chal raha hai ya nahi |

## Auth

### POST `/auth/login`  (rate limit: 10 / 15 min)
```json
{ "email": "admin@example.com", "password": "yourpassword" }
```
Response 200:
```json
{ "success": true, "token": "<jwt>", "admin": { "id": "...", "name": "...", "email": "..." } }
```
401 agar email/password galat.

### GET `/auth/me`  (auth)
Current admin: `{ "success": true, "admin": { "id", "name", "email" } }`

## Public endpoints (login nahi chahiye)

| Method | Path | Kaam |
|---|---|---|
| GET | `/content` | Website content (clinic name, address, phone, timings, map...) |
| GET | `/doctors` | Sirf `isActive: true` doctors |
| GET | `/services` | Sirf `isActive: true` services |
| GET | `/reviews` | Sirf approved reviews |
| GET | `/gallery` | Saari gallery images |
| POST | `/appointments` | Appointment request |
| POST | `/enquiries` | Patient enquiry |
| POST | `/reviews` | Review submit (approval ke baad dikhega) |

POST endpoints par combined rate limit: ek IP se 15 minute mein 20 requests.

### POST `/appointments`
```json
{
  "patientName": "Name",
  "phone": "9876543210",
  "email": "optional@example.com",
  "doctor": "<doctorId optional>",
  "service": "<serviceId optional>",
  "date": "2026-12-01",
  "timeSlot": "11:30",
  "message": "optional, max 500 chars"
}
```
Validation: naam 2-80 chars; phone `^(\+91)?[6-9]\d{9}$` (spaces/hyphens hata diye jate hain); date aaj ya future; doctor/service valid aur active hone chahiye.
Response 201: `{ "success": true, "message": "...", "data": { "id": "...", "status": "Pending" } }`

### POST `/enquiries`
```json
{ "name": "Name", "phone": "9876543210", "email": "optional", "message": "min 5, max 1000 chars" }
```
Response 201: `{ "success": true, "message": "..." }`

### POST `/reviews`
```json
{ "patientName": "Name", "rating": 5, "comment": "min 5, max 600 chars" }
```
`rating` 1-5 integer. Response 201 (record `isApproved: false` ke saath).

## Admin endpoints (JWT zaroori) — prefix `/admin`

### Dashboard
| Method | Path | Response |
|---|---|---|
| GET | `/admin/stats` | `{ appointments, pending, enquiries, unread, doctors, services, pendingReviews }` |

### Appointments
| Method | Path | Body | Kaam |
|---|---|---|---|
| GET | `/admin/appointments?status=Pending` | | List (status filter optional), doctor/service populated |
| PATCH | `/admin/appointments/:id/status` | `{ "status": "Confirmed" }` | Status update (Pending, Confirmed, Completed, Cancelled) |
| DELETE | `/admin/appointments/:id` | | Delete |

### Doctors
| Method | Path | Body |
|---|---|---|
| GET | `/admin/doctors` | (saare, hidden bhi) |
| POST | `/admin/doctors` | `{ name*, specialization*, qualification, experience, photo(URL), availability, bio, isActive }` |
| PUT | `/admin/doctors/:id` | same fields |
| DELETE | `/admin/doctors/:id` | |

### Services
| Method | Path | Body |
|---|---|---|
| GET | `/admin/services` | |
| POST | `/admin/services` | `{ title*, description*, icon, image(URL), isActive }` |
| PUT | `/admin/services/:id` | same |
| DELETE | `/admin/services/:id` | |

### Enquiries
| Method | Path | Body |
|---|---|---|
| GET | `/admin/enquiries` | |
| PATCH | `/admin/enquiries/:id/read` | `{ "isRead": true }` (default true) |
| DELETE | `/admin/enquiries/:id` | |

### Reviews
| Method | Path | Body |
|---|---|---|
| GET | `/admin/reviews` | (approved + pending) |
| PATCH | `/admin/reviews/:id/approval` | `{ "isApproved": true }` |
| DELETE | `/admin/reviews/:id` | |

### Gallery
| Method | Path | Body |
|---|---|---|
| POST | `/admin/gallery` | `{ imageUrl*(URL), caption }` |
| DELETE | `/admin/gallery/:id` | |

(List ke liye public `GET /gallery` hi use hota hai.)

### Website content
| Method | Path | Body |
|---|---|---|
| PUT | `/admin/content` | koi bhi: `clinicName, tagline, heroTitle, heroSubtitle, aboutText, address, phone, email, whatsapp, timings, mapEmbedUrl, mapLink` |

Sirf ye allowed fields save hote hain; baaki (jaise `key`, `_id`) ignore.

## curl examples

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'

# Protected call
curl http://localhost:5000/api/admin/stats -H "Authorization: Bearer <token>"
```
