function RaQrBox({ size = "size-52" }: { size?: string }) {
  return (
    <div className={`${size} border border-gray-300 rounded-2xl bg-white p-3`}>
      <svg viewBox="0 0 29 29" className="size-full">
        <rect width="29" height="29" fill="white" />
        <path fill="black" d="M1 1h9v9H1zm2 2v5h5V3zm1 1h3v3H4zm16-3h9v9h-9zm2 2v5h5V3zm1 1h3v3h-3zM1 19h9v9H1zm2 2v5h5v-5zm1 1h3v3H4zm12-3h2v2h-2zm4 0h2v2h-2zm4 0h3v2h-3zm-8 4h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm2 4h3v3h-3zm-6 0h2v3h-2zm-4 0h2v2h-2zm-4-4h2v6h-2zm8-8h2v2h-2zm4 0h3v3h-3zm-12 4h2v2h-2zm8 0h2v2h-2z" />
      </svg>
    </div>
  )
}

export default RaQrBox
