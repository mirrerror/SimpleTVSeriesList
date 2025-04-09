import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'

export default function TVSeriesForm({ onAdd, editSeries, onUpdate }) {
    const [title, setTitle] = useState('')
    const [genre, setGenre] = useState('')
    const [link, setLink] = useState('')
    const [imageLink, setImageLink] = useState('')
    const [status, setStatus] = useState('Watching')
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        if (editSeries) {
            setTitle(editSeries.title || '')
            setGenre(editSeries.genre || '')
            setLink(editSeries.link || '')
            setImageLink(editSeries.imageLink || '')
            setStatus(editSeries.status || 'Watching')
            setIsEditing(true)
            setEditId(editSeries.id)
        }
    }, [editSeries])

    const resetForm = () => {
        setTitle('')
        setGenre('')
        setLink('')
        setImageLink('')
        setStatus('Watching')
        setIsEditing(false)
        setEditId(null)
    }

    const validateUrls = () => {
        if (link.trim()) {
            try {
                new URL(link)
            } catch {
                alert('Please enter a valid URL for the Link field.')
                return false
            }
        }

        if (imageLink.trim()) {
            try {
                new URL(imageLink)
            } catch {
                alert('Please enter a valid URL for the Image Link field.')
                return false
            }
        }
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateUrls()) return

        if (isEditing && editId) {
            onUpdate({
                id: editId,
                title,
                genre,
                status,
                link,
                imageLink,
                rating: editSeries?.rating
            })
        } else {
            onAdd({
                id: nanoid(),
                title,
                genre,
                status,
                link,
                imageLink
            })
        }

        resetForm()
    }

    const handleCancel = () => {
        resetForm()
        if (onUpdate) {
            onUpdate(null)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <h2 className="text-xl font-bold mb-3">
                {isEditing ? 'Edit Series' : 'Add New Series'}
            </h2>
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
                <input
                    type="text" placeholder="Link"
                    value={link} onChange={e => setLink(e.target.value)}
                    className="border rounded px-3 py-2 w-full bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
                <input
                    type="text" placeholder="Image Link"
                    value={imageLink} onChange={e => setImageLink(e.target.value)}
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
            <div className="flex gap-2 mt-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-fuchsia-700 text-white rounded hover:bg-amber-500"
                >
                    {isEditing ? 'Update Series' : 'Add Series'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}