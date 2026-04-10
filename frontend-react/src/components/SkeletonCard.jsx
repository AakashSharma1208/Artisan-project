import React from 'react';

const SkeletonCard = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="h-56 bg-slate-200 dark:bg-slate-700" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20" />
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-16" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
