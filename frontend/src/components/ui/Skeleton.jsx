export function PostSkeleton() {
  return (
    <div className="card mb-4 overflow-hidden">
      <div className="p-4 flex items-center gap-3"><div className="skeleton w-11 h-11 rounded-full" /><div className="flex-1"><div className="skeleton h-3 w-28 mb-2 rounded" /><div className="skeleton h-2 w-20 rounded" /></div></div>
      <div className="skeleton w-full aspect-square" />
      <div className="p-4"><div className="skeleton h-3 w-20 mb-3 rounded" /><div className="skeleton h-3 w-full mb-2 rounded" /><div className="skeleton h-3 w-3/4 rounded" /></div>
    </div>
  );
}
export function ProfileSkeleton() {
  return (
    <div className="p-6">
      <div className="flex items-start gap-8 mb-6"><div className="skeleton w-24 h-24 rounded-full" /><div className="flex-1"><div className="skeleton h-4 w-32 mb-3 rounded" /><div className="flex gap-6 mb-3"><div className="skeleton h-8 w-16 rounded" /><div className="skeleton h-8 w-16 rounded" /><div className="skeleton h-8 w-16 rounded" /></div><div className="skeleton h-3 w-48 rounded" /></div></div>
      <div className="grid grid-cols-3 gap-0.5">{[...Array(9)].map((_, i) => <div key={i} className="skeleton aspect-square" />)}</div>
    </div>
  );
}
export function StorySkeleton() {
  return <div className="flex gap-4 px-4 py-2">{[...Array(6)].map((_, i) => <div key={i} className="flex flex-col items-center gap-1"><div className="skeleton w-16 h-16 rounded-full" /><div className="skeleton h-2 w-12 rounded" /></div>)}</div>;
}
export function NotifSkeleton() {
  return <div className="flex items-center gap-3 px-4 py-3">{[...Array(5)].map((_, i) => <div key={i} className="w-full flex items-center gap-3"><div className="skeleton w-11 h-11 rounded-full" /><div className="flex-1"><div className="skeleton h-3 w-full mb-2 rounded" /><div className="skeleton h-2 w-24 rounded" /></div></div>)}</div>;
}
