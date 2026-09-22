import { Toaster } from "sonner"

function RaToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  )
}

export default RaToaster
