import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/coastal-cliffs.jpg" 
                alt="Coastal Cliffs" 
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            {/* Subtle decorative element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10 blur-xl"></div>
            <div className="absolute top-4 -right-4 w-16 h-16 bg-blue-50 rounded-full -z-10 blur-lg"></div>
          </div>

          {/* Right Column */}
          <div>
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold tracking-wider mb-6">
              TENTANG KAMI
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Tentang Platform Valuasi Ekosistem<br />
              <span className="text-gradient">PKSPL IPB</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mt-4 mb-8">
              Ekosistem pesisir seperti mangrove, terumbu karang, dan padang lamun memiliki manfaat ekologis dan ekonomi yang sangat krusial. Platform ini hadir sebagai solusi digital end-to-end untuk:
            </p>

            <ul className="space-y-4 mt-6">
              <li className="flex gap-3">
                <div className="bg-blue-50 p-1 rounded-lg flex-shrink-0 h-fit">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">Digitalisasi Pendataan Data:</span>
                  <span className="text-slate-600 ml-1">Memudahkan masukan data primer & sekunder.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-blue-50 p-1 rounded-lg flex-shrink-0 h-fit">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">Kalkulasi Otomatis TEV:</span>
                  <span className="text-slate-600 ml-1">Mengakomodasi perhitungan Use Value (Direct, Indirect, Option) hingga Non-Use Value (Existence, Bequest).</span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-blue-50 p-1 rounded-lg flex-shrink-0 h-fit">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">Analisis & Kebijakan:</span>
                  <span className="text-slate-600 ml-1">Menyajikan analisis sensitivitas data dan rekomendasi strategi pengelolaan seperti Blue Economy, kawasan konservasi, hingga Pembayaran Jasa Ekosistem (PES).</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
