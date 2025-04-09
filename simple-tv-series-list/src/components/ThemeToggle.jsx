import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('theme') === 'dark' ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches &&
                localStorage.getItem('theme') !== 'light')
    })

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, [dark])

    return (
        <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700"
        >
            {dark ? '🌙 Dark' : '☀️ Light'}
        </button>
    )
}