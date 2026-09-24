import { Toaster } from "sonner"

function RaToaster() {
  return (
    <Toaster
      position="top-right"
      offset="4.75rem"
      visibleToasts={3}
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast: "font-sans !z-[200]",
        },
      }}
      style={{ zIndex: 200 }}
    />
  )
}

export default RaToaster
