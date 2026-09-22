export type OtpChannel = "email" | "phone"

type OtpRecord = {
  code: string
  expiresAt: number
}

const TTL_MS = 5 * 60 * 1000
const store = new Map<string, OtpRecord>()

function keyFor(channel: OtpChannel, destination: string) {
  return `${channel}:${destination.trim().toLowerCase()}`
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function sendOtp(channel: OtpChannel, destination: string) {
  const code = generateOtp()
  store.set(keyFor(channel, destination), {
    code,
    expiresAt: Date.now() + TTL_MS,
  })
  return code
}

export function verifyOtp(channel: OtpChannel, destination: string, code: string) {
  const record = store.get(keyFor(channel, destination))
  if (!record) return { ok: false, message: "Request a new code first" }
  if (Date.now() > record.expiresAt) {
    store.delete(keyFor(channel, destination))
    return { ok: false, message: "Code expired. Request a new one" }
  }
  if (record.code !== code.trim()) return { ok: false, message: "Incorrect code" }
  store.delete(keyFor(channel, destination))
  return { ok: true, message: "Verified" }
}
