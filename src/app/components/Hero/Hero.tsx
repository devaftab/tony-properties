import Image from 'next/image'
import Link from 'next/link'
import { IoHomeOutline } from '.'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Tony Properties – Best Property Dealer in Janak Puri, New Delhi
          </h1>
          <p className={styles.heroSubtitle}>
            <IoHomeOutline />
            <span>Tony Properties</span>
          </p>

          <p className={styles.heroText}>
            {`Tony Properties – Best Property Dealer in Janak Puri, New Delhi
            Looking to buy, sell, or rent property in Janak Puri? At Tony Properties, led by Gurmeet Singh (Tony), we
            offer expert property consultancy, finance advice, building, and collaboration services. Whether it's
            residential flats, commercial shops, builder floors, or rental spaces, we ensure, you get the best deals in
            New Delhi real estate.`}
          </p>

          <button className={`btn ${styles.btn}`}>
            <Link className="btn-link" href="#contact" rel="noopener">
              Make An Enquiry
            </Link>
          </button>
        </div>

        <figure className={styles.heroBanner}>
          <Image 
            src="/images/hero-banner-1.jpg" 
            alt="Modern house model" 
            className="w-100"
            width={600}
            height={400}
          />
        </figure>
      </div>
    </section>
  )
}
