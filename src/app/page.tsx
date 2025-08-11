import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Properties from './components/Properties'
import Features from './components/Features'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      
      <main>
        <article>
          <Hero />
          <About />
          <Services />
          <Properties />
          <Features />
        </article>
      </main>

      <Contact />
      <Footer />
    </>
  )
}
