type OtpRecord = {
  code: string
  expiresAt: number
}

const TTL_MS = 5 * 60 * 1000
const store = new Map<string, OtpRecord>()

function keyFor(email: string) {
  return email.trim().toLowerCase()
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function sendOtp(email: string) {
  const code = generateOtp()
  store.set(keyFor(email), {
    code,
    expiresAt: Date.now() + TTL_MS,
  })
  return code
}

export function verifyOtp(email: string, code: string) {
  const record = store.get(keyFor(email))
  if (!record) return { ok: false, message: "Request a new code first" }
  if (Date.now() > record.expiresAt) {
    store.delete(keyFor(email))
    return { ok: false, message: "Code expired. Request a new one" }
  }
  if (record.code !== code.trim()) return { ok: false, message: "Incorrect code" }
  store.delete(keyFor(email))
  return { ok: true, message: "Verified" }
}
