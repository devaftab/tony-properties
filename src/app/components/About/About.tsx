import Image from 'next/image'
import Link from 'next/link'
import { IoCheckmarkCircleOutline } from '.'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={`container ${styles.aboutContainer}`}>
        <figure className={styles.aboutBanner}>
          <Image 
            src="/images/about-banner-1.png" 
            alt="House interior"
            width={400}
            height={300}
          />
          <Image 
            src="/images/about-banner-2.jpg" 
            alt="House interior" 
            className={styles.absImg}
            width={300}
            height={200}
          />
        </figure>

        <div className={styles.aboutContent}>
          <p className={`section-subtitle ${styles.sectionSubtitle}`}>About Us</p>
          <h2 className={`h2 section-title ${styles.sectionTitle}`}>Tony Properties</h2>

          <p className={styles.aboutText}>
            Tony Properties is a leading property dealer and consultant in Janak Puri, New Delhi, offering
            professional services in property sale, purchase, and renting. Founded and managed by Gurmeet Singh
            (Tony), we have built a strong reputation for delivering transparent, reliable, and profitable real estate
            solutions.
            Our deep knowledge of the Janak Puri and West Delhi property market allows us to guide our clients towards
            the best investment opportunities, whether they are buying a home, selling property, or looking for rental
            spaces.
          </p>

          <ul className={styles.aboutList}>
            <li className={styles.aboutItem}>
              <div className={styles.aboutItemIcon}>
                <IoCheckmarkCircleOutline />
              </div>
              <p className={styles.aboutItemText}>Sale & Purchase of Residential and Commercial Properties.</p>
            </li>

            <li className={styles.aboutItem}>
              <div className={styles.aboutItemIcon}>
                <IoCheckmarkCircleOutline />
              </div>
              <p className={styles.aboutItemText}>Rental Properties for Homes, Offices, and Shops</p>
            </li>

            <li className={styles.aboutItem}>
              <div className={styles.aboutItemIcon}>
                <IoCheckmarkCircleOutline />
              </div>
              <p className={styles.aboutItemText}>Property Collaboration & Development Projects</p>
            </li>
            
            <li className={styles.aboutItem}>
              <div className={styles.aboutItemIcon}>
                <IoCheckmarkCircleOutline />
              </div>
              <p className={styles.aboutItemText}>Finance Advice for Real Estate Investments</p>
            </li>
          </ul>

          <p className={styles.callout}>
            Tony Properties – Turning Your Real Estate Dreams into Reality in Janak Puri
          </p>

          <Link href="#service" className={`btn ${styles.btn}`}>Our Services</Link>
        </div>
      </div>
    </section>
  )
}
