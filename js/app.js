// js/app.js
import { VAPID_PUBLIC_KEY } from './config.js';
import { registerSubscription } from './api.js';

/**
 * Converte chave VAPID de Base64 para Uint8Array
 * @param {string} base64String - Chave pública em Base64
 * @returns {Uint8Array}
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Verifica se o usuário já tem uma subscription ativa
 * @returns {Promise<Boolean>}
 */
export async function checkIfSubscribed() {
  try {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch (error) {
    console.error('❌ Erro ao verificar subscription:', error);
    return false;
  }
}

/**
 * Ativa notificações push
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function enablePush() {
  try {
    // Verifica suporte
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications não suportadas neste navegador');
    }

    // Registra Service Worker
    const registration = await navigator.serviceWorker.register('./sw.js');
    console.log('✅ Service Worker registrado');

    // Pede permissão
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permissão negada para notificações');
    }

    // Cria subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    console.log('📱 Subscription criada:', subscription);

    // Registra no backend
    const result = await registerSubscription(subscription);

    if (result.success) {
      return {
        success: true,
        message: '🎉 Notificações ativadas com sucesso!'
      };
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('❌ Erro ao ativar push:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Formata data para exibição
 * @param {string|Date} data
 * @returns {string} Ex: "27/11/2024 14:30"
 */
export function formatDate(data) {
  const date = new Date(data);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formata valor monetário
 * @param {number} valor
 * @returns {string} Ex: "1.234,56"
 */
export function formatCurrency(valor) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Formata data relativa (Hoje, Ontem, etc)
 * @param {string|Date} data
 * @returns {string}
 */
export function formatRelativeDate(data) {
  const date = new Date(data);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  }
}