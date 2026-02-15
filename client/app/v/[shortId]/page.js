'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    Clock,
    Copy,
    Check,
    AlertCircle,
    ChevronLeft,
    Eye,
    FileText
} from 'lucide-react';
import { getClip } from '../../../lib/api';
import Link from 'next/link';

export default function ViewClip() {
    const { shortId } = useParams();
    const [data, setData] = useState(null);
    const [password, setPassword] = useState('');
    const [isProtected, setIsProtected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState('');

    const fetchClip = async (pwd = '') => {
        setLoading(true);
        setError('');
        try {
            const response = await getClip(shortId, pwd);
            setData(response);
            setIsProtected(false);
        } catch (err) {
            if (err.response?.status === 401 && err.response?.data?.isPasswordProtected) {
                setIsProtected(true);
            } else {
                setError(err.response?.data?.error || 'This clip could not be found or has expired.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClip();
    }, [shortId]);

    useEffect(() => {
        if (data?.expiresAt) {
            const interval = setInterval(() => {
                const remaining = new Date(data.expiresAt) - new Date();
                if (remaining <= 0) {
                    setCountdown('Expired');
                    clearInterval(interval);
                } else {
                    const hours = Math.floor(remaining / 3600000);
                    const minutes = Math.floor((remaining % 3600000) / 60000);
                    const seconds = Math.floor((remaining % 60000) / 1000);
                    setCountdown(`${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [data]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        fetchClip(password);
    };

    const copyToClipboard = () => {
        if (data?.content) {
            navigator.clipboard.writeText(data.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full"
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-slate-400 hover:text-slate-600 mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Create New Clip
                </Link>

                {isProtected ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100"
                    >
                        <div className="text-center mb-8">
                            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="text-amber-600 w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Password Protected</h2>
                            <p className="text-slate-500 text-sm">This snippet is encrypted. Enter the password to view.</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoFocus
                                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-slate-700 text-center text-lg tracking-widest"
                            />
                            <button
                                type="submit"
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                            >
                                <Eye className="w-5 h-5" />
                                <span>Unlock Clip</span>
                            </button>
                        </form>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 text-center"
                    >
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-red-600 w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Oops!</h2>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <Link
                            href="/"
                            className="inline-block w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                        >
                            Back to Home
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div>
                                <div className="flex items-center space-x-2 text-slate-400 mb-1">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Shared Snippet</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Viewing Clip #{shortId}</h2>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-inner">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Expires in: </span>
                                    <span className="text-sm font-bold text-slate-900 tabular-nums">{countdown}</span>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-all shadow-md shadow-primary/20 active:scale-95"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                            <div className="p-8">
                                <pre className="text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all bg-slate-50/50 p-6 rounded-xl border border-slate-100 min-h-[300px]">
                                    {data?.content}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
