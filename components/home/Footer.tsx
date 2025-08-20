import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/roboclub-logo.png" alt="RoboClub Logo" width={40} height={40} className="object-contain" />
              <span className="text-xl font-bold">RoboClub</span>
            </div>
            <p className="text-slate-400">Your trusted partner for electronics, robotics, and maker supplies.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-white transition-colors">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
            <Link href="/help-center" className="hover:text-white transition-colors">
              Help Center
            </Link>
              </li>
              <li>
            <Link href="/shipping-info" className="hover:text-white transition-colors">
              Shipping Info
            </Link>
              </li>
              <li>
            <Link href="/returns" className="hover:text-white transition-colors">
              Returns
            </Link>
              </li>
              <li>
            <Link href="/contact-us" className="hover:text-white transition-colors">
              Contact Us
            </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="text-slate-400 space-y-2">
              <p>roboclub.main@gmail.com</p>
              <p>+94729557537</p>
              <p>Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 RoboClub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}