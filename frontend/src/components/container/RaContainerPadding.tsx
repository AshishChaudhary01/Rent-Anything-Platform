import type { IContainerProp } from "./RaContainer";

const RaContainerPadding = ({ children }: IContainerProp) => {
  return <div className="px-6 md:px-7 lg:px-8 xxl:px-0">{children}</div>
}

export default RaContainerPadding;