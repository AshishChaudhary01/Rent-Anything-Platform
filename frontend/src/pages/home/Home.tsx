import RaAppLayout from '../../layouts/RaAppLayout'
import CTA from './CTA/CTA'
import FeaturedItems from './featuredItems/FeaturedItems'
import Foundation from './foundation/Foundation'
import Sustainable from './sustainable/Sustainable'

const Home = () => {
  return (
    <RaAppLayout>
      <Sustainable />
      <FeaturedItems />
      <Foundation />
      <CTA />
    </RaAppLayout>
  )
}

export default Home