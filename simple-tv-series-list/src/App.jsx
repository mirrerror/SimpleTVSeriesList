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
    const formRef = useRef(null)

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
        <div className="min-h-screen p-4 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">TV Series List</h1>
                    <ThemeToggle />
                </header>
                <div ref={formRef}>
                    <TVSeriesForm
                        onAdd={addSeries}
                        editSeries={editingSeries}
                        onUpdate={updateSeries}
                    />
                </div>
                <TVSeriesList
                    series={series}
                    onRate={rateSeries}
                    onRemove={removeSeries}
                    onEdit={editSeries}
                />
            </div>
        </div>
    )
}