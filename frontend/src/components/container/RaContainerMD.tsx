import type { IContainerProp } from "./RaContainer";

const RaContainerLG = ({ children }: IContainerProp) => {
  return <div className="w-full max-w-3xl mx-auto">{children}</div>
}

export default RaContainerLG;