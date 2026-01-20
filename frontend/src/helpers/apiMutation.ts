import { useState } from "react";

type MutationOptions<T> = {
  optimisticUpdate: (current: T) => T;
  rollback?: (current: T) => T;
  apiCall: () => Promise<any>;
};

export function useApiMutation<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  async function mutate({
    optimisticUpdate,
    rollback,
    apiCall,
  }: MutationOptions<T>) {
    const previousState = state;

    setState(optimisticUpdate(previousState));

    try {
      await apiCall();
    } catch (err) {
      console.error(err);

      if (rollback) {
        setState(rollback(previousState));
      } else {
        setState(previousState);
      }
    }
  }

  return { state, setState, mutate };
}
