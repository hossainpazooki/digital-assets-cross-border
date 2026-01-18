export function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-800/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
              <span className="text-xl font-bold text-white">CN</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Compliance Navigator
              </h1>
              <p className="text-sm text-slate-400">
                Cross-Border DeFi Regulatory Compliance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
              Connected to Backend
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
