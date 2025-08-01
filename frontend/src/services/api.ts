import axios, { AxiosError } from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout
});

// Interface para erros padronizados
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Função para extrair mensagem de erro
export const getErrorMessage = (error: any): ApiError => {
  if (!error) {
    return { message: 'Erro desconhecido' };
  }

  // Erro de rede (sem conexão com servidor)
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    return {
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      status: 0
    };
  }

  // Timeout
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return {
      message: 'A solicitação demorou muito para responder. Tente novamente.',
      status: 408
    };
  }

  // Erro HTTP com resposta do servidor
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          message: data?.message || 'Dados inválidos enviados',
          status,
          errors: data?.errors
        };
      case 401:
        return {
          message: 'Não autorizado. Faça login novamente.',
          status
        };
      case 403:
        return {
          message: 'Acesso negado. Você não tem permissão.',
          status
        };
      case 404:
        return {
          message: 'Recurso não encontrado',
          status
        };
      case 422:
        return {
          message: data?.message || 'Dados de validação incorretos',
          status,
          errors: data?.errors
        };
      case 429:
        return {
          message: 'Muitas tentativas. Tente novamente mais tarde.',
          status
        };
      case 500:
        return {
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
          status
        };
      case 502:
      case 503:
      case 504:
        return {
          message: 'Servidor temporariamente indisponível. Tente novamente.',
          status
        };
      default:
        return {
          message: data?.message || `Erro ${status}: ${error.message}`,
          status
        };
    }
  }

  // Erro sem resposta (rede, DNS, etc.)
  return {
    message: error.message || 'Erro de conexão. Verifique sua internet.',
    status: 0
  };
};

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Adicionar timestamp para evitar cache em algumas situações
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = getErrorMessage(error);
    console.error('API Error:', {
      message: apiError.message,
      status: apiError.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data
    });
    
    // Rejeitar com erro estruturado
    return Promise.reject(apiError);
  }
);

export default api;
