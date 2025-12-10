// src/services/planes.js
import { getToken } from "./auth";

// Usamos la misma URL base que en auth.js
const BASE_URL = "https://perugo-backend-production.up.railway.app";

// Helper para obtener headers con token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// 📥 Obtener todos los planes del usuario
export async function getPlanes() {
  try {
    const response = await fetch(`${BASE_URL}/api/planes`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al obtener planes");
    
    const data = await response.json();
    return data; // Retorna el array de planes
  } catch (error) {
    console.error("❌ Error en getPlanes:", error);
    throw error;
  }
}

// 📝 Crear un nuevo plan
export async function createPlan(planData) {
  try {
    // planData debe tener: { destino_id, tour, precio, gastos, ... }
    const response = await fetch(`${BASE_URL}/api/planes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });

    if (!response.ok) throw new Error("Error al crear plan");
    
    return await response.json();
  } catch (error) {
    console.error("❌ Error en createPlan:", error);
    throw error;
  }
}

// 🔄 Actualizar un plan (fechas, estado, etc.)
export async function updatePlan(planId, updates) {
  try {
    const response = await fetch(`${BASE_URL}/api/planes/${planId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Error al actualizar plan");
    
    return await response.json();
  } catch (error) {
    console.error("❌ Error en updatePlan:", error);
    throw error;
  }
}

// ❌ Eliminar un plan
export async function deletePlan(planId) {
  try {
    const response = await fetch(`${BASE_URL}/api/planes/${planId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar plan");
    
    return await response.json();
  } catch (error) {
    console.error("❌ Error en deletePlan:", error);
    throw error;
  }
}

// ⭐ Enviar reseña
export async function createReview(reviewData) {
  try {
    // reviewData: { plan_id, destino_id, estrellas, comentario }
    const response = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) throw new Error("Error al enviar reseña");
    
    return await response.json();
  } catch (error) {
    console.error("❌ Error en createReview:", error);
    throw error;
  }
}
