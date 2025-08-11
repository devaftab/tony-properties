import { IoCarSportOutline, IoArrowForwardOutline, IoWaterOutline, IoShieldCheckmarkOutline, IoFitnessOutline } from 'react-icons/io5'
export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <p className="section-subtitle">Our Aminities</p>
        <h2 className="h2 section-title">Building Aminities</h2>

        <ul className="features-list">
          <li>
            <a href="#" className="features-card">
              <div className="card-icon">
                <IoCarSportOutline />
              </div>
              <h3 className="card-title">Parking Space</h3>
              <div className="card-btn">
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>

          <li>
            <a href="#" className="features-card">
              <div className="card-icon">
                <IoWaterOutline />
              </div>
              <h3 className="card-title">Swimming Pool</h3>
              <div className="card-btn">
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>

          <li>
            <a href="#" className="features-card">
              <div className="card-icon">
                <IoShieldCheckmarkOutline />
              </div>
              <h3 className="card-title">Private Security</h3>
              <div className="card-btn">
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>

          <li>
            <a href="#" className="features-card">
              <div className="card-icon">
                <IoFitnessOutline />
              </div>
              <h3 className="card-title">Medical Center</h3>
              <div className="card-btn">
                <IoArrowForwardOutline />
              </div>
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
