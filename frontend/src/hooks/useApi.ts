import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../contexts/ToastContext';
import { ApiError } from '../services/api';

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: string[];
}

export function useApiMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  invalidateQueries = []
}: UseApiMutationOptions<TData, TVariables>) {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      // Show success message
      if (successMessage) {
        showSuccess(successMessage);
      }

      // Call custom onSuccess
      onSuccess?.(data, variables);
    },
    onError: (error: ApiError, variables) => {
      // Show error message
      const message = errorMessage || error.message || 'Ocorreu um erro inesperado';
      
      // Format validation errors if present
      if (error.errors) {
        const validationErrors = Object.entries(error.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        
        showError(message, validationErrors);
      } else {
        showError(message);
      }

      // Call custom onError
      onError?.(error, variables);
    }
  });
}

interface UseApiQueryOptions<TData> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  showErrorToast?: boolean;
}

export function useApiQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime,
  showErrorToast = true
}: UseApiQueryOptions<TData>) {
  const { showError } = useToast();

  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    retry: (failureCount, error: any) => {
      // Não tentar novamente em erros 4xx
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Tentar até 2 vezes em outros erros
      return failureCount < 2;
    }
  });

  // Handle errors manually
  React.useEffect(() => {
    if (query.error && showErrorToast) {
      const error = query.error as ApiError;
      const message = error.message || 'Erro ao carregar dados';
      showError(message);
    }
  }, [query.error, showErrorToast, showError]);

  return query;
}
