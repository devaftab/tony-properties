'use client'

import { useState } from 'react'
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoLogoWhatsapp, IoPaperPlaneOutline } from '.'
import styles from './Contact.module.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.phone || !formData.subject || !formData.message) {
      alert("Please fill in all required fields (Name, Phone, Subject, and Message are required).")
      return
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid phone number.")
      return
    }

    // Email validation (only if email is provided)
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address or leave it empty.")
        return
      }
    }

    // Format message for WhatsApp
    const whatsappMessage = `*New Contact Form Submission - Tony Properties*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}
*Subject:* ${formData.subject}
*Message:* ${formData.message}
This message was sent from the Tony Properties website contact form.`

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage)

    // WhatsApp number from the website
    const whatsappNumber = "+919811008968"

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Show success message
    alert(`${formData.name}! Opening WhatsApp to send your message.`)

    // Open WhatsApp with pre-filled message
    window.open(whatsappUrl, '_blank')

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <section className={styles.contact} id="contact">
      <div className={`container ${styles.contactContainer}`}>
        <p className={`section-subtitle ${styles.sectionSubtitle}`}>Contact Us</p>
        <h2 className={`h2 section-title ${styles.sectionTitle}`}>Get In Touch</h2>

        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h3 className={`h3 ${styles.contactTitle}`}>Contact Information</h3>

            <ul className={styles.contactList}>
              <li>
                <a href="#" className={styles.contactLink}>
                  <IoLocationOutline />
                  <address>A2/15, Near Plazzo Inn, Janakpuri, Delhi</address>
                </a>
              </li>

              <li>
                <a href="tel:+919811008968" className={styles.contactLink}>
                  <IoCallOutline />
                  <span>+91 9811008968</span>
                </a>
              </li>
              <li>
                <a href="tel:011-42720367" className={styles.contactLink}>
                  <IoCallOutline />
                  <span>011-42720367</span>
                </a>
              </li>

              <li>
                <a href="mailto:tonyproperties1958@gmail.com" className={styles.contactLink}>
                  <IoMailOutline />
                  <span>tonyproperties1958@gmail.com</span>
                </a>
              </li>

              <li>
                <a href="https://wa.me/+919811008968" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                  <IoLogoWhatsapp />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>

            <div className={styles.contactHours}>
              <h4 className="h4">Business Hours</h4>
              <p>Monday - Sunday: 10:30 AM - 7:30 PM</p>
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formInput}
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.formInput}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={styles.formInput}
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>Subject *</label>
              <select
                id="subject"
                name="subject"
                className={styles.formSelect}
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="Property Inquiry">Property Inquiry</option>
                <option value="Rental Request">Rental Request</option>
                <option value="Sales Inquiry">Sales Inquiry</option>
                <option value="General Question">General Question</option>
                <option value="Appointment Request">Appointment Request</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Message *</label>
              <textarea
                id="message"
                name="message"
                className={styles.formTextarea}
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Please describe your inquiry or request..."
              ></textarea>
            </div>

            <button type="submit" className={`btn ${styles.formBtn}`}>
              <IoPaperPlaneOutline />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
