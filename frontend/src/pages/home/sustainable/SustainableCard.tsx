import SustainableBanner from "./SustainableBanner";
import SustainableContent from "./SustainableContent";

function SustainableCard() {
  return (
    <div className="bg-surface rounded-4xl grid gap-8 py-8 lg:py-16 grid-cols-1 lg:grid-cols-2 lg:gap-16">
      <SustainableContent />
      <SustainableBanner />
    </div>
  )
}

export default SustainableCard