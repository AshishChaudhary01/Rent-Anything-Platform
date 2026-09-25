import RaSpinner from "./RaSpinner"

function RaPageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-6" role="status" aria-live="polite">
      <RaSpinner />
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}

export default RaPageLoader
