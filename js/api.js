// js/api.js
import { SERVER_URL } from './config.js';

/**
 * Registra uma subscription no backend
 * @param {Object} subscription - Objeto de subscription do pushManager
 * @returns {Promise<Object>} Resposta do servidor
 */
export async function registerSubscription(subscription) {
  try {
    const response = await fetch(`${SERVER_URL}/subscriptions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(subscription)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao registrar subscription');
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao registrar subscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Busca transações do backend
 * @param {Object} filtros - { tipo?, limit? }
 * @returns {Promise<Array>} Lista de transações
 */
export async function getTransactions(filtros = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.limit) params.append('limit', filtros.limit);

    const response = await fetch(`${SERVER_URL}/transactions?${params}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar transações');
    }

    return data.data || [];
  } catch (error) {
    console.error('❌ Erro ao buscar transações:', error);
    return [];
  }
}

/**
 * Busca estatísticas das transações
 * @returns {Promise<Object>} { totalEntradas, totalSaidas, saldo }
 */
export async function getStats() {
  try {
    const response = await fetch(`${SERVER_URL}/transactions/stats`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar estatísticas');
    }

    return data.data || { totalEntradas: 0, totalSaidas: 0, saldo: 0 };
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return { totalEntradas: 0, totalSaidas: 0, saldo: 0 };
  }
}

/**
 * Verifica se o servidor está online
 * @returns {Promise<Boolean>}
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${SERVER_URL}/health`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    return response.ok;
  } catch (error) {
    console.error('❌ Servidor offline:', error);
    return false;
  }
}