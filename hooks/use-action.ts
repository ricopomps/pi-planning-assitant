import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionState<TInput, TOutput>>;

interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput>>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<TOutput>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultOnError = (error: string) => {
    toast.error(error);
  };

  if (!options.onError) options.onError = defaultOnError;

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      try {
        const result = await action(input);

        if (!result) {
          return;
        }

        setFieldErrors(result.fieldErrors);

        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }

        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  };
};
