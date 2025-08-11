import { IoCarSportOutline, IoArrowForwardOutline, IoWaterOutline, IoShieldCheckmarkOutline, IoFitnessOutline } from '.'
import styles from './Features.module.css'

export default function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <p className="section-subtitle">Our Aminities</p>
        <h2 className="h2 section-title">Building Aminities</h2>

        <ul className={styles.featuresList}>
          <li>
            <a href="#" className={styles.featuresCard}>
              <div className={styles.cardIcon}>
                <IoCarSportOutline />
              </div>
              <h3 className={styles.cardTitle}>Parking Space</h3>
              <div className={styles.cardBtn}>
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>

          <li>
            <a href="#" className={styles.featuresCard}>
              <div className={styles.cardIcon}>
                <IoWaterOutline />
              </div>
              <h3 className={styles.cardTitle}>Swimming Pool</h3>
              <div className={styles.cardBtn}>
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>

          <li>
            <a href="#" className={styles.featuresCard}>
              <div className={styles.cardIcon}>
                <IoShieldCheckmarkOutline />
              </div>
              <h3 className={styles.cardTitle}>Private Security</h3>
              <div className={styles.cardBtn}>
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>

          <li>
            <a href="#" className={styles.featuresCard}>
              <div className={styles.cardIcon}>
                <IoFitnessOutline />
              </div>
              <h3 className={styles.cardTitle}>Medical Center</h3>
              <div className={styles.cardBtn}>
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
