function RaSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box = size === "sm" ? "size-5 border-2" : size === "lg" ? "size-10 border-4" : "size-8 border-[3px]"
  return <span className={`rap-spinner ${box}`} role="presentation" />
}

export default RaSpinner
