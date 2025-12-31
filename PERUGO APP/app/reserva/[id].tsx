import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, Pressable, ScrollView, Modal, TextInput, Animated, Alert, ActivityIndicator } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { usePlanes } from '../../src/context/PlanesContext';
import { destinos } from '../../src/data/destinos';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { styles } from './reservaStyles';

// Estados de reserva
const ESTADOS = ['borrador', 'pendiente', 'confirmado', 'cancelado', 'completado'] as const;

// --- FUNCIONES AUXILIARES (Del código de tu amigo) ---
function buildPiePaths(values: number[], radius: number) {
  const total = values.reduce((acc, v) => acc + v, 0) || 1;
  let startAngle = -Math.PI / 2;
  const center = radius;

  return values.map((v) => {
    const sliceAngle = (v / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    const d = [`M ${center} ${center}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');
    const path = { d };
    startAngle = endAngle;
    return path;
  });
}

function formatearInputFecha(text: string): string {
  const soloDigitos = text.replace(/[^0-9]/g, '').slice(0, 8);
  const partes = [] as string[];
  if (soloDigitos.length >= 2) partes.push(soloDigitos.slice(0, 2));
  else if (soloDigitos.length > 0) partes.push(soloDigitos);
  if (soloDigitos.length >= 4) partes.push(soloDigitos.slice(2, 4));
  else if (soloDigitos.length > 2) partes.push(soloDigitos.slice(2));
  if (soloDigitos.length > 4) partes.push(soloDigitos.slice(4));
  return partes.join('/');
}

function validarFechaDdMmAaaa(fecha: string): Date | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = fecha.match(regex);
  if (!match) return null;
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const anio = parseInt(match[3], 10);
  if (anio < 1900 || anio > 2100) return null;
  if (mes < 1 || mes > 12) return null;
  if (dia < 1 || dia > 31) return null;
  const date = new Date(anio, mes - 1, dia);
  if (date.getFullYear() !== anio || date.getMonth() !== mes - 1 || date.getDate() !== dia) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (date < hoy) return null;
  return date;
}

function aDdMmAaaa(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// --- COMPONENTE PRINCIPAL ---
export default function ReservaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // 1. Usar 'loading' del contexto para saber si estamos sincronizando
  const { planes, actualizarPlan, loading: loadingPlanes } = usePlanes(); 
  
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';

  const plan = planes.find((p) => p.id === id);
  const destino = useMemo(() => {
    if (!plan) return null;
    return destinos.find((d) => d.id === plan.destino_id) || null;
  }, [plan]);

  // Sincronizar estado local con el plan real (importante si el backend lo cambia)
  const [estado, setEstado] = useState<typeof ESTADOS[number]>(plan?.estado || 'borrador');
  
  useEffect(() => {
    if (plan) setEstado(plan.estado);
  }, [plan]);

  const [mostrarFechaModal, setMostrarFechaModal] = useState(false);
  const [mostrarPagoModal, setMostrarPagoModal] = useState(false);
  const [mostrarResenaModal, setMostrarResenaModal] = useState(false);
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  
  // Estado para bloquear botones mientras el backend responde
  const [guardando, setGuardando] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  const gastosSource = plan?.gastos || destino?.gastos || {};
  const gastosEntries = Object.entries(gastosSource);
  const totalGastos = gastosEntries.reduce((acc, [, v]) => acc + (v as number), 0);

  const values = gastosEntries.map(([, v]) => v as number);
  const radius = 70;
  const paths = buildPiePaths(values, radius);

  const chartOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if ((estado === 'confirmado' || estado === 'completado') && gastosEntries.length > 0) {
      Animated.timing(chartOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      chartOpacity.setValue(0);
    }
  }, [estado, gastosEntries.length, chartOpacity]);

  // --- MANEJADORES DE EVENTOS (MODIFICADOS PARA BACKEND) ---

  const handleConfirmarFecha = async () => {
    if (!fechaSeleccionada) {
      Alert.alert('Fecha requerida', 'Ingresa la fecha de inicio en formato DD/MM/AAAA');
      return;
    }
    const inicio = validarFechaDdMmAaaa(fechaSeleccionada);
    if (!inicio) {
      Alert.alert('Fecha inválida', 'Revisa el formato y que la fecha no sea pasada');
      return;
    }

    try {
      setGuardando(true);
      const dias = plan?.duracion_dias || 1;
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + dias);

      // Enviamos a la API
      await actualizarPlan(plan!.id, {
        estado: 'pendiente',
        fecha_inicio: aDdMmAaaa(inicio),
        fecha_fin: aDdMmAaaa(fin),
      });

      setMostrarFechaModal(false);
      setFechaSeleccionada('');
      // No hace falta setEstado('pendiente') manual, el contexto actualiza 'plan' y el useEffect actualiza 'estado'
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la fecha en el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  const handlePagar = async () => {
    if (procesandoPago) return;
    try {
      setProcesandoPago(true);
      // Simulación visual de espera
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar en BD
      await actualizarPlan(plan!.id, { estado: 'confirmado' });
      
      setMostrarPagoModal(false);
      Alert.alert('¡Pago Exitoso!', 'Tu viaje ha sido confirmado en la nube.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pago.');
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleCancelar = async () => {
    Alert.alert('Cancelar Plan', '¿Seguro que deseas cancelar? Esta acción se guardará.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            setGuardando(true);
            await actualizarPlan(plan!.id, { estado: 'cancelado' });
          } catch (error) {
            Alert.alert('Error', 'No se pudo cancelar el plan.');
          } finally {
            setGuardando(false);
          }
        }
      }
    ]);
  };

  const handleReagendar = async () => {
    try {
      setGuardando(true);
      await actualizarPlan(plan!.id, { estado: 'pendiente' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo reagendar.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCompletar = async () => {
    try {
      setGuardando(true);
      await actualizarPlan(plan!.id, { estado: 'completado' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar como completado.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEnviarResena = async () => {
    try {
      setGuardando(true);
      // Aquí podrías enviar también el comentario a un endpoint de reseñas
      await actualizarPlan(plan!.id, { resena_completada: true });
      setMostrarResenaModal(false);
      Alert.alert('¡Gracias!', 'Tu reseña ha sido registrada.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la reseña.');
    } finally {
      setGuardando(false);
    }
  };


  if (loadingPlanes && !plan) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <Text style={{ color: isDark ? '#e5e7eb' : '#0f172a', marginBottom: 12 }}>
          No se encontró la reserva.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#8b5cf6', '#f97316', '#9ca3af'];
  const containerBg = isDark ? '#020617' : '#f8fafc';
  const headerText = isDark ? '#f9fafb' : '#0f172a';
  const cardBg = isDark ? '#020617' : '#ffffff';
  const cardBorder = isDark ? '#111827' : '#e2e8f0';
  const labelColor = isDark ? '#e5e7eb' : '#475569';

  const colorEstadoBorde: Record<typeof ESTADOS[number], string> = {
    borrador: '#9ca3af',
    pendiente: '#facc15',
    confirmado: '#22c55e',
    cancelado: '#ef4444',
    completado: '#3b82f6',
  };

  const etiquetaEstado: Record<typeof ESTADOS[number], string> = {
    borrador: 'Borrador',
    pendiente: 'Pendiente de pago',
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    completado: 'Completado',
  };

  const renderAccionesPorEstado = () => {
    if (guardando) return <ActivityIndicator color="#f97316" />;

    if (estado === 'borrador') {
      return (
        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => setMostrarFechaModal(true)}
        >
          <Text style={styles.primaryButtonText}>Editar y confirmar</Text>
        </Pressable>
      );
    }

    if (estado === 'pendiente') {
      return (
        <>
          <Pressable
            style={[styles.actionButton, styles.secondaryButton, { backgroundColor: '#ef4444', borderColor: '#ef4444' }]}
            onPress={handleCancelar}
          >
            <Text style={[styles.secondaryButtonText, { color: '#ffffff' }]}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => setMostrarPagoModal(true)}
          >
            <Text style={styles.primaryButtonText}>Pagar</Text>
          </Pressable>
        </>
      );
    }

    if (estado === 'confirmado') {
      return (
        <>
          <Pressable
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              const encodedTour = encodeURIComponent(plan.tour || '');
              router.push(`/destino/${plan.destino_id}?tour=${encodedTour}&fromReserva=${plan.id}`);
            }}
          >
            <Text style={[styles.secondaryButtonText, { color: headerText }]}>Ver destino</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleCompletar}
          >
            <Text style={styles.primaryButtonText}>Marcar como completado</Text>
          </Pressable>
        </>
      );
    }

    if (estado === 'cancelado') {
      return (
        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleReagendar}
        >
          <Text style={styles.primaryButtonText}>Reagendar</Text>
        </Pressable>
      );
    }

    // completado
    return (
      <Pressable
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => {
          if (!plan.resena_completada) {
            setMostrarResenaModal(true);
          }
        }}
      >
        <Text style={styles.primaryButtonText}>
          {plan.resena_completada ? 'Reseña completada' : 'Dejar reseña'}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: containerBg }} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.headerBack}>
          <Text style={[styles.headerBackIcon, { color: headerText }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: headerText }]}>Reserva · {plan?.destino}</Text>
      </View>

      {/* Tarjeta principal de reserva */}
      <View
        style={[
          styles.reservaCard,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderLeftColor: colorEstadoBorde[estado],
            borderLeftWidth: 6,
          },
        ]}
      >
        <View style={styles.reservaCardHeader}>
          {plan.imagen ? (
            <Image source={{ uri: plan.imagen }} style={styles.reservaImage} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={[styles.reservaDestino, { color: headerText }]}>{plan.destino}</Text>
            <Text style={[styles.reservaTour, { color: labelColor }]}>Tour {plan.tour} • S/ {plan.precio}</Text>
            <Text style={[styles.reservaEtapa, { color: labelColor }]}>Estado: {etiquetaEstado[estado]}</Text>
            <Text style={[styles.reservaDuracion, { color: labelColor }]}>Duración: {plan.duracion}</Text>
            {plan.fecha_inicio && plan.fecha_fin && (
              <Text style={[styles.reservaFechas, { color: '#22c55e' }]}>📅 {plan.fecha_inicio} al {plan.fecha_fin}</Text>
            )}
          </View>
        </View>

        <View style={styles.reservaActionsRow}>{renderAccionesPorEstado()}</View>
      </View>

      {/* Panel de gráfico de costos */}
      {(estado === 'confirmado' || estado === 'completado') && gastosEntries.length > 0 && (
        <Animated.View
          style={{
            opacity: chartOpacity,
            transform: [
              { translateY: chartOpacity.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
              { scale: chartOpacity.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
            ],
          }}
        >
          <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.chartTitle, { color: headerText }]}>Distribución de gastos: {plan.destino}</Text>
            <Text style={[styles.chartSubtitle, { color: labelColor }]}>Gasto total: S/ {totalGastos}</Text>

            <View style={styles.chartRow}>
              <Svg width={radius * 2} height={radius * 2}>
                {paths.map((p, index) => (
                  <Path key={index} d={p.d} fill={COLORS[index % COLORS.length]} />
                ))}
              </Svg>

              <View style={styles.legend}>
                {gastosEntries.map(([name, value], index) => (
                  <View key={name as string} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: COLORS[index % COLORS.length] },
                      ]}
                    />
                    <Text style={[styles.legendText, { color: labelColor }]}>
                      {name} — S/ {value as number}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* --- MODALES --- */}

      {/* Modal Fecha */}
      <Modal visible={mostrarFechaModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headerText }]}>Selecciona fecha de partida</Text>
            <Text style={[styles.modalText, { color: labelColor }]}>
              Duración: {plan.duracion}. Formato DD/MM/AAAA.
            </Text>

            <TextInput
              value={fechaSeleccionada}
              onChangeText={(text) => setFechaSeleccionada(formatearInputFecha(text))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={labelColor}
              style={[styles.paymentInput, { borderColor: cardBorder, color: headerText, marginBottom: 10 }]}
            />

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => setMostrarFechaModal(false)}
              >
                <Text style={[styles.secondaryButtonText, { color: headerText }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleConfirmarFecha}
                disabled={guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Confirmar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pago */}
      <Modal visible={mostrarPagoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headerText }]}>Simular pago</Text>
            {/* Desglose... */}
            {plan.gastos && (
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.modalSubtitle, { color: headerText }]}>Desglose</Text>
                {Object.entries(plan.gastos).map(([key, value]) => (
                  <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                    <Text style={{ color: labelColor, textTransform: 'capitalize' }}>{key}</Text>
                    <Text style={{ color: headerText, fontWeight: '600' }}>S/ {value as number}</Text>
                  </View>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ color: headerText, fontWeight: '700' }}>Total</Text>
                  <Text style={{ color: '#3b82f6', fontWeight: '700' }}>S/ {plan.precio}</Text>
                </View>
              </View>
            )}

            {/* Inputs simulados */}
            <TextInput editable={!procesandoPago} placeholder="Número de tarjeta" placeholderTextColor={labelColor} style={[styles.paymentInput, { borderColor: cardBorder, color: headerText, marginBottom: 8 }]} />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <TextInput editable={!procesandoPago} placeholder="MM/AA" placeholderTextColor={labelColor} style={[styles.paymentInput, { flex: 1, borderColor: cardBorder, color: headerText }]} />
              <TextInput editable={!procesandoPago} placeholder="CVV" maxLength={3} placeholderTextColor={labelColor} style={[styles.paymentInput, { flex: 1, borderColor: cardBorder, color: headerText }]} />
            </View>

            <View style={styles.modalButtonsRow}>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => !procesandoPago && setMostrarPagoModal(false)}>
                <Text style={[styles.secondaryButtonText, { color: headerText }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handlePagar} disabled={procesandoPago}>
                {procesandoPago ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Confirmar pago</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Reseña */}
      <Modal visible={mostrarResenaModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headerText }]}>Dejar reseña</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setEstrellas(star)}>
                  <Text style={{ fontSize: 26, marginHorizontal: 4, color: star <= estrellas ? '#fbbf24' : labelColor }}>★</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={comentario}
              onChangeText={setComentario}
              multiline
              placeholder="Escribe tu reseña..."
              placeholderTextColor={labelColor}
              style={[styles.reviewInput, { color: headerText, borderColor: cardBorder }]}
            />
            <View style={styles.modalButtonsRow}>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => setMostrarResenaModal(false)}>
                <Text style={[styles.secondaryButtonText, { color: headerText }]}>Cerrar</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handleEnviarResena} disabled={guardando}>
                {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Enviar</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={[styles.backToPlansButton, { borderColor: isDark ? '#334155' : '#cbd5f5', backgroundColor: isDark ? '#020617' : '#ffffff' }]}
        onPress={() => router.push('/(tabs)/mis-planes')}
      >
        <Text style={[styles.backToPlansText, { color: headerText }]}>Volver a Mis planes</Text>
      </Pressable>
    </ScrollView>
  );
}