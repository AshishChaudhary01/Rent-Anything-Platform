import type { IContainerProp } from "./RaContainer";

const RaContainerXS = ({ children }: IContainerProp) => {
  return <div className="w-full min-w-80 max-w-100 mx-auto">{children}</div>
}

export default RaContainerXS;