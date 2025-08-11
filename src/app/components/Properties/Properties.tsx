import Image from 'next/image'
import Link from 'next/link'
import { IoLocationOutline, IoCameraOutline, IoFilmOutline, IoBedOutline, IoManOutline, IoHomeOutline, IoArrowForwardOutline } from '.'
import styles from './Properties.module.css'

export default function Properties() {
  return (
    <section className={styles.property} id="property">
      <div className="container">
        <p className="section-subtitle">Properties</p>
        <h2 className="h2 section-title">Featured Listings</h2>

        <ul className={styles.propertyList}>
          <li>
            <div className={styles.propertyCard}>
              <figure className={styles.cardBanner}>
                <Link href="#">
                  <Image 
                    src="/images/property-1.jpg" 
                    alt="New Apartment Nice View" 
                    className="w-100"
                    width={400}
                    height={300}
                  />
                </Link>

                <div className="card-badge green">For Rent</div>

                <div className={styles.bannerActions}>
                  <button className={styles.bannerActionsBtn}>
                    <IoLocationOutline />
                    <address>B2 Janakpuri</address>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className={styles.cardContent}>
                <div className={styles.cardPrice}><strong>₹34,900</strong>/Month</div>

                <h3 className="h3 card-title">
                  <Link href="#">3BHK</Link>
                </h3>

                <p className={styles.cardText}>
                  Spacious 3BHK apartment with modern amenities, located in a prime residential area.
                  Features include a well-designed kitchen, spacious bedrooms, and a beautiful balcony
                  with city views. Perfect for families seeking comfort and convenience.
                </p>

                <ul className={styles.cardList}>
                  <li className={styles.cardItem}>
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>2</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>350</strong>
                    <IoHomeOutline />
                    <span>Square yards</span>
                  </li>
                </ul>

                <Link href="/properties/3bhk" className={`btn ${styles.exploreBtn}`}>
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>

          <li>
            <div className={styles.propertyCard}>
              <figure className={styles.cardBanner}>
                <Link href="#">
                  <Image 
                    src="/images/property-2.jpg" 
                    alt="Modern Apartments" 
                    className="w-100"
                    width={400}
                    height={300}
                  />
                </Link>

                <div className="card-badge orange">For Sales</div>

                <div className={styles.bannerActions}>
                  <button className={styles.bannerActionsBtn}>
                    <IoLocationOutline />
                    <address>A2/15 Janakpuri</address>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className={styles.cardContent}>
                <div className={styles.cardPrice}><strong>₹35,90,000</strong></div>

                <h3 className="h3 card-title">
                  <Link href="#">Apartments</Link>
                </h3>

                <p className={styles.cardText}>
                  Modern apartment complex offering premium living spaces with contemporary design.
                  Each unit features high-quality finishes, smart home technology, and access to
                  community amenities including a gym, swimming pool, and landscaped gardens.
                </p>

                <ul className={styles.cardList}>
                  <li className={styles.cardItem}>
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>2</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>3450</strong>
                    <IoHomeOutline />
                    <span>Square Ft</span>
                  </li>
                </ul>

                <Link href="/properties/apartments" className={`btn ${styles.exploreBtn}`}>
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>

          <li>
            <div className={styles.propertyCard}>
              <figure className={styles.cardBanner}>
                <Link href="#">
                  <Image 
                    src="/images/property-3.jpg" 
                    alt="Comfortable Apartment" 
                    className="w-100"
                    width={400}
                    height={300}
                  />
                </Link>

                <div className="card-badge green">For Rent</div>

                <div className={styles.bannerActions}>
                  <button className={styles.bannerActionsBtn}>
                    <IoLocationOutline />
                    <address>A1/27 Uttam Nagar</address>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className={styles.cardContent}>
                <div className={styles.cardPrice}><strong>₹50,000</strong>/Month</div>

                <h3 className="h3 card-title">
                  <Link href="#">Floor</Link>
                </h3>

                <p className={styles.cardText}>
                  Elegant floor apartment with premium finishes and thoughtful design. Features
                  include an open-concept living area, designer kitchen with modern appliances,
                  and large windows that flood the space with natural light.
                </p>

                <ul className={styles.cardList}>
                  <li className={styles.cardItem}>
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>2</strong>
                      <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>3450</strong>
                    <IoHomeOutline />
                    <span>Square Ft</span>
                  </li>
                </ul>

                <Link href="/properties/floor" className={`btn ${styles.exploreBtn}`}>
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>

          <li>
            <div className={styles.propertyCard}>
              <figure className={styles.cardBanner}>
                <Link href="#">
                  <Image 
                    src="/images/property-4.png" 
                    alt="Luxury villa in Rego Park" 
                    className="w-100"
                    width={400}
                    height={300}
                  />
                </Link>

                <div className="card-badge green">For Rent</div>

                <div className={styles.bannerActions}>
                  <button className={styles.bannerActionsBtn}>
                    <IoLocationOutline />
                    <address>B2 Janakpuri</address>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className={styles.bannerActionsBtn}>
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className={styles.cardContent}>
                <div className={styles.cardPrice}><strong>₹34,000</strong>/Month</div>

                <h3 className="h3 card-title">
                  <Link href="#">Apartment</Link>
                </h3>

                <p className={styles.cardText}>
                  Cozy apartment with a warm, inviting atmosphere and practical layout.
                  Includes a functional kitchen, comfortable living space, and a private
                  balcony perfect for morning coffee or evening relaxation.
                </p>

                <ul className={styles.cardList}>
                  <li className={styles.cardItem}>
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>2</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className={styles.cardItem}>
                    <strong>3450</strong>
                    <IoHomeOutline />
                    <span>Square Ft</span>
                  </li>
                </ul>

                <Link href="/properties/apartment" className={`btn ${styles.exploreBtn}`}>
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>
        </ul>

        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link href="/properties" className={styles.exploreBtn}>
            <span>View All Properties</span>
            <IoArrowForwardOutline />
          </Link>
        </div>
      </div>
    </section>
  )
}
