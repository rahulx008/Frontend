import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import axios from 'axios';
import AuthProvider from './context/authContext.jsx'
import { useGetCurrentUser } from './queries/userQueries.js';
import {Logo, SearchBar, UserRenderer} from './components/header/index.js'
import Login from './pages/auth/login.jsx';
import Logout from './pages/auth/logout.jsx';



  const videos = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title:
      "Build a Stunning YouTube Clone UI with React & Next.js",
    channel: "Code Studio",
    verified: true,
    views: "1.2M",
    uploadedAt: "2 days ago",
    duration: "12:45",
    avatar:
      "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    title:
      "Responsive CSS Grid Layout Masterclass",
    channel: "Frontend Pro",
    verified: false,
    views: "98K",
    uploadedAt: "1 week ago",
    duration: "8:10",
    avatar:
      "https://i.pravatar.cc/150?img=18",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    title:
      "Learn React in 30 Minutes — Beginner Friendly",
    channel: "Dev Master",
    verified: true,
    views: "540K",
    uploadedAt: "5 days ago",
    duration: "30:15",
    avatar:
      "https://i.pravatar.cc/150?img=22",
  },
];

export default function App() {

  return (
    <AuthProvider >
      <div>
        <Logo />
        <SearchBar />
        <UserRenderer />
      </div>
    
      <br />
      <Login />

      <br />

      <Logout />

    </AuthProvider>
  )
}


