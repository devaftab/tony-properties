import Image from 'next/image'
import Link from 'next/link'
import { IoCheckmarkCircleOutline } from '.'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <figure className="about-banner">
          <Image 
            src="/images/about-banner-1.png" 
            alt="House interior"
            width={400}
            height={300}
          />
          <Image 
            src="/images/about-banner-2.jpg" 
            alt="House interior" 
            className="abs-img"
            width={300}
            height={200}
          />
        </figure>

        <div className="about-content">
          <p className="section-subtitle">About Us</p>
          <h2 className="h2 section-title">Tony Properties</h2>

          <p className="about-text">
            Tony Properties is a leading property dealer and consultant in Janak Puri, New Delhi, offering
            professional services in property sale, purchase, and renting. Founded and managed by Gurmeet Singh
            (Tony), we have built a strong reputation for delivering transparent, reliable, and profitable real estate
            solutions.
            Our deep knowledge of the Janak Puri and West Delhi property market allows us to guide our clients towards
            the best investment opportunities, whether they are buying a home, selling property, or looking for rental
            spaces.
          </p>

          <ul className="about-list">
            <li className="about-item">
              <div className="about-item-icon">
                <IoCheckmarkCircleOutline />
              </div>
              <p className="about-item-text">Sale & Purchase of Residential and Commercial Properties.</p>
            </li>

            <li className="about-item">
              <div className="about-item-icon">
                <IoCheckmarkCircleOutline />
              </div>
              <p className="about-item-text">Rental Properties for Homes, Offices, and Shops</p>
            </li>

            <li className="about-item">
              <div className="about-item-icon">
                <IoCheckmarkCircleOutline />
              </div>
              <p className="about-item-text">Property Collaboration & Development Projects</p>
            </li>
            
            <li className="about-item">
              <div className="about-item-icon">
                <IoCheckmarkCircleOutline />
              </div>
              <p className="about-item-text">Finance Advice for Real Estate Investments</p>
            </li>
          </ul>

          <p className="callout">
            Tony Properties – Turning Your Real Estate Dreams into Reality in Janak Puri
          </p>

          <Link href="#service" className="btn">Our Services</Link>
        </div>
      </div>
    </section>
  )
}
