import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
    // server,
    getUserChannelInfo,
    getUserVideos,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUserWatchHistory,
    changePassword,
    updateAccountDetails,
    clearWatchHistory,
    registerUser,
    updateAvatar,
    updateCoverImage,
    searchUser
} from "../api/userApi.js"; 



const useGetCurrentUser = (options = {}) => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        retry: false,
        ...options
    })
}

const useRegister = () => {
    return useMutation({
        mutationFn: (data) => registerUser(data)
    })
}    

const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => loginUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentUser']);
        }
    })
}

const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['currentUser']);
        } 
    })  
}

const useChangePassword = () => {
    return useMutation({
        mutationFn: (data) => changePassword(data)
    })
}

const useUpdateAccountDetails = () => {
    return useMutation({
        mutationFn: (data) => updateAccountDetails(data)
    })
}

const useUpdateAvatar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateAvatar,
        onSuccess: () => {
            queryClient.clear()
        }
    })
}

const useUpdateCoverImage = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateCoverImage,
        onSuccess: () => {
            queryClient.clear()
        }
    })
}

const useGetUserChannelInfo = (channelId, userId, fetchOnMount = true) => {
    return useQuery({
        queryKey: ['user', channelId, userId],
        queryFn: () => getUserChannelInfo(channelId, userId),
        enabled: fetchOnMount
    })
}

const useGetUserWatchHistory = (user, limit = 3) => {
    return useInfiniteQuery({
        queryKey: ['watch_history'],
        queryFn: ({ pageParam = 1 }) => getUserWatchHistory(limit, pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.nextPage || null
        },
        keepPreviousData: true,
        enabled: !!user
    })
}



export { useGetCurrentUser, useRegister, useLogin, 
    useLogout, useChangePassword, useUpdateAccountDetails, 
    useUpdateAvatar, useUpdateCoverImage, useGetUserChannelInfo, useGetUserWatchHistory
};