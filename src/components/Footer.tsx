import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <Briefcase className="w-5 h-5" />
              <span className="font-bold tracking-tight">DIGITAL WEB PORTAL</span>
            </div>
            <p className="text-xs text-slate-400">
              A professional recruitment platform connecting skilled candidates with top employers securely and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Candidates</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">Candidate Register</Link></li>
              <li><Link href="/candidate/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">HR Login</Link></li>
              <li><Link href="/hr/dashboard" className="hover:text-white transition-colors">HR Dashboard</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 DIGITAL WEB PORTAL. All rights reserved.
        </div>
      </div>
    </footer>
  );
}