import Image from 'next/image'
import Link from 'next/link'
import { IoLocationOutline, IoCameraOutline, IoFilmOutline, IoBedOutline, IoManOutline, IoHomeOutline, IoArrowForwardOutline } from '.'

export default function Properties() {
  return (
    <section className="property" id="property">
      <div className="container">
        <p className="section-subtitle">Properties</p>
        <h2 className="h2 section-title">Featured Listings</h2>

        <ul className="property-list">
          <li>
            <div className="property-card">
              <figure className="card-banner">
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

                <div className="banner-actions">
                  <button className="banner-actions-btn">
                    <IoLocationOutline />
                    <address>B2 Janakpuri</address>
                  </button>

                  <button className="banner-actions-btn">
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className="banner-actions-btn">
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className="card-content">
                <div className="card-price"><strong>₹34,900</strong>/Month</div>

                <h3 className="h3 card-title">
                  <Link href="#">3BHK</Link>
                </h3>

                <p className="card-text">
                  Spacious 3BHK apartment with modern amenities, located in a prime residential area.
                  Features include a well-designed kitchen, spacious bedrooms, and a beautiful balcony
                  with city views. Perfect for families seeking comfort and convenience.
                </p>

                <ul className="card-list">
                  <li className="card-item">
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>2</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>350</strong>
                    <IoHomeOutline />
                    <span>Square yards</span>
                  </li>
                </ul>

                <Link href="/properties/3bhk" className="btn explore-btn">
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>

          <li>
            <div className="property-card">
              <figure className="card-banner">
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

                <div className="banner-actions">
                  <button className="banner-actions-btn">
                    <IoLocationOutline />
                    <address>A2/15 Janakpuri</address>
                  </button>

                  <button className="banner-actions-btn">
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className="banner-actions-btn">
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className="card-content">
                <div className="card-price"><strong>₹35,90,000</strong></div>

                <h3 className="h3 card-title">
                  <Link href="#">Apartments</Link>
                </h3>

                <p className="card-text">
                  Modern apartment complex offering premium living spaces with contemporary design.
                  Each unit features high-quality finishes, smart home technology, and access to
                  community amenities including a gym, swimming pool, and landscaped gardens.
                </p>

                <ul className="card-list">
                  <li className="card-item">
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>2</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>3450</strong>
                    <IoHomeOutline />
                    <span>Square Ft</span>
                  </li>
                </ul>

                <Link href="/properties/apartments" className="btn explore-btn">
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>

          <li>
            <div className="property-card">
              <figure className="card-banner">
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

                <div className="banner-actions">
                  <button className="banner-actions-btn">
                    <IoLocationOutline />
                    <address>A1/27 Uttam Nagar</address>
                  </button>

                  <button className="banner-actions-btn">
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className="banner-actions-btn">
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className="card-content">
                <div className="card-price"><strong>₹50,000</strong>/Month</div>

                <h3 className="h3 card-title">
                  <Link href="#">Floor</Link>
                </h3>

                <p className="card-text">
                  Elegant floor apartment with premium finishes and thoughtful design. Features
                  include an open-concept living area, designer kitchen with modern appliances,
                  and large windows that flood the space with natural light.
                </p>

                <ul className="card-list">
                  <li className="card-item">
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>2</strong>
                      <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>3450</strong>
                    <IoHomeOutline />
                    <span>Square Ft</span>
                  </li>
                </ul>

                <Link href="/properties/floor" className="btn explore-btn">
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>

          <li>
            <div className="property-card">
              <figure className="card-banner">
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

                <div className="banner-actions">
                  <button className="banner-actions-btn">
                    <IoLocationOutline />
                    <address>B2 Janakpuri</address>
                  </button>

                  <button className="banner-actions-btn">
                    <IoCameraOutline />
                    <span>4</span>
                  </button>

                  <button className="banner-actions-btn">
                    <IoFilmOutline />
                    <span>2</span>
                  </button>
                </div>
              </figure>

              <div className="card-content">
                <div className="card-price"><strong>₹34,000</strong>/Month</div>

                <h3 className="h3 card-title">
                  <Link href="#">Apartment</Link>
                </h3>

                <p className="card-text">
                  Cozy apartment with a warm, inviting atmosphere and practical layout.
                  Includes a functional kitchen, comfortable living space, and a private
                  balcony perfect for morning coffee or evening relaxation.
                </p>

                <ul className="card-list">
                  <li className="card-item">
                    <strong>3</strong>
                    <IoBedOutline />
                    <span>Bedrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>2</strong>
                    <IoManOutline />
                    <span>Bathrooms</span>
                  </li>

                  <li className="card-item">
                    <strong>3450</strong>
                    <IoHomeOutline />
                    <span>Square Ft</span>
                  </li>
                </ul>

                <Link href="/properties/apartment" className="btn explore-btn">
                  <span>Explore Property</span>
                  <IoArrowForwardOutline />
                </Link>
              </div>
            </div>
          </li>
        </ul>

        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link href="/properties" className="explore-btn">
            <span>View All Properties</span>
            <IoArrowForwardOutline />
          </Link>
        </div>
      </div>
    </section>
  )
}
