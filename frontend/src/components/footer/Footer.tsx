import { Link } from "react-router-dom"
import RaContainer from "../container/RaContainer"

function Footer() {
  return (
    <RaContainer>
      <div className="pt-4 pb-2 md:pt-8 md:pb-4 text-muted flex gap-6 justify-between text-sm lg:text-base">
        <div>
          &copy;
          2026 Rent Anything Platform
        </div>
        <div className="flex flex-wrap gap-x-6">
          <Link to={""}>Contact</Link>
          <Link to={""}>Terms</Link>
          <Link to={""}>Privacy</Link>
        </div>
      </div>
    </RaContainer>
  )
}

export default Footer