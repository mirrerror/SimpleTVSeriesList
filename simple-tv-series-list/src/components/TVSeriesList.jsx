import React, { useState } from 'react';
import defaultImage from '../assets/default-series-image.jpg';

export default function TVSeriesList({ series, onRate, onRemove, onEdit, isMobile, pagination, onPaginationChange }) {
    const handleSortDirectionChange = (e) => {
        onPaginationChange({
            ...pagination,
            sortDirection: e.target.value,
            page: 0
        });
    };

    const handleSortByChange = (e) => {
        onPaginationChange({
            ...pagination,
            sortBy: e.target.value,
            page: 0
        });
    };

    const handleStatusFilterChange = (e) => {
        onPaginationChange({
            ...pagination,
            status: e.target.value,
            page: 0
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && (!pagination.totalPages || newPage < pagination.totalPages)) {
            onPaginationChange({
                ...pagination,
                page: newPage
            });
        }
    };

    const handleSizeChange = (e) => {
        onPaginationChange({
            ...pagination,
            size: parseInt(e.target.value),
            page: 0
        });
    };

    const SeriesCard = ({ series: s, onRemove, onEdit }) => {
        const handleImageError = (e) => {
            e.target.src = defaultImage;
        };

        const isNew = new Date() - new Date(s.dateAdded) < 7 * 24 * 60 * 60 * 1000;

        return (
            <div className="p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 dark:border-zinc-700 dark:bg-zinc-800 flex flex-col h-full"
                 style={{ position: 'static' }}>
                <div className="flex justify-between items-center mb-3"
                     style={{ position: 'relative' }}>
                    <h2 className="text-lg sm:text-xl font-semibold truncate pr-2 flex items-center gap-2">
                        {s.title}
                    </h2>
                </div>
                <div className="mt-1 w-full h-40 sm:h-48 md:h-56 overflow-hidden rounded-md relative">
                    <img
                        src={s.imageLink || defaultImage}
                        alt={`${s.title} image`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    {isNew && (
                        <span
                            className="absolute top-2 left-2 bg-fuchsia-700 text-white text-xs px-2 py-0.5 rounded-full font-bold"
                        >
                            NEW
                        </span>
                    )}
                    <div className="absolute bottom-2 left-2">
                        {s.status === 'Watched' && (
                            <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                ✅ Watched
                            </span>
                        )}
                        {s.status === 'Watching' && (
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                📺 Watching
                            </span>
                        )}
                        {s.status === 'Plan to Watch' && (
                            <span className="bg-yellow-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                ⌛ Plan to watch
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-full">
                            🎭 {s.genre || 'No genre'}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-full">
                            📅 {new Date(s.dateAdded).toLocaleDateString()}
                        </span>
                        {s.rating && s.status !== 'Watched' && (
                            <span className="text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-full">
                                ⭐ {s.rating}/10
                            </span>
                        )}
                    </div>
                    {s.link && (
                        <p className="text-sm mt-2 overflow-hidden text-ellipsis">
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
                        <select
                            value={s.rating || ''}
                            onChange={(e) => onRate(s.id, e.target.value)}
                            className="block w-full border rounded px-3 py-1.5 text-sm bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        >
                            <option value="">Rate this series</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1} ⭐</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => onEdit(s)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 px-2 sm:px-3 py-1.5 text-white rounded transition text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onRemove(s.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 px-2 sm:px-3 py-1.5 text-white rounded transition text-sm font-medium"
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    };

    const noSeriesFound = series.length === 0;
    const hasItems = pagination.totalElements > 0;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 md:col-span-4">
                        <div className="inline-flex items-center rounded-md shadow-sm relative">
                            <div className="absolute left-3 text-gray-400 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                            <select
                                value={pagination.status || 'all'}
                                onChange={handleStatusFilterChange}
                                className="pl-9 pr-3 py-1.5 rounded-l-md border-r-0 border focus:ring-0 focus:border-fuchsia-500 text-sm bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                aria-label="Filter by status"
                            >
                                <option value="all">All Statuses</option>
                                <option value="WATCHED">Watched</option>
                                <option value="WATCHING">Watching</option>
                                <option value="PLAN_TO_WATCH">Plan to Watch</option>
                            </select>

                            <div className="absolute left-[10.5rem] text-gray-400 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </div>
                            <select
                                value={pagination.sortBy}
                                onChange={handleSortByChange}
                                className="pl-9 pr-3 py-1.5 border-r-0 border-l-0 border focus:ring-0 focus:border-fuchsia-500 text-sm bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                aria-label="Sort by"
                            >
                                <option value="status">Status</option>
                                <option value="title">Title</option>
                                <option value="createdAt">Date Added</option>
                                <option value="genre">Genre</option>
                                <option value="rating">Rating</option>
                            </select>

                            <select
                                value={pagination.sortDirection}
                                onChange={handleSortDirectionChange}
                                className="pr-3 py-1.5 rounded-r-md border-l-0 border focus:ring-0 focus:border-fuchsia-500 text-sm bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                aria-label="Sort direction"
                            >
                                <option value="desc">↓ Desc</option>
                                <option value="asc">↑ Asc</option>
                            </select>
                        </div>

                        <div className="flex-grow"></div>

                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Show:</span>
                            <select
                                value={pagination.size}
                                onChange={handleSizeChange}
                                className="rounded-md border text-sm py-1 px-2 bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white focus:border-fuchsia-500 focus:ring-0"
                                aria-label="Items per page"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>

                    {hasItems && (
                        <div className="flex items-center justify-center md:col-span-4 mt-2">
                            <div className="inline-flex items-center rounded-md shadow-sm">
                                <button
                                    onClick={() => handlePageChange(0)}
                                    disabled={pagination.page === 0}
                                    className="px-2 py-1 rounded-l-md border border-r-0 bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-600"
                                    aria-label="First page"
                                >
                                    &laquo;
                                </button>
                                <button
                                    onClick={() => handlePageChange(Math.max(0, pagination.page - 1))}
                                    disabled={pagination.page === 0}
                                    className="px-2 py-1 border border-r-0 bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-600"
                                    aria-label="Previous page"
                                >
                                    &lsaquo;
                                </button>
                                <div className="px-4 py-1 border border-r-0 border-l-0 bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white flex items-center justify-center min-w-[80px]">
                                    <span className="text-sm font-medium">Page {pagination.page + 1}</span>
                                    {pagination.totalPages > 0 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                            of {pagination.totalPages}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.totalPages && pagination.page >= pagination.totalPages - 1}
                                    className="px-2 py-1 border border-r-0 bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-600"
                                    aria-label="Next page"
                                >
                                    &rsaquo;
                                </button>
                                {pagination.totalPages > 0 && (
                                    <button
                                        onClick={() => handlePageChange(pagination.totalPages - 1)}
                                        disabled={pagination.page >= pagination.totalPages - 1}
                                        className="px-2 py-1 rounded-r-md border bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-600"
                                        aria-label="Last page"
                                    >
                                        &raquo;
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {noSeriesFound ? (
                <div className="text-center p-6 border rounded dark:border-zinc-700">
                    <p className="text-gray-500 dark:text-gray-400">No TV series found for the selected filters</p>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h2 className="text-xl sm:text-2xl font-bold">All TV Series</h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {pagination.totalElements !== undefined ? (
                                <span>
                                    Showing {Math.min(pagination.size, series.length)} of {pagination.totalElements} {pagination.totalElements === 1 ? 'series' : 'series'}
                                </span>
                            ) : (
                                <span>
                                    {series.length} {series.length === 1 ? 'series' : 'series'} found
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {series.map(s => (
                            <SeriesCard key={s.id} series={s} onRemove={onRemove} onEdit={onEdit} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}