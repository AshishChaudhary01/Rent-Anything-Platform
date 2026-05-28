export type IItemPreviewContainerProps = {
  children: React.ReactNode;
}

const RaItemPreviewContainer = ({ children }: IItemPreviewContainerProps) => {
  return (
    <div
      className="flex gap-6 py-8
      overflow-x-auto
      scrollbar-thin
      scrollbar-thumb-gray-300
      scrollbar-track-transparent
    ">
      {children}
    </div>
  )
}

export default RaItemPreviewContainer