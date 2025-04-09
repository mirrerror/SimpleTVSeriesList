import { useEffect, useState, useRef } from 'react'
import TVSeriesForm from './components/TVSeriesForm'
import TVSeriesList from './components/TVSeriesList'
import ThemeToggle from './components/ThemeToggle'
import './index.css'

export default function App() {
    const [series, setSeries] = useState(() => {
        const stored = localStorage.getItem('tvSeries')
        return stored ? JSON.parse(stored) : []
    })
    const [editingSeries, setEditingSeries] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const formRef = useRef(null)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()

        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        localStorage.setItem('tvSeries', JSON.stringify(series))
    }, [series])

    useEffect(() => {
        if (editingSeries && formRef.current) {
            formRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [editingSeries])

    const addSeries = (newSeries) => setSeries([...series, newSeries])

    const removeSeries = (id) => setSeries(series.filter(s => s.id !== id))

    const rateSeries = (id, rating) => {
        setSeries(series.map(s => s.id === id ? { ...s, rating } : s))
    }

    const editSeries = (seriesData) => {
        setEditingSeries(seriesData)
    }

    const updateSeries = (updatedSeries) => {
        if (!updatedSeries) {
            setEditingSeries(null)
            return
        }

        setSeries(series.map(s =>
            s.id === updatedSeries.id ? updatedSeries : s
        ))
        setEditingSeries(null)
    }

    return (
        <div className="min-h-screen p-2 sm:p-4 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">TV Series List</h1>
                    <ThemeToggle />
                </header>
                <div ref={formRef} className="mb-4 sm:mb-6">
                    <TVSeriesForm
                        onAdd={addSeries}
                        editSeries={editingSeries}
                        onUpdate={updateSeries}
                        isMobile={isMobile}
                    />
                </div>
                <TVSeriesList
                    series={series}
                    onRate={rateSeries}
                    onRemove={removeSeries}
                    onEdit={editSeries}
                    isMobile={isMobile}
                />
            </div>
        </div>
    )
}