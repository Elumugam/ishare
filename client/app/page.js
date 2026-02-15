'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clipboard,
    Clock,
    Lock,
    Link as LinkIcon,
    Check,
    Share2,
    AlertCircle,
    Copy,
    Plus
} from 'lucide-react';
import { createClip } from '../lib/api';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
    const [content, setContent] = useState('');
    const [expiry, setExpiry] = useState(60); // Default 1 hour
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        if (!content) {
            setError('Please paste some content first.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await createClip(content, expiry, password);
            setTimeout(() => {
                setResult(data);
                setLoading(false);
            }, 800);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const reset = () => {
        setResult(null);
        setContent('');
        setPassword('');
        setShowPassword(false);
        setError('');
    };

    return (
        <main className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center space-x-2 mb-2"
                    >
                        <div className="bg-primary p-2 rounded-xl">
                            <Share2 className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">ishare</h1>
                    </motion.div>
                    <p className="text-slate-500">Securely share snippets that auto-expire.</p>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="create-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100"
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Paste Content</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Paste your text, code, or secret here..."
                                        className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-700 bg-slate-50/50"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                                        <span>Max 50,000 characters</span>
                                        <span>{content.length.toLocaleString()} chars</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                            <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                                            Expiry Time
                                        </label>
                                        <select
                                            value={expiry}
                                            onChange={(e) => setExpiry(Number(e.target.value))}
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary outline-none text-slate-700 appearance-none cursor-pointer"
                                        >
                                            <option value={10}>10 Minutes</option>
                                            <option value={60}>1 Hour</option>
                                            <option value={1440}>24 Hours</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                            <Lock className="w-4 h-4 mr-1.5 text-slate-400" />
                                            Password (Optional)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Keep it secret..."
                                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-slate-700 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 rotate-45" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleCreate}
                                    disabled={loading || !content}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] ${loading || !content
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/25 hover:shadow-primary/40'
                                        }`}
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <LinkIcon className="w-5 h-5" />
                                            <span>Generate Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 text-center"
                        >
                            <div className="mb-6">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-green-600 w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Successfully Created!</h2>
                                <p className="text-slate-500">Your temporary link is ready to share.</p>
                            </div>

                            <div className="relative mb-8 group">
                                <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-slate-50 border border-slate-200 rounded-xl p-4 pr-24 text-sm text-primary hover:text-blue-700 font-mono break-all text-left transition-colors"
                                >
                                    {result.url}
                                </a>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                                <div className="text-left space-y-4">
                                    <div className="flex items-center space-x-3 text-slate-600">
                                        <div className="bg-slate-100 p-2 rounded-lg">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Expires In</p>
                                            <p className="font-medium">
                                                {Math.floor((new Date(result.expiresAt) - new Date()) / 60000)} minutes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 text-slate-600">
                                        <div className="bg-slate-100 p-2 rounded-lg">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Protection</p>
                                            <p className="font-medium">{password ? 'Password Protected' : 'Open Access'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <QRCodeSVG value={result.url} size={120} />
                                    <p className="text-[10px] mt-2 text-slate-400 font-bold uppercase tracking-widest">Scan to View</p>
                                </div>
                            </div>

                            <button
                                onClick={reset}
                                className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors border-b border-transparent hover:border-slate-300"
                            >
                                Create Another Clip
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className="mt-12 text-center text-slate-400 text-xs">
                    Built with speed & privacy in mind. Content is encrypted and temporary.
                </footer>
            </motion.div>
        </main>
    );
}
