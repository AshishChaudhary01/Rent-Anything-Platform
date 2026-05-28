import { IoCashOutline, IoLeafOutline } from "react-icons/io5"

function SustainableContent() {
  return (
    <div className="flex flex-col gap-y-8 justify-center px-8">
      <div className="text-2xl md:text-3xl lg:text-5xl font-extrabold">Sustainable & Trusted</div>
      <div className="flex gap-6">
        <div className="bg-white flex-none rounded-xl size-14 grid place-content-center">
          <IoLeafOutline className="size-8 stroke-primary" />
        </div>
        <div className="flex-auto grid gap-2">
          <div className="text-base md:text-lg lg:text-2xl font-bold">Eco-friendly Living</div>
          <div className="text:xs md:text-sm lg:text-lg font-light text-muted">
            Reduce carbon footprint by sharing resources instead of
            buying new. Every rental contributes to a circular economy in
            our beautiful hills and valleys.
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="bg-white flex-none rounded-xl size-14 grid place-content-center">
          <IoCashOutline className="size-8 stroke-primary" />
        </div>
        <div className="flex-auto grid gap-2">
          <div className="text-base md:text-lg lg:text-2xl font-bold">Passive Income</div>
          <div className="text:xs md:text-sm lg:text-lg font-light text-muted">
            Your idle tools, gear, and appliances could be paying your
            bills. Lend safely to verified neighbors and watch your
            community grow stronger.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SustainableContent