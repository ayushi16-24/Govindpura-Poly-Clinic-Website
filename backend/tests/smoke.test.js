// API smoke test. Pehle server chalayein (npm run dev), phir:
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run test:smoke
// NOTE: ye test real database mein test records banata hai, isliye
// sirf local/test database par chalayein, production par nahi.
import test from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.API_URL || "http://localhost:5000/api";
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

const call = async (method, path, body, token) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
};

let token, doctorId, serviceId, appointmentId, enquiryId, reviewId, galleryId;
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

test("health", async () => {
  const r = await call("GET", "/health");
  assert.equal(r.status, 200);
});

test("unknown route returns 404 JSON", async () => {
  const r = await call("GET", "/nope");
  assert.equal(r.status, 404);
  assert.equal(r.json.success, false);
});

test("admin routes need a token", async () => {
  assert.equal((await call("GET", "/admin/stats")).status, 401);
  assert.equal((await call("GET", "/admin/stats", null, "bad.token.value")).status, 401);
});

test("login: wrong password fails, right password works", async () => {
  assert.equal((await call("POST", "/auth/login", { email: EMAIL, password: "wrongpass" })).status, 401);
  const r = await call("POST", "/auth/login", { email: EMAIL, password: PASSWORD });
  assert.equal(r.status, 200);
  assert.ok(r.json.token);
  assert.equal(r.json.admin.password, undefined);
  token = r.json.token;
  assert.equal((await call("GET", "/auth/me", null, token)).status, 200);
});

test("doctor CRUD + public visibility", async () => {
  assert.equal((await call("POST", "/admin/doctors", { name: "" }, token)).status, 400);
  let r = await call("POST", "/admin/doctors", { name: "TEST Doctor", specialization: "TEST" }, token);
  assert.equal(r.status, 201);
  doctorId = r.json.data._id;
  r = await call("PUT", `/admin/doctors/${doctorId}`, { name: "TEST Doctor", specialization: "TEST2", experience: 5 }, token);
  assert.equal(r.json.data.specialization, "TEST2");
  r = await call("GET", "/doctors");
  assert.ok(r.json.data.some((d) => d._id === doctorId));
  await call("PUT", `/admin/doctors/${doctorId}`, { name: "TEST Doctor", specialization: "TEST2", isActive: false }, token);
  r = await call("GET", "/doctors");
  assert.ok(!r.json.data.some((d) => d._id === doctorId), "inactive doctor must be hidden");
  await call("PUT", `/admin/doctors/${doctorId}`, { name: "TEST Doctor", specialization: "TEST2", isActive: true }, token);
});

test("service CRUD", async () => {
  let r = await call("POST", "/admin/services", { title: "TEST Service", description: "desc" }, token);
  assert.equal(r.status, 201);
  serviceId = r.json.data._id;
  r = await call("PUT", `/admin/services/${serviceId}`, { title: "TEST Service 2", description: "desc" }, token);
  assert.equal(r.json.data.title, "TEST Service 2");
  assert.ok((await call("GET", "/services")).json.data.some((s) => s._id === serviceId));
});

test("appointment: validation, create, status update", async () => {
  let r = await call("POST", "/appointments", { patientName: "A", phone: "123", date: "2000-01-01", timeSlot: "" });
  assert.equal(r.status, 400);
  r = await call("POST", "/appointments", {
    patientName: "TEST Patient", phone: "98765 43210", date: tomorrow, timeSlot: "10:00 AM",
    doctor: doctorId, service: serviceId, message: "hello",
  });
  assert.equal(r.status, 201);
  appointmentId = r.json.data.id;
  r = await call("GET", "/admin/appointments?status=Pending", null, token);
  const found = r.json.data.find((a) => a._id === appointmentId);
  assert.ok(found);
  assert.equal(found.phone, "9876543210");
  assert.equal(found.doctor.name, "TEST Doctor");
  assert.equal((await call("PATCH", `/admin/appointments/${appointmentId}/status`, { status: "Bogus" }, token)).status, 400);
  r = await call("PATCH", `/admin/appointments/${appointmentId}/status`, { status: "Confirmed" }, token);
  assert.equal(r.json.data.status, "Confirmed");
});

test("enquiry: create, mark read", async () => {
  assert.equal((await call("POST", "/enquiries", { name: "T", phone: "x", message: "hi" })).status, 400);
  assert.equal((await call("POST", "/enquiries", { name: "TEST Person", phone: "9876543210", message: "Timing kya hai?" })).status, 201);
  const list = (await call("GET", "/admin/enquiries", null, token)).json.data;
  enquiryId = list.find((e) => e.name === "TEST Person")._id;
  const r = await call("PATCH", `/admin/enquiries/${enquiryId}/read`, {}, token);
  assert.equal(r.json.data.isRead, true);
});

test("review: hidden until approved", async () => {
  assert.equal((await call("POST", "/reviews", { patientName: "TEST Reviewer", rating: 9, comment: "great place" })).status, 400);
  assert.equal((await call("POST", "/reviews", { patientName: "TEST Reviewer", rating: 5, comment: "great place" })).status, 201);
  const all = (await call("GET", "/admin/reviews", null, token)).json.data;
  reviewId = all.find((x) => x.patientName === "TEST Reviewer")._id;
  assert.ok(!(await call("GET", "/reviews")).json.data.some((x) => x._id === reviewId));
  await call("PATCH", `/admin/reviews/${reviewId}/approval`, { isApproved: true }, token);
  assert.ok((await call("GET", "/reviews")).json.data.some((x) => x._id === reviewId));
});

test("gallery add/remove", async () => {
  assert.equal((await call("POST", "/admin/gallery", { imageUrl: "not-a-url" }, token)).status, 400);
  const r = await call("POST", "/admin/gallery", { imageUrl: "https://example.com/a.jpg", caption: "TEST" }, token);
  assert.equal(r.status, 201);
  galleryId = r.json.data._id;
  assert.ok((await call("GET", "/gallery")).json.data.some((g) => g._id === galleryId));
});

test("content get/update", async () => {
  let r = await call("GET", "/content");
  assert.equal(r.status, 200);
  assert.equal(r.json.data.clinicName, "Govindpura Poly Clinic");
  r = await call("PUT", "/admin/content", { phone: "9876543210", key: "hacked", _id: "x" }, token);
  assert.equal(r.json.data.phone, "9876543210");
  assert.equal(r.json.data.key, "main");
  await call("PUT", "/admin/content", { phone: "" }, token);
});

test("stats + cleanup", async () => {
  const r = await call("GET", "/admin/stats", null, token);
  assert.equal(r.status, 200);
  assert.ok(r.json.data.appointments >= 1);
  assert.equal((await call("DELETE", `/admin/appointments/${appointmentId}`, null, token)).status, 200);
  assert.equal((await call("DELETE", `/admin/enquiries/${enquiryId}`, null, token)).status, 200);
  assert.equal((await call("DELETE", `/admin/reviews/${reviewId}`, null, token)).status, 200);
  assert.equal((await call("DELETE", `/admin/gallery/${galleryId}`, null, token)).status, 200);
  assert.equal((await call("DELETE", `/admin/services/${serviceId}`, null, token)).status, 200);
  assert.equal((await call("DELETE", `/admin/doctors/${doctorId}`, null, token)).status, 200);
  assert.equal((await call("DELETE", `/admin/doctors/${doctorId}`, null, token)).status, 404);
  assert.equal((await call("GET", "/admin/doctors/not-an-id", null, token)).status, 404);
});
