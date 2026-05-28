export type IContainerProp = {
  children: React.ReactNode;
};

const RaContainer = ({ children }: IContainerProp) => {
  return <div className="w-full max-w-360 mx-auto">{children}</div>
}

export default RaContainer;