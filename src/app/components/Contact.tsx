'use client'

import { useState } from 'react'
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoLogoWhatsapp, IoPaperPlaneOutline } from 'react-icons/io5'

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
    <section className="contact" id="contact">
      <div className="container">
        <p className="section-subtitle">Contact Us</p>
        <h2 className="h2 section-title">Get In Touch</h2>

        <div className="contact-content">
          <div className="contact-info">
            <h3 className="h3 contact-title">Contact Information</h3>

            <ul className="contact-list">
              <li>
                <a href="#" className="contact-link">
                  <IoLocationOutline />
                  <address>A2/15, Near Plazzo Inn, Janakpuri, Delhi</address>
                </a>
              </li>

              <li>
                <a href="tel:+919811008968" className="contact-link">
                  <IoCallOutline />
                  <span>+91 9811008968</span>
                </a>
              </li>
              
              <li>
                <a href="tel:01142720367" className="contact-link">
                  <IoCallOutline />
                  <span>01142720367</span>
                </a>
              </li>

              <li>
                <a href="mailto:tonyproperties1958@gmail.com" className="contact-link">
                  <IoMailOutline />
                  <span>tonyproperties1958@gmail.com</span>
                </a>
              </li>

              <li>
                <a href="https://wa.me/+919811008968" className="contact-link" target="_blank" rel="noopener noreferrer">
                  <IoLogoWhatsapp />
                  <span>WhatsApp: +91 9811008968</span>
                </a>
              </li>
            </ul>

            <div className="contact-hours">
              <h4 className="h4">Business Hours</h4>
              <p>Monday - Sunday: 10:00 AM - 7:30 PM</p>
            </div>
          </div>

          <div className="contact-form">
            <h3 className="h3 contact-title">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-input" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address (Optional)</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <select 
                  id="subject" 
                  name="subject" 
                  className="form-select"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="property-inquiry">Property Inquiry</option>
                  <option value="buy-property">Buy Property</option>
                  <option value="rent-property">Rent Property</option>
                  <option value="sell-property">Sell Property</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="appointment">Schedule Appointment</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="form-textarea" 
                  rows={5}
                  placeholder="Please describe your inquiry in detail..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn form-btn">
                <span>Send Message</span>
                <IoPaperPlaneOutline />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
