import type { Metadata } from 'next'
import { Nunito_Sans, Poppins } from 'next/font/google'
import './globals.css'
import Script from 'next/script';

const nunitoSans = Nunito_Sans({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito-sans'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Tony Properties',
  description: 'Tony Properties in Janakpuri, New Delhi offers expert services in buying, selling, and renting properties. Trusted property consultant and finance adviser for residential and commercial real estate.',
  keywords: 'buy property in Janakpuri, residential property for sale New Delhi, affordable flats West Delhi, rent property Janakpuri, commercial space for rent West Delhi, property dealer Janakpuri, real estate consultant Delhi',
  authors: [{ name: 'Tony Properties' }],
  creator: 'Tony Properties',
  publisher: 'Tony Properties',
  robots: 'index, follow',
  openGraph: {
    title: 'Tony Properties - Best Property Dealer in Janakpuri, New Delhi',
    description: 'Expert property consultancy, finance advice, building, and collaboration services in Janakpuri, New Delhi.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Tony Properties'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          type="module" 
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
        />
        <Script 
          noModule 
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
        />
      </head>
      <body className={`${nunitoSans.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  )
}
