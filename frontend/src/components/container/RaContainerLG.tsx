import type { IContainerProp } from "./RaContainer";

const RaContainerLG = ({ children }: IContainerProp) => {
  return <div className="w-full max-w-300 mx-auto">{children}</div>
}

export default RaContainerLG;