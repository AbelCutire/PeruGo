const BASE_URL = "https://perugo-backend-production.up.railway.app";

export async function login(email, username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");
  return data; // { token }
}

export async function register(email, username, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al registrar");
  return data;
}

export async function recover(email) {
  const response = await fetch(`${BASE_URL}/auth/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al recuperar contraseña");
  return data;
}
