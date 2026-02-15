import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
    title: 'ishare - Instant Temporary Sharing',
    description: 'Paste text and instantly generate a temporary shareable link that auto-expires.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
                {children}
            </body>
        </html>
    )
}
