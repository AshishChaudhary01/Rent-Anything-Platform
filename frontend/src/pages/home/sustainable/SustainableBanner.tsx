import { IoPeopleOutline } from "react-icons/io5"
import { backpack01, tools01 } from "../../../utils/images"

function SustainableBanner() {
  return (
    <div className="flex flex-col items-center self-center">
      <div className="flex flex-col sm:flex-row gap-6 items-end">
        <div
          style={{
            backgroundImage: `url(${tools01})`
          }}
          className="bg-cover bg-center bg-no-repeat size-50 max-w-full rounded-4xl"></div>
        <div className="flex flex-col justify-start p-8 bg-accent-secondary size-50 max-w-full sm:mb-6 rounded-4xl">
          <div><IoPeopleOutline className="stroke-muted-secondary size-10" /></div>
          <div className="font-bold text-xl text-muted-secondary">Smart Sharing</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex flex-col justify-end p-8 bg-accent size-50 max-w-full mt-6 rounded-4xl">
          <div className="font-bold text-4xl text-muted">12k+</div>
          <div>Successful rents</div></div>
        <div
          style={{
            backgroundImage: `url(${backpack01})`
          }}
          className="bg-cover bg-center bg-no-repeat size-50 max-w-full rounded-4xl"></div>
      </div>
    </div>
  )
}

export default SustainableBanner