import defaultImage from '../assets/default-series-image.jpg';

export default function TVSeriesList({ series, onRate, onRemove }) {
    const watchedSeries = series.filter(s => s.status === 'Watched');
    const otherSeries = series.filter(s => s.status !== 'Watched');

    const SeriesCard = ({ series: s, onRemove }) => (
        <div key={s.id} className="p-4 border rounded shadow dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{s.title}</h2>
                {s.status === 'Watched' && (
                    <span className="bg-fuchsia-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ✅ Watched
                    </span>
                )}
                {s.status === 'Watching' && (
                    <span className="bg-fuchsia-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                        📺 Watching
                    </span>
                )}
                {s.status === 'Plan to Watch' && (
                    <span className="bg-fuchsia-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⌛ Plan to watch
                    </span>
                )}
            </div>
            <div className="mt-2 w-full h-[300px] overflow-hidden rounded">
                <img
                    src={s.imageLink || defaultImage}
                    alt={`${s.title} image`}
                    className="w-full h-full object-cover"
                />
            </div>
            <p>🎭 {s.genre}</p>
            {s.link && <p>🔗 <a className="text-fuchsia-700" href={s.link}>{s.link}</a></p>}
            {s.status === 'Watched' && (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-white">Rate:</label>
                    <select
                        value={s.rating || ''}
                        onChange={(e) => onRate(s.id, e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    >
                        <option value="">Select rating</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1} ⭐</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="flex gap-2 mt-2">
                <button onClick={() => onRemove(s.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded transition">Remove</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {watchedSeries.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-3 border-b pb-2 dark:border-zinc-700">
                        Watched Series
                    </h2>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        {watchedSeries.map(s => (
                            <SeriesCard key={s.id} series={s} onRemove={onRemove} />
                        ))}
                    </div>
                </div>
            )}

            {otherSeries.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-3 border-b pb-2 dark:border-zinc-700">
                        Currently Watching & Plan to Watch
                    </h2>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        {otherSeries.map(s => (
                            <SeriesCard key={s.id} series={s} onRemove={onRemove} />
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