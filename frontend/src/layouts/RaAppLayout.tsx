import type { IContainerProp } from '../components/container/RaContainer'
import Footer from '../components/footer/Footer'
import RaAppNavbar from '../components/nav/RaAppNavbar'
import Hero from '../pages/home/hero/Hero'

const RaAppLayout = ({ children }: IContainerProp) => {
  return (
    <div className='overflow-hidden bg-bg min-h-dvh'>
      <header className="min-h-80 md:min-h-screen">
        <RaAppNavbar />
        <Hero />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default RaAppLayout