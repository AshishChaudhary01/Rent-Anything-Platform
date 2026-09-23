import { useMe } from "../../hooks/queries/useAccount"

function AuthSession() {
  useMe()
  return null
}

export default AuthSession
