const BASE_URL = "http://127.0.0.1:5000";

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function checkUser(userId) {
  const res = await fetch(`${BASE_URL}/check-user/${userId}`);
  return res.json();
}

export async function sendMessageAPI(payload) {
  const res = await fetch(`${BASE_URL}/voice-reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}