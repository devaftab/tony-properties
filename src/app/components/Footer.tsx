import Link from 'next/link'
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoLogoWhatsapp } from 'react-icons/io5'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-brand">
            <Link href="/" className="logo"> Tony Properties </Link>

            <p className="section-text">
              Lorem Ipsum is simply dummy text of the and typesetting industry.
              Lorem Ipsum is dummy text of the printing.
            </p>

            <ul className="contact-list">
              <li>
                <a href="#" className="contact-link">
                  <IoLocationOutline />
                  <address>A2/15 Janakpuri</address>
                </a>
              </li>

              <li>
                <a href="tel:+919811008968" className="contact-link">
                  <IoCallOutline />
                  <span>+91 9811008968</span>
                </a>
              </li>

              <li>
                <a href="mailto:tonyproperties1958@gmail.com" className="contact-link">
                  <IoMailOutline />
                  <span>tonyproperties1958@gmail.com</span>
                </a>
              </li>
            </ul>

            <ul className="social-list">
              <li>
                <a href="#" className="social-link">
                  <IoLogoWhatsapp />
                </a>
              </li>

              <li>
                <a href="https://wa.me/+919811008968" className="social-link" target="_blank" rel="noopener noreferrer">
                  <IoLogoWhatsapp />
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-link-box">
            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Company</p>
              </li>

              <li>
                <Link href="/#about" className="footer-link">About</Link>
              </li>

              <li>
                <Link href="/#property" className="footer-link">All Products</Link>
              </li>

              <li>
                <Link href="#" className="footer-link">Locations Map</Link>
              </li>

              <li>
                <Link href="#" className="footer-link">FAQ</Link>
              </li>

              <li>
                <Link href="/#contact" className="footer-link">Contact us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; 2025 <a href="https://devaftab.xyz" target="_blank" rel="noopener noreferrer">code by: devaftab</a>.
            All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
