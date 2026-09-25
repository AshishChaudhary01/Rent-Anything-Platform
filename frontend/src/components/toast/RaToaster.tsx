import { Toaster } from "sonner"

function RaToaster() {
  return (
    <Toaster
      position="top-right"
      offset="4.75rem"
      visibleToasts={3}
      duration={3500}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "font-sans !z-[200]",
        },
      }}
      style={{ zIndex: 200 }}
    />
  )
}

export default RaToaster
