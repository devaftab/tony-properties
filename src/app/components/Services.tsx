import Image from 'next/image'
import Link from 'next/link'
import { IoArrowForwardOutline } from 'react-icons/io5'

export default function Services() {
  return (
    <section className="service" id="service">
      <div className="container">
        <p className="section-subtitle">Our Services</p>
        <h2 className="h2 section-title">Our Main Focus</h2>

        <ul className="service-list">
          <li>
            <div className="service-card">
              <div className="card-icon">
                <Image 
                  src="/images/service-1.png" 
                  alt="Service icon"
                  width={120}
                  height={120}
                />
              </div>

              <h3 className="h3 card-title">
                Buy & Sell Property
              </h3>

              <p className="card-text">
                Whether you're looking to purchase your dream home or sell your current property for the best price, Tony Properties is here to guide you. From market analysis to final paperwork, we make every transaction smooth and profitable.
              </p>

              <Link href="#contact" className="card-link">
                <span>Find your need</span>
                <IoArrowForwardOutline />
              </Link>
            </div>
          </li>

          <li>
            <div className="service-card">
              <div className="card-icon">
                <Image 
                  src="/images/service-3.png" 
                  alt="Service icon"
                  width={120}
                  height={120}
                />
              </div>

              <h3 className="h3 card-title">
                Rent & Lease Property
              </h3>

              <p className="card-text">
                From residential flats to commercial spaces, we connect you with the right tenants or landlords for both short-term rentals and long-term leases. Our process is transparent, quick, and stress-free.
              </p>

              <Link href="#contact" className="card-link">
                <span>Find your need</span>
                <IoArrowForwardOutline />
              </Link>
            </div>
          </li>
          
          <li>
            <div className="service-card">
              <div className="card-icon">
                <Image 
                  src="/images/service-3.png" 
                  alt="Service icon"
                  width={120}
                  height={120}
                />
              </div>

              <h3 className="h3 card-title">
                Property Finance & Legal Help
              </h3>

              <p className="card-text">
                We assist with home loans, property funding, and legal documentation to make sure your transactions are both financially sound and legally secure.
              </p>

              <Link href="#contact" className="card-link">
                <span>Find your need</span>
                <IoArrowForwardOutline />
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
