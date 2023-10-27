import { createContext, ReactNode } from 'react'
import {
    UseMutationResult,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'

// Requests
import { readSingleNotification } from '@/requests'

type IProps = null | UseMutationResult<
    {
        data: unknown
        counts: {
            all: string | undefined
            unseen: string | undefined
        }
    },
    Error,
    string,
    unknown
>

export const NotificationMutationContext = createContext<IProps>(null)

export function NotificationMutationContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const queryClient = useQueryClient()

    const readSingleMutation = useMutation({
        mutationKey: ['read-single-notification'],
        mutationFn: (id: string) => readSingleNotification(id),
        onSuccess(responseData) {
            // invalidate query for active notifications query
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                exact: false,
                type: 'active',
                refetchType: 'none',
            })

            // clear data cache for inactive notifications query
            queryClient.removeQueries({
                queryKey: ['notifications'],
                exact: false,
                type: 'inactive',
            })

            // set counts based on response
            queryClient.setQueryData(['counts'], () => {
                const counts = responseData?.counts

                return (
                    { ...counts } || {
                        all: undefined,
                        unseen: undefined,
                    }
                )
            })
        },
    })

    return (
        <NotificationMutationContext.Provider value={readSingleMutation}>
            {children}
        </NotificationMutationContext.Provider>
    )
}