import { QRCodeSVG } from "qrcode.react"

function RaQrBox({
  value = "RAP",
  size = "size-52",
}: {
  value?: string
  size?: string
}) {
  return (
    <div className={`${size} border border-gray-300 rounded-2xl bg-white p-3 flex items-center justify-center`}>
      {value ? (
        <QRCodeSVG value={value} className="size-full" />
      ) : (
        <div className="text-sm text-muted text-center px-4">QR unavailable</div>
      )}
    </div>
  )
}

export default RaQrBox
