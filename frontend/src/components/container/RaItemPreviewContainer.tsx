export type IItemPreviewContainerProps = {
  children: React.ReactNode;
}

const RaItemPreviewContainer = ({ children }: IItemPreviewContainerProps) => {
  return (
    <div
      className="flex gap-6 py-4
      overflow-x-auto
      scrollbar-none
    ">
      {children}
    </div>
  )
}

export default RaItemPreviewContainer