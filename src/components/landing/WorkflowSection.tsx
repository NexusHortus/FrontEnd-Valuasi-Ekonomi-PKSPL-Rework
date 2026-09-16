import React from 'react';
import { ArrowRight } from 'lucide-react';

const WorkflowSection = () => {
  return (
    <section id="workflow" className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center">
            Panduan Alur Pengisian Form Valuasi
          </h2>
          <p className="text-blue-100 text-lg text-center max-w-2xl mx-auto mt-4">
            Ikuti langkah-langkah berikut untuk mengisi form valuasi ekosistem pesisir dan laut secara lengkap dan akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Left Column: Images */}
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/images/coral-reef.jpg" 
              alt="Terumbu Karang" 
              className="col-span-2 rounded-xl h-48 object-cover w-full border-2 border-white/20" 
            />
            <img 
              src="/images/seagrass-meadow.jpg" 
              alt="Padang Lamun" 
              className="rounded-xl h-40 object-cover w-full border-2 border-white/20" 
            />
            <img 
              src="/images/tropical-island.jpg" 
              alt="Pulau Tropis" 
              className="rounded-xl h-40 object-cover w-full border-2 border-white/20" 
            />
          </div>

          {/* Right Column: Steps */}
          <div className="space-y-6">
            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Buat Proyek Baru</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Mulai dengan membuat proyek valuasi baru dan isi informasi dasar terkait lokasi serta identitas proyek yang akan dianalisis.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Pengisian Indeks (Index)</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Input data indikator dan kriteria indeks penilaian sesuai dengan parameter wilayah yang sedang dikaji.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Tentukan Area Reklamasi</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Pilih jenis lokasi kajian yang sesuai, baik berupa ekosistem Mangrove maupun tipe area pesisir/reklamasi lainnya.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Input Jasa Ekosistem (Provisioning & Services)</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Masukkan data nilai manfaat ekosistem, mulai dari fungsi penyedia (Provisioning Services) hingga manfaat lingkungan lainnya.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0 border border-white/30">
                5
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Data Flora dan Fauna</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Lengkapi data keanekaragaman hayati dengan menginput jenis serta populasi flora dan fauna yang ada di lokasi studi.
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default WorkflowSection;
