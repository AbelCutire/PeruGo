const BASE_URL = "https://perugo-backend-production.up.railway.app";

export async function register(email, username, password) {
  try {
    console.log("🔗 Enviando registro a:", `${BASE_URL}/auth/register`);
    console.log("📤 Datos de registro:", { email, username, password: '***' });
    
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        email: email.toLowerCase().trim(), 
        username, 
        password 
      }),
    });

    console.log("📥 Status de respuesta:", response.status, response.statusText);

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

    if (!response.ok) {
      console.error("❌ Error del backend:", data);
      throw new Error(data.error || data.message || "Error al registrar");
    }

    // El registro NO devuelve token, solo message y user_id
    console.log("✅ Registro exitoso:", data);
    return data;

  } catch (error) {
    console.error("❌ Error completo en registro:", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    console.log("🔗 Enviando login a:", `${BASE_URL}/auth/login`);
    console.log("📤 Datos de login:", { email, password: '***' });
    
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        email: email.toLowerCase().trim(), 
        password 
      }),
    });

    const responseText = await response.text();
    console.log("📦 Respuesta login completa:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Respuesta no JSON:", responseText);
      throw new Error("Error de comunicación con el servidor");
    }

    console.log("📊 Datos parseados del login:", data);
    console.log("👤 Usuario recibido:", data.user);

    if (!response.ok) {
      console.error("❌ Error en login:", data);
      throw new Error(data.error || data.message || "Error al iniciar sesión");
    }

    if (data.token && data.user) {
      // ✅ Guardar TODO el objeto user (debe incluir: id, email, username)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log("✅ Token guardado:", data.token.substring(0, 20) + "...");
      console.log("✅ Usuario guardado:", data.user);
      console.log("✅ Username guardado:", data.user.username); // 🔍 Verificación
    }

    return data;
  } catch (error) {
    console.error("❌ Error en login:", error);
    throw error;
  }
}

export function checkAuth() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log("🔍 Verificando autenticación:", { 
    hasToken: !!token, 
    hasUser: !!userStr 
  });
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("👤 Usuario en checkAuth:", user);
      
      return {
        isAuthenticated: true,
        user: user, // ✅ Incluye: id, email, username
        token: token
      };
    } catch (e) {
      console.error("❌ Error parseando user:", e);
      return { isAuthenticated: false };
    }
  }
  
  return { isAuthenticated: false };
}

export async function recover(email) {
  try {
    console.log("🔗 Enviando recuperación a:", `${BASE_URL}/auth/recover`);
    
    const response = await fetch(`${BASE_URL}/auth/recover`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Error al recuperar contraseña");
    }
    
    console.log("✅ Recuperación enviada:", data);
    return data;
    
  } catch (error) {
    console.error("❌ Error en recover:", error);
    throw error;
  }
}

// Funciones auxiliares
export function logout() {
  console.log("🚪 Cerrando sesión...");
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('lastEmail');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    console.log("👤 getUser devuelve:", user);
    return user; // ✅ Debe tener: { id, email, username }
  } catch (e) {
    console.error("❌ Error parseando user:", e);
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// ✅ Nueva función para obtener usuario actual
export function getCurrentUser() {
  return getUser();
}
