import { useState, useEffect } from 'react';
import api from '../services/api';

interface ApiHealth {
  isOnline: boolean;
  latency?: number;
  lastCheck: Date;
  error?: string;
}

export const useApiHealth = (checkInterval: number = 30000) => {
  const [health, setHealth] = useState<ApiHealth>({
    isOnline: true,
    lastCheck: new Date()
  });

  const checkApiHealth = async (): Promise<ApiHealth> => {
    const startTime = Date.now();
    try {
      // Tenta fazer uma requisição simples para verificar se a API está online
      await api.get('/health-check');
      const latency = Date.now() - startTime;
      
      return {
        isOnline: true,
        latency,
        lastCheck: new Date()
      };
    } catch (error: any) {
      return {
        isOnline: false,
        lastCheck: new Date(),
        error: error.message || 'API não está respondendo'
      };
    }
  };

  useEffect(() => {
    // Verifica imediatamente
    checkApiHealth().then(setHealth);

    // Configura verificação periódica
    const interval = setInterval(async () => {
      const newHealth = await checkApiHealth();
      setHealth(newHealth);
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  return {
    health,
    checkHealth: () => checkApiHealth().then(setHealth)
  };
};

export default useApiHealth;
