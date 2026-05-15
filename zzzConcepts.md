queryClient.setQueryData(queryKey, updater) -->
    -- It changes data already stored in React Query cache.
    -- Example:

    queryClient.setQueryData(['todos'], old => {
        return [...old, newTodo]
    })