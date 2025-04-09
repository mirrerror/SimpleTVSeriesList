import { useState } from 'react'
import { nanoid } from 'nanoid'

export default function TVSeriesForm({ onAdd }) {
    const [title, setTitle] = useState('')
    const [genre, setGenre] = useState('')
    const [status, setStatus] = useState('Watching')

    const handleSubmit = (e) => {
        e.preventDefault()
        onAdd({ id: nanoid(), title, genre, status, likes: 0 })
        setTitle('')
        setGenre('')
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
                <input
                    type="text" placeholder="Title" required
                    value={title} onChange={e => setTitle(e.target.value)}
                    className="border rounded px-3 py-2 w-full bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
                <input
                    type="text" placeholder="Genre"
                    value={genre} onChange={e => setGenre(e.target.value)}
                    className="border rounded px-3 py-2 w-full bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
                <select
                    value={status} onChange={e => setStatus(e.target.value)}
                    className="border rounded px-3 py-2 w-full bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                >
                    <option>Watching</option>
                    <option>Watched</option>
                    <option>Plan to Watch</option>
                </select>
            </div>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Series
            </button>
        </form>
    )
}
