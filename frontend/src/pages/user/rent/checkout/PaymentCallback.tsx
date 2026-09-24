import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { raToast } from "../../../../lib/raToast"
import { verifyEsewaPayment, verifyKhaltiPayment } from "../../../../services/rental.service"

function readCallbackData(search: URLSearchParams) {
  const direct = search.get("data")
  if (direct) return direct
  const href = window.location.href
  const match = href.match(/[?&]data=([^&]+)/)
  if (match?.[1]) return decodeURIComponent(match[1])
  const gateway = search.get("gateway") || ""
  const embedded = gateway.match(/data=([^&]+)/)
  return embedded?.[1] ? decodeURIComponent(embedded[1]) : ""
}

function callbackKey(rentalId: string) {
  return `pay-verify-${rentalId}`
}

function PaymentCallback() {
  const navigate = useNavigate()
  const route = useParams()
  const [params] = useSearchParams()
  const rentalId = route.rentalId || params.get("rentalId") || ""
  const gateway = (route.gateway || params.get("gateway") || "").split("?")[0].toUpperCase()
  const data = readCallbackData(params)
  const pidx = params.get("pidx") || ""
  const status = params.get("status") || ""

  useEffect(() => {
    const run = async () => {
      if (!rentalId) {
        raToast.error("Missing rental after payment")
        navigate("/user", { replace: true })
        return
      }
      const key = callbackKey(rentalId)
      const existing = sessionStorage.getItem(key)
      if (existing === "ok") {
        navigate(`/user/rent/confirmation?rentalId=${rentalId}`, { replace: true })
        return
      }
      if (existing === "pending") return

      if (status.toLowerCase().includes("cancel") || status === "User canceled") {
        raToast.error("Payment cancelled")
        navigate(`/user/rent/checkout?rentalId=${rentalId}&failed=1`, { replace: true })
        return
      }

      sessionStorage.setItem(key, "pending")
      try {
        if (gateway === "KHALTI") {
          await verifyKhaltiPayment(rentalId, pidx)
        } else {
          await verifyEsewaPayment(rentalId, data)
        }
        sessionStorage.setItem(key, "ok")
        navigate(`/user/rent/confirmation?rentalId=${rentalId}`, { replace: true })
      } catch (error) {
        sessionStorage.removeItem(key)
        raToast.fromError(error, "Could not confirm payment")
        navigate(`/user/rent/checkout?rentalId=${rentalId}&failed=1`, { replace: true })
      }
    }
    void run()
  }, [data, gateway, navigate, pidx, rentalId, status])

  return <p className="px-6 py-16 text-center text-muted">Confirming payment…</p>
}

export default PaymentCallback
