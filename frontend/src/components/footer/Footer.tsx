import { Link } from "react-router-dom"
import RaContainer from "../container/RaContainer"
import RaContainerPadding from "../container/RaContainerPadding"

function Footer() {
  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="py-16 text-muted flex justify-between">
          <div>
            &copy;
            2026 Rent Anything Platform
          </div>
          <div className="flex gap-6">
            <Link to={""}>Contact</Link>
            <Link to={""}>Terms</Link>
            <Link to={""}>Privacy</Link>
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Footer