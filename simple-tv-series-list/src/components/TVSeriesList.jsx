import defaultImage from '../assets/default-series-image.jpg';

export default function TVSeriesList({ series, onRate, onRemove, onEdit, isMobile }) {
    const watchedSeries = series.filter(s => s.status === 'Watched');
    const otherSeries = series.filter(s => s.status !== 'Watched');

    const SeriesCard = ({ series: s, onRemove, onEdit }) => {
        const handleImageError = (e) => {
            e.target.src = defaultImage;
        };

        return (
            <div className="p-3 sm:p-4 border rounded shadow dark:border-zinc-700 dark:bg-zinc-800 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg sm:text-xl font-semibold truncate pr-2">{s.title}</h2>
                    <div className="flex-shrink-0">
                        {s.status === 'Watched' && (
                            <span className="bg-fuchsia-700 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                ✅ Watched
                            </span>
                        )}
                        {s.status === 'Watching' && (
                            <span className="bg-fuchsia-700 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                📺 Watching
                            </span>
                        )}
                        {s.status === 'Plan to Watch' && (
                            <span className="bg-fuchsia-700 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                ⌛ Plan to watch
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-1 w-full h-40 sm:h-48 md:h-56 overflow-hidden rounded">
                    <img
                        src={s.imageLink || defaultImage}
                        alt={`${s.title} image`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={handleImageError}
                    />
                </div>
                <div className="flex-grow">
                    <p className="text-sm sm:text-base mt-2">🎭 {s.genre || 'No genre specified'}</p>
                    {s.link && (
                        <p className="text-sm mt-1 overflow-hidden text-ellipsis">
                            🔗 <a
                            className="text-fuchsia-700 hover:underline"
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {s.link.length > 30 ? s.link.substring(0, 30) + '...' : s.link}
                        </a>
                        </p>
                    )}
                </div>
                {s.status === 'Watched' && (
                    <div className="mt-2">
                        <label className="block text-sm font-medium">Rate:</label>
                        <select
                            value={s.rating || ''}
                            onChange={(e) => onRate(s.id, e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-1.5 text-sm bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        >
                            <option value="">Select rating</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1} ⭐</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => onEdit(s)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 px-2 sm:px-3 py-1 text-white rounded transition text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onRemove(s.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 px-2 sm:px-3 py-1 text-white rounded transition text-sm font-medium"
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {watchedSeries.length > 0 && (
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 border-b pb-2 dark:border-zinc-700">
                        Watched Series
                    </h2>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {watchedSeries.map(s => (
                            <SeriesCard key={s.id} series={s} onRemove={onRemove} onEdit={onEdit} />
                        ))}
                    </div>
                </div>
            )}

            {otherSeries.length > 0 && (
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 border-b pb-2 dark:border-zinc-700">
                        Currently Watching & Plan to Watch
                    </h2>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {otherSeries.map(s => (
                            <SeriesCard key={s.id} series={s} onRemove={onRemove} onEdit={onEdit} />
                        ))}
                    </div>
                </div>
            )}

            {series.length === 0 && (
                <div className="text-center p-6 border rounded dark:border-zinc-700">
                    <p className="text-gray-500 dark:text-gray-400">No TV series added yet</p>
                </div>
            )}
        </div>
    );
}