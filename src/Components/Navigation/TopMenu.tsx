"use client"

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function TopMenu() {
  const t = useTranslations('navigation')
  const locale = useLocale()
  
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t('home'), href: `/${locale}` },
    { name: t('jobOffers'), href: `/${locale}/job-offer-list` }
  ]

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-sm bg-white shadow-md' : 'bg-white/10 backdrop-blur-sm'} border-t-[1.5px] border-b-[1.5px] border-primary`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary font-bold text-xl">
                LOGO
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/registro"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t('register')}
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-gray-100 focus:outline-none transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white/95 backdrop-blur-sm border-t border-gray-200`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200 px-2">
              <Link
                href="/login"
                className="block w-full text-center text-primary px-4 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {t('login')}
              </Link>
              <Link
                href="/registro"
                className="block w-full text-center text-white bg-primary mt-2 px-4 py-2 rounded-md text-base font-medium hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                {t('register')}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16" />
    </>
  )
}