export default function TVSeriesList({ series, onLike, onRemove }) {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {series.map(s => (
                <div key={s.id} className="p-4 border rounded shadow dark:border-zinc-700">
                    <h2 className="text-xl font-semibold">{s.title}</h2>
                    <p>🎭 {s.genre}</p>
                    <p>📺 {s.status}</p>
                    <p>❤️ {s.likes} likes</p>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => onLike(s.id)} className="bg-pink-500 px-3 py-1 text-white rounded">Like</button>
                        <button onClick={() => onRemove(s.id)} className="bg-red-500 px-3 py-1 text-white rounded">Remove</button>
                    </div>
                </div>
            ))}
        </div>
    )
}
