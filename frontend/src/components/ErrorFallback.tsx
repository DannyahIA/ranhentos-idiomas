import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorFallbackProps {
  error?: any;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  title = "Ops! Algo deu errado",
  message,
  showRetry = true
}) => {
  const getErrorDetails = () => {
    if (!error) return { icon: AlertTriangle, message: "Erro desconhecido" };
    
    // Erro de rede
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return {
        icon: WifiOff,
        message: "Sem conexão com a internet. Verifique sua conexão e tente novamente."
      };
    }
    
    // Erro 500
    if (error.status === 500) {
      return {
        icon: AlertTriangle,
        message: "O servidor está enfrentando problemas. Nossa equipe foi notificada."
      };
    }
    
    // Erro 401
    if (error.status === 401) {
      return {
        icon: AlertTriangle,
        message: "Acesso não autorizado. Você pode precisar fazer login novamente."
      };
    }
    
    // Timeout
    if (error.code === 'ECONNABORTED') {
      return {
        icon: Wifi,
        message: "A conexão está lenta. Tente novamente."
      };
    }
    
    return {
      icon: AlertTriangle,
      message: error.message || "Erro inesperado do sistema."
    };
  };

  const { icon: Icon, message: errorMessage } = getErrorDetails();
  const displayMessage = message || errorMessage;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {displayMessage}
        </p>
        
        {showRetry && resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </button>
        )}
        
        {error?.status === 500 && (
          <p className="text-xs text-gray-500 mt-4">
            Se o problema persistir, contate o suporte técnico.
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
