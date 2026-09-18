interface RaStepperProps {
  steps: string[]
  current: number
}

function RaStepper({ steps, current }: RaStepperProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => (
        <div key={step} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
          <div className="flex flex-col items-center gap-1 min-w-16">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= current ? "bg-primary text-white" : "bg-surface text-muted"
              }`}
            >
              {i + 1}
            </div>
            <div className={`text-xs text-center ${i <= current ? "text-primary font-semibold" : "text-muted"}`}>
              {step}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-1 mx-2 mb-5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: i < current ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default RaStepper
