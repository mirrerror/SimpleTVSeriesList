import { useEffect, useState } from 'react'
import TVSeriesForm from './components/TVSeriesForm'
import TVSeriesList from './components/TVSeriesList'
import ThemeToggle from './components/ThemeToggle'
import './index.css'

export default function App() {
    const [series, setSeries] = useState(() => {
        const stored = localStorage.getItem('tvSeries')
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        localStorage.setItem('tvSeries', JSON.stringify(series))
    }, [series])

    const addSeries = (newSeries) => setSeries([...series, newSeries])
    const removeSeries = (id) => setSeries(series.filter(s => s.id !== id))
    const likeSeries = (id) => {
        setSeries(series.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s))
    }

    return (
        <div className="min-h-screen p-4 bg-white text-black dark:bg-zinc-900 dark:text-white transition">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">TV Series List</h1>
                    <ThemeToggle />
                </header>
                <TVSeriesForm onAdd={addSeries} />
                <TVSeriesList series={series} onLike={likeSeries} onRemove={removeSeries} />
            </div>
        </div>
    )
}
