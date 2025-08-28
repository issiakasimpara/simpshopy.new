import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  title?: string;
  description?: string;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    context?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      title = "Une erreur est survenue",
      description,
      logError = true
    } = options;

    if (logError) {
      console.error(`[${context || 'Unknown'}]`, error);
    }

    if (showToast) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Une erreur inattendue s\'est produite';

      toast({
        title,
        description: description || errorMessage,
        variant: "destructive"
      });
    }

    return {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context
    };
  }, [toast]);

  const handleAsyncError = useCallback(async (
    asyncOperation: () => Promise<any>,
    context?: string,
    options?: ErrorHandlerOptions
  ): Promise<any> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, context, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};