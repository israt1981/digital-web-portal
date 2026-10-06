'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Briefcase, Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-slate-800" />
            <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
              DIGITAL WEB PORTAL
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Browse Jobs
            </Link>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="inline-flex items-center space-x-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Link>
            <Link 
              href="/register" 
              className="inline-flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 focus:outline-none p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Home
          </Link>
          <Link 
            href="/jobs" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Browse Jobs
          </Link>
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Link>
            <Link 
              href="/register" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center px-3 py-2 text-base font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}