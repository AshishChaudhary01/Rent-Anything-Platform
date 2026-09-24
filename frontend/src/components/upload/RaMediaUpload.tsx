import { useEffect, useRef, useState } from "react"
import { IoAdd, IoClose, IoVideocamOutline } from "react-icons/io5"

export type MediaFile = {
  id: string
  file: File
  url: string
}

interface RaMediaUploadProps {
  accept?: string
  onChange?: (items: MediaFile[]) => void
  onAdd?: (items: MediaFile[]) => void
  heading?: string
}

function RaMediaUpload({
  accept = "image/*,video/*",
  onChange,
  onAdd,
  heading = "Upload Proof",
}: RaMediaUploadProps) {
  const [items, setItems] = useState<MediaFile[]>([])
  const itemsRef = useRef<MediaFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  itemsRef.current = items

  const update = (next: MediaFile[]) => {
    setItems(next)
    onChange?.(next)
  }

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const added = Array.from(list).map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }))
    update([...items, ...added])
    onAdd?.(added)
  }

  const remove = (id: string) => {
    const target = items.find((item) => item.id === id)
    if (target) URL.revokeObjectURL(target.url)
    update(items.filter((item) => item.id !== id))
  }

  useEffect(() => {
    return () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url))
  }, [])

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ""
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-muted/30 rounded-2xl p-8 bg-surface hover:border-primary cursor-pointer"
      >
        <IoAdd className="size-8 mx-auto text-primary" />
        <div className="font-semibold mt-2">{heading}</div>
        <div className="text-sm text-muted">Supports photos and videos up to 100 MB each</div>
      </button>

      {items.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-black">
              {item.file.type.startsWith("video/") ? (
                <video src={item.url} className="size-full object-cover" />
              ) : (
                <img src={item.url} alt={item.file.name} className="size-full object-cover" />
              )}
              {item.file.type.startsWith("video/") && (
                <IoVideocamOutline className="absolute bottom-2 left-2 size-5 text-white" />
              )}
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              >
                <IoClose className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RaMediaUpload
