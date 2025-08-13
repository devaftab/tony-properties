'use client'
import { useState } from 'react'
import { IoSaveOutline, IoNotificationsOutline, IoShieldOutline, IoColorPaletteOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata'
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSettingChange = (category: string, key: string, value: boolean | string | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="admin-settings-page">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Configure your admin panel preferences</p>
      </div>

      {showSuccess && (
        <div className="success-banner">
          <IoCheckmarkCircleOutline />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="settings-container">
        {/* Notifications Settings */}
        <div className="settings-section">
          <div className="section-header">
            <IoNotificationsOutline />
            <h3>Notifications</h3>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
                Email Notifications
              </label>
              <p>Receive email alerts for important updates</p>
            </div>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
                Push Notifications
              </label>
              <p>Get real-time push notifications in browser</p>
            </div>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                />
                SMS Notifications
              </label>
              <p>Receive SMS alerts for critical updates</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <div className="section-header">
            <IoShieldOutline />
            <h3>Security</h3>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.security.twoFactor}
                  onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                />
                Two-Factor Authentication
              </label>
              <p>Add an extra layer of security to your account</p>
            </div>
            
            <div className="setting-item">
              <label>Session Timeout (minutes)</label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
              <p>Automatically log out after inactivity</p>
            </div>
            
            <div className="setting-item">
              <label>Password Expiry (days)</label>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
              </select>
              <p>Force password change after specified days</p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="section-header">
            <IoColorPaletteOutline />
            <h3>Appearance</h3>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label>Theme</label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
              <p>Choose your preferred color scheme</p>
            </div>
            
            <div className="setting-item">
              <label>Language</label>
              <select
                value={settings.appearance.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
                <option value="pa">Punjabi</option>
              </select>
              <p>Select your preferred language</p>
            </div>
            
            <div className="setting-item">
              <label>Timezone</label>
              <select
                value={settings.appearance.timezone}
                onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
              >
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Singapore">Singapore (SGT)</option>
                <option value="UTC">UTC</option>
              </select>
              <p>Set your local timezone for accurate timestamps</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <IoSaveOutline />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
