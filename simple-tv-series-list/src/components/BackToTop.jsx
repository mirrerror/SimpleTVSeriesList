import { useState, useEffect } from 'react'

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-fuchsia-700 text-white p-3 rounded-full shadow-lg hover:bg-fuchsia-600 transition"
                    aria-label="Back to top"
                    style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
                >
                    ↑
                </button>
            )}
        </>
    )
}