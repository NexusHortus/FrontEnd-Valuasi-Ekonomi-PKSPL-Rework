import React from 'react';
import { MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a2540] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Row */}
        <div className="pt-16 pb-8 flex items-center gap-2">
          <img src="/images/ipb-logo.png" alt="IPB Logo" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-white text-2xl font-bold">PKSPL IPB</span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Grid Content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">PKSPL IPB</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform sistem informasi berbasis web untuk analisis Total Economic Value (TEV) ekosistem pesisir dan laut guna mendukung pengambilan keputusan kebijakan lingkungan yang berkelanjutan
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigasi</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Beranda</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Kawasan</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Valuasi</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Analisis</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Kontak</a></li>
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">Deskripsi Valuasi</a></li>
              <li><a href="#stats" className="text-slate-400 hover:text-white transition-colors text-sm">Grafik Pengguna</a></li>
              <li><a href="#workflow" className="text-slate-400 hover:text-white transition-colors text-sm">Panduan</a></li>
              <li><a href="#map" className="text-slate-400 hover:text-white transition-colors text-sm">Map Sebaran</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontak</h3>
            <div className="flex gap-2 mb-6">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-slate-400 text-sm leading-relaxed">
                Kampus IPB Jl. Pajajaran Raya No.1, RT.02/RW.05, Baranangsiang, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16127
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 PKSPL IPB. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
