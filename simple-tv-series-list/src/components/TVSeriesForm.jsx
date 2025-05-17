import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'

export default function TVSeriesForm({ onAdd, editSeries, onUpdate, isMobile }) {
    const [title, setTitle] = useState('')
    const [genre, setGenre] = useState('')
    const [link, setLink] = useState('')
    const [imageLink, setImageLink] = useState('')
    const [status, setStatus] = useState('Watching')
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)
    const [errors, setErrors] = useState({})
    const [dateAdded, setDateAdded] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (editSeries) {
            setTitle(editSeries.title || '')
            setGenre(editSeries.genre || '')
            setLink(editSeries.link || '')
            setImageLink(editSeries.imageLink || '')
            setStatus(editSeries.status || 'Watching')
            setIsEditing(true)
            setEditId(editSeries.id)
            setDateAdded(editSeries.dateAdded || '')
            setIsExpanded(true)
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
        setDateAdded('')
        setErrors({})
        setIsExpanded(false)
    }

    const validateUrls = () => {
        let result = true

        if (link.trim()) {
            try {
                new URL(link)
            } catch {
                setErrors(prev => ({ ...prev, link: 'Invalid URL' }))
                result = false
            }
        }

        if (imageLink.trim()) {
            try {
                new URL(imageLink)
            } catch {
                setErrors(prev => ({ ...prev, imageLink: 'Invalid URL' }))
                result = false
            }
        }

        return result
    }

    const validateField = (field, value) => {
        let newErrors = { ...errors }

        switch (field) {
            case 'title':
                if (!value.trim()) {
                    newErrors.title = 'Required'
                } else {
                    delete newErrors.title
                }
                break
            case 'link':
                if (value.trim()) {
                    try {
                        new URL(value)
                        delete newErrors.link
                    } catch {
                        newErrors.link = 'Invalid URL'
                    }
                } else {
                    delete newErrors.link
                }
                break
            case 'imageLink':
                if (value.trim()) {
                    try {
                        new URL(value)
                        delete newErrors.imageLink
                    } catch {
                        newErrors.imageLink = 'Invalid URL'
                    }
                } else {
                    delete newErrors.imageLink
                }
                break
            default:
                break
        }

        setErrors(newErrors)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!title.trim()) {
            setErrors(prev => ({ ...prev, title: 'Required' }))
            return
        }

        if (!validateUrls()) return

        const currentDate = new Date().toISOString()

        if (isEditing && editId) {
            onUpdate({
                id: editId,
                title,
                genre,
                status,
                link,
                imageLink,
                rating: editSeries?.rating,
                dateAdded: dateAdded || currentDate
            })
        } else {
            onAdd({
                id: nanoid(),
                title,
                genre,
                status,
                link,
                imageLink,
                dateAdded: currentDate
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

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="mb-4 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div
                className="px-3 sm:px-4 py-3 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                onClick={!isEditing ? toggleExpand : undefined}
            >
                <h2 className="text-base sm:text-lg font-bold flex items-center">
                    {isEditing ? 'Edit Series' : 'Add New Series'}
                    {!isEditing && (
                        <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {isExpanded ? '(click to collapse)' : '(click to expand)'}
                        </span>
                    )}
                </h2>
                {!isEditing && (
                    <button
                        type="button"
                        className="text-lg sm:text-xl font-bold transition-transform duration-200 ease-in-out"
                        style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(90deg)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}
                    >
                        {isExpanded ? '−' : '+'}
                    </button>
                )}
            </div>

            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isExpanded ? '800px' : '0',
                    opacity: isExpanded ? 1 : 0
                }}
            >
                <form onSubmit={handleSubmit} className="px-3 sm:px-4 pb-4">
                    <div className="grid gap-x-2 sm:gap-x-3 gap-y-2">
                        <div className="grid grid-cols-12 gap-2 sm:gap-3">
                            <div className="col-span-12 sm:col-span-5">
                                <label className="text-xs font-medium">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text" placeholder="Title"
                                    value={title} onChange={(e) => { setTitle(e.target.value); validateField('title', e.target.value) }}
                                    className={`border rounded px-2 py-1 w-full bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white text-sm ${errors.title ? '!border-red-500' : 'border-zinc-300'}`}
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div className="col-span-7 sm:col-span-4">
                                <label className="text-xs font-medium">Genre</label>
                                <input
                                    type="text" placeholder="Genre"
                                    value={genre} onChange={(e) => { setGenre(e.target.value); validateField('genre', e.target.value) }}
                                    className={`border rounded px-2 py-1 w-full bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white text-sm ${errors.genre ? '!border-red-500' : 'border-zinc-300'}`}
                                />
                                {errors.genre && <p className="text-xs text-red-500">{errors.genre}</p>}
                            </div>

                            <div className="col-span-5 sm:col-span-3">
                                <label className="text-xs font-medium">Status</label>
                                <select
                                    value={status} onChange={e => setStatus(e.target.value)}
                                    className="border rounded px-2 py-1 w-full bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white text-sm"
                                >
                                    <option>Watching</option>
                                    <option>Watched</option>
                                    <option>Plan to Watch</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-start">
                            <div className="w-full">
                                <label className="text-xs font-medium">Image Link</label>
                                <input
                                    type="text" placeholder="Image URL"
                                    value={imageLink} onChange={(e) => { setImageLink(e.target.value); validateField('imageLink', e.target.value) }}
                                    className={`border rounded px-2 py-1 w-full bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white text-sm ${errors.imageLink ? '!border-red-500' : 'border-zinc-300'}`}
                                />
                                {errors.imageLink && <p className="text-xs text-red-500">{errors.imageLink}</p>}
                            </div>
                            <div className="w-full">
                                <label className="text-xs font-medium">Link</label>
                                <input
                                    type="text" placeholder="Website URL"
                                    value={link} onChange={(e) => { setLink(e.target.value); validateField('link', e.target.value) }}
                                    className={`border rounded px-2 py-1 w-full bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white text-sm ${errors.link ? '!border-red-500' : 'border-zinc-300'}`}
                                />
                                {errors.link && <p className="text-xs text-red-500">{errors.link}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium transition"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-3 py-1 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-600 text-sm font-medium transition"
                        >
                            {isEditing ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}