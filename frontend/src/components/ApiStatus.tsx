import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface ApiStatusProps {
  isLoading: boolean;
  error: any;
  onRetry: () => void;
  maxRetries?: number;
  retryDelay?: number;
}

const ApiStatus: React.FC<ApiStatusProps> = ({
  isLoading,
  error,
  onRetry,
  maxRetries = 3,
  retryDelay = 2000
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        onRetry();
        setIsRetrying(false);
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [error, retryCount, maxRetries, retryDelay, onRetry]);

  if (isLoading || isRetrying) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-blue-600" />
        <span className="text-gray-600">
          {isRetrying ? `Tentativa ${retryCount}/${maxRetries}...` : 'Carregando...'}
        </span>
      </div>
    );
  }

  if (error && retryCount >= maxRetries) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-red-600 mb-2">
          Falha na conexão após {maxRetries} tentativas
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Verifique sua conexão ou tente novamente mais tarde
        </p>
        <button
          onClick={() => {
            setRetryCount(0);
            onRetry();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-2">
      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
      <span className="text-green-600 text-sm">Conectado</span>
    </div>
  );
};

export default ApiStatus;
