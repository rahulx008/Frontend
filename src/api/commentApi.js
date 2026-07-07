import asyncHandler from '../utils/AsyncHandler'
import { apiClient } from './apiClient'

const COMMENT_BASE_URL = '/api/v1/comments'

const CreateComment = (data) => asyncHandler(async () => {
    const res = await apiClient.post(`${COMMENT_BASE_URL}/create`, data)
    return res.data;
})

const UpdateComment = (commentId, data) => asyncHandler(async () => {
    const res = await apiClient.patch(`${COMMENT_BASE_URL}/update/${commentId}`, data)
    return res.data;
})

const DeleteComment = (commentId) => asyncHandler(async () => {
    const res = await apiClient.delete(`${COMMENT_BASE_URL}/delete/${commentId}`)
    return res.data;
})

const togglePinComment = (commentId) => asyncHandler(async () => {
    const res = await apiClient.patch(`${COMMENT_BASE_URL}/togglePin`, { commentId })
    return res.data;
})

const getComments = (videoId) => asyncHandler(async () => {
    const res = await apiClient.get(`${COMMENT_BASE_URL}/getComments/${videoId}`)
    return res.data;
})

const getReplies = (commentId) => asyncHandler(async () => {
    const res = await apiClient.get(`${COMMENT_BASE_URL}/getReplies/${commentId}`)
    return res.data;
})

export {
    CreateComment,
    UpdateComment,
    DeleteComment,
    togglePinComment,
    getComments,
    getReplies
}