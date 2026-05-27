import React from 'react'
import {ImageIcon} from '@radix-ui/react-icons'
import { useAuth } from '../../context/authContext.jsx';

export default function UserRenderer() {
    const {isAuthenticated, user} = useAuth();

    if (!isAuthenticated) {
        return (
            <>
                <ImageIcon />
                <p className="text-gray-700">Sign In</p>
            </>
        )
    }
    return (
        <>
            {user?.avatar ? (
                <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
            ) : (
                <ImageIcon />
            )}
            <p className="text-gray-700">{user?.name || "User"}</p>
        </>
    )}