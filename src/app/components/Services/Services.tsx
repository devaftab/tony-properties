import Image from 'next/image'
import Link from 'next/link'
import { IoArrowForwardOutline } from '.'
import styles from './Services.module.css'

export default function Services() {
  return (
    <section className={styles.service} id="service">
      <div className={`container ${styles.serviceContainer}`}>
        <p className={`section-subtitle ${styles.sectionSubtitle}`}>Our Services</p>
        <h2 className={`h2 section-title ${styles.sectionTitle}`}>Our Main Focus</h2>

        <ul className={styles.serviceList}>
          <li>
            <div className={styles.serviceCard}>
              <div className={styles.cardIcon}>
                <Image 
                  src="/images/service-1.png" 
                  alt="Service icon"
                  width={120}
                  height={120}
                />
              </div>

              <h3 className={`h3 ${styles.cardTitle}`}>
                Buy & Sell Property
              </h3>

              <p className={styles.cardText}>
                {`Whether you&apos;re looking to purchase your dream home or sell your current property for the best price, Tony Properties is here to guide you. From market analysis to final paperwork, we make every transaction smooth and profitable.`}
              </p>

              <Link href="#contact" className={styles.cardLink}>
                <span>Find your need</span>
                <IoArrowForwardOutline />
              </Link>
            </div>
          </li>

          <li>
            <div className={styles.serviceCard}>
              <div className={styles.cardIcon}>
                <Image 
                  src="/images/service-2.png" 
                  alt="Service icon"
                  width={120}
                  height={120}
                />
              </div>

              <h3 className={`h3 ${styles.cardTitle}`}>
                Rent & Lease Property
              </h3>

              <p className={styles.cardText}>
                From residential flats to commercial spaces, we connect you with the right tenants or landlords for both short-term rentals and long-term leases. Our process is transparent, quick, and stress-free.
              </p>

              <Link href="#contact" className={styles.cardLink}>
                <span>Find your need</span>
                <IoArrowForwardOutline />
              </Link>
            </div>
          </li>
          
          <li>
            <div className={styles.serviceCard}>
              <div className={styles.cardIcon}>
                <Image 
                  src="/images/service-3.png" 
                  alt="Service icon"
                  width={120}
                  height={120}
                />
              </div>

              <h3 className={`h3 ${styles.cardTitle}`}>
                Property Finance & Legal Help
              </h3>

              <p className={styles.cardText}>
                We assist with home loans, property funding, and legal documentation to make sure your transactions are both financially sound and legally secure.
              </p>

              <Link href="#contact" className={styles.cardLink}>
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
