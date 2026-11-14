# Database Design

Database: **MongoDB Atlas**, ODM: **Mongoose**. Database ka naam connection string mein hota hai (e.g. `govindpura-clinic`). Saare models mein `timestamps: true` hai (`createdAt`, `updatedAt` automatic).

## Collections

### 1. Admin (`admins`)
| Field | Type | Notes |
|---|---|---|
| name | String, required | |
| email | String, required, **unique**, lowercase | login ID |
| password | String, required, min 8, `select:false` | bcrypt hash save hota hai |

Methods/hooks: `pre('save')` password hash karta hai (sirf jab change ho); `matchPassword(plain)` compare karta hai.

### 2. Doctor (`doctors`)
| Field | Type | Notes |
|---|---|---|
| name | String, required | |
| specialization | String, required | |
| qualification | String | admin khud daalta hai |
| experience | Number (>=0) | years |
| photo | String | image URL |
| availability | String | free text |
| bio | String | |
| isActive | Boolean, default true | false ho to public site par hidden |

### 3. Service (`services`)
| Field | Type | Notes |
|---|---|---|
| title | String, required | |
| description | String, required | |
| icon | String | chhota letter/emoji |
| image | String | image URL |
| isActive | Boolean, default true | |

### 4. Appointment (`appointments`)
| Field | Type | Notes |
|---|---|---|
| patientName | String, required | |
| phone | String, required | validate + normalize (spaces/hyphens hata dete hain) |
| email | String | optional |
| doctor | ObjectId -> Doctor | optional |
| service | ObjectId -> Service | optional |
| date | Date, required | aaj ya future |
| timeSlot | String, required | patient ka preferred time |
| message | String | optional, max 500 |
| status | enum: Pending / Confirmed / Completed / Cancelled | default Pending |

Admin list mein `populate()` se doctor aur service ke naam aate hain.

### 5. Enquiry (`enquiries`)
| Field | Type | Notes |
|---|---|---|
| name | String, required | |
| phone | String, required | |
| email | String | optional |
| message | String, required | |
| isRead | Boolean, default false | admin mark karta hai |

### 6. Review (`reviews`)
| Field | Type | Notes |
|---|---|---|
| patientName | String, required | |
| rating | Number 1-5, required | |
| comment | String, required | |
| isApproved | Boolean, default false | approve ke baad hi public |

### 7. GalleryImage (`galleryimages`)
| Field | Type |
|---|---|
| imageUrl | String, required |
| caption | String |

### 8. SiteContent (`sitecontents`)
Poori website ke liye **sirf ek document** (`key: "main"`, unique). `GET /api/content` par document na ho to defaults ke saath `upsert` se ban jata hai.

Fields: clinicName, tagline, heroTitle, heroSubtitle, aboutText, address, phone, email, whatsapp, timings, mapEmbedUrl, mapLink (sab String).

## Relationships

```
Doctor 1 ---- * Appointment * ---- 1 Service
```
Appointment mein doctor/service sirf reference (ObjectId) hai. Doctor ya service delete hone par purani appointments rehti hain, aur admin list mein wo field khali dikhegi (`populate` null deta hai).

## Design decisions (interview mein bata sakte hain)

- **Soft visibility (`isActive`)** delete ke bajaye: doctor/service ko temporarily hide kar sakte hain.
- **Singleton SiteContent**: website text ek hi document mein, admin edit kare to turant poori site update.
- **References, embedding nahi**: Doctor/Service independent entities hain aur alag manage hote hain.
- **Moderation flag** reviews par: spam ya galat review public nahi hota.
- **Password `select:false`**: galti se API response mein hash leak na ho.
