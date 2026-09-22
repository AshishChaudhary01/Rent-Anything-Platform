import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react"
import type { IOTPInput } from "../../types/input.types"

function RaOtpInput({
  length = 6,
  onComplete,
  isError,
  isLoading,
  email,
  onResend,
}: IOTPInput) {
  const [values, setValues] = useState<string[]>(() => Array.from({ length }, () => ""))
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const emit = (next: string[]) => {
    setValues(next)
    const joined = next.join("")
    if (joined.length === length && next.every(Boolean)) onComplete(joined)
  }

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1)
    const next = [...values]
    next[index] = digit
    emit(next)
    if (digit && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    const next = Array.from({ length }, (_, i) => pasted[i] ?? "")
    emit(next)
    refs.current[Math.min(pasted.length, length) - 1]?.focus()
  }

  return (
    <div className="flex flex-col gap-3">
      {email && (
        <div className="text-sm text-muted">
          Enter the 6-digit code sent to {email}
        </div>
      )}
      <div className="flex justify-between gap-2">
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={value}
            disabled={isLoading}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`size-11 md:size-12 text-center text-lg font-semibold rounded-xl border outline-none bg-surface ${
              isError ? "border-danger" : "border-muted/20 focus:border-primary"
            }`}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
      {onResend && (
        <button type="button" onClick={onResend} className="text-sm text-primary text-left cursor-pointer">
          Resend code
        </button>
      )}
    </div>
  )
}

export default RaOtpInput
