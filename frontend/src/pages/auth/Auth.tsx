import AuthLayout from "../../layouts/AuthLayout"
import Login from "./login/Login"
import Register from "./register/Register"

function Auth() {
  return (
    <AuthLayout>
      <Login />
      <Register />
    </AuthLayout>
  )
}

export default Auth