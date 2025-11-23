const BASE_URL = "https://perugo-backend-production.up.railway.app";

export async function register(email, password, username = null) {
  try {
    console.log("🔗 Enviando registro a:", `${BASE_URL}/auth/register`);
    console.log("📤 Datos de registro:", { email, username, password: '***' });
    
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, password, username }),
    });

    console.log("📥 Status de respuesta:", response.status, response.statusText);

    // Obtener la respuesta como texto primero para debug
    const responseText = await response.text();
    console.log("📦 Respuesta completa del backend:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ El backend no devolvió JSON válido:", responseText);
      throw new Error("Error de comunicación con el servidor");
    }

    console.log("📊 Datos parseados:", data);

    // Si la respuesta no es exitosa, mostrar el error específico
    if (!response.ok) {
      console.error("❌ Error del backend:", data);
      throw new Error(data.error || data.message || "Error al registrar");
    }

    // Si todo sale bien, guardar el token
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log("✅ Token guardado:", data.token);
    }

    return data;

  } catch (error) {
    console.error("❌ Error completo en registro:", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    console.log("🔗 Enviando login a:", `${BASE_URL}/auth/login`);
    
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await response.text();
    console.log("📦 Respuesta login:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Respuesta no JSON:", responseText);
      throw new Error("Error de comunicación con el servidor");
    }

    if (!response.ok) {
      console.error("❌ Error en login:", data);
      throw new Error(data.error || data.message || "Error al iniciar sesión");
    }

    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("❌ Error en login:", error);
    throw error;
  }
}

export function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log("🔍 Verificando autenticación:", { 
    hasToken: !!token, 
    hasUser: !!user 
  });
  
  if (token && user) {
    return {
      isAuthenticated: true,
      user: JSON.parse(user),
      token: token
    };
  }
  
  return { isAuthenticated: false };
}

export async function recover(email) {
  try {
    const response = await fetch(`${BASE_URL}/auth/recover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al recuperar contraseña");
    return data;
  } catch (error) {
    console.error("❌ Error en recover:", error);
    throw error;
  }
}

// Funciones auxiliares
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}