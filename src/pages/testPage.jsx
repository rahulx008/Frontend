'use client'
import { server } from '../api/userApi.js';
import { useEffect, useState } from 'react';

export default function TestPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
        try {
        const result = await server();
        if (!cancelled) setData(result);
        } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load data');
        } finally {
        if (!cancelled) setLoading(false);
        }
    };

    fetchData();
    return () => {
        cancelled = true;
    };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return <div>{data}</div>;
}