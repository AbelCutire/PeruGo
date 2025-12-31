import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { destinos } from '../data/destinos'; 

const BASE_URL = 'https://perugo-backend-production.up.railway.app';

export type Plan = {
  id: string;
  destino_id: string;
  destino: string; 
  tour: string;
  precio: number;
  duracion: string;
  duracion_dias: number;
  gastos?: any;
  ubicacion?: string;
  imagen?: string;
  estado: 'borrador' | 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  resena_completada?: boolean;
};

export type PlanesContextValue = {
  planes: Plan[];
  loading: boolean;
  recargarPlanes: () => Promise<void>;
  agregarDestino: (plan: Partial<Plan>) => Promise<void>;
  actualizarPlan: (id: string, cambios: Partial<Plan>) => Promise<void>;
  eliminarPlan: (id: string) => Promise<void>;
};

const PlanesContext = createContext<PlanesContextValue | undefined>(undefined);

export function PlanesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlanes = useCallback(async () => {
    if (!token) {
      setPlanes([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/planes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mapeamos respuesta del backend con datos locales (imágenes)
        const planesMapeados = data.map((p: any) => {
          const infoDestino = destinos.find((d) => d.id === p.destino_id);
          return {
            id: p.id,
            destino_id: p.destino_id,
            destino: infoDestino?.nombre || p.destino_id,
            tour: p.tour,
            precio: p.precio,
            duracion: p.duracion || infoDestino?.duracion || 'Consultar',
            duracion_dias: 1,
            estado: p.estado,
            fecha_inicio: p.fecha_inicio,
            fecha_fin: p.fecha_fin,
            resena_completada: p.resena_completada,
            gastos: p.gastos,
            imagen: infoDestino?.imagen,
            ubicacion: infoDestino?.ubicacion
          };
        });

        setPlanes(planesMapeados);
      } else {
        console.error('Error al obtener planes');
      }
    } catch (error) {
      console.error('Error de red al obtener planes:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  const agregarDestino = async (plan: Partial<Plan>) => {
    if (!token) return;

    try {
      const body = {
        destino_id: plan.destino_id,
        tour: plan.tour,
        precio: plan.precio,
        gastos: plan.gastos,
        estado: 'borrador'
      };

      const response = await fetch(`${BASE_URL}/api/planes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el plan');
      }
      
      await fetchPlanes();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const actualizarPlan = async (id: string, cambios: Partial<Plan>) => {
    if (!token) return;

    // Actualización optimista
    setPlanes((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));

    try {
      const response = await fetch(`${BASE_URL}/api/planes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      if (!response.ok) throw new Error('Error al actualizar plan');
    } catch (error) {
      console.error(error);
      await fetchPlanes(); // Revertir en caso de error
    }
  };

  const eliminarPlan = async (id: string) => {
    if (!token) return;

    setPlanes((prev) => prev.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${BASE_URL}/api/planes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar plan');
    } catch (error) {
      console.error(error);
      await fetchPlanes();
    }
  };

  const value: PlanesContextValue = {
    planes,
    loading,
    recargarPlanes: fetchPlanes,
    agregarDestino,
    actualizarPlan,
    eliminarPlan
  };

  return <PlanesContext.Provider value={value}>{children}</PlanesContext.Provider>;
}

export function usePlanes() {
  const ctx = useContext(PlanesContext);
  if (!ctx) throw new Error('usePlanes debe usarse dentro de un PlanesProvider');
  return ctx;
}