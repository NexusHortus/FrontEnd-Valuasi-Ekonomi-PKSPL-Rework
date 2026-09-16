import React from 'react';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 45 },
  { name: 'Feb', users: 78 },
  { name: 'Mar', users: 120 },
  { name: 'Apr', users: 185 },
  { name: 'May', users: 267 },
  { name: 'Jun', users: 380 },
  { name: 'Jul', users: 456 },
  { name: 'Aug', users: 534 },
  { name: 'Sep', users: 623 },
  { name: 'Oct', users: 710 },
  { name: 'Nov', users: 812 },
  { name: 'Dec', users: 945 }
];

const StatsSection = () => {
  return (
    <section id="stats" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div>
            <img 
              src="/images/mangrove-forest.jpg" 
              alt="Mangrove Forest" 
              className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#1d4ed8" 
                      strokeWidth={3}
                      dot={{ fill: '#1d4ed8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mt-6">
                Statistik Partisipasi & Sebaran Ekosistem
              </h2>
              <p className="text-slate-600 leading-relaxed mt-3">
                Sistem ini mencatat pertumbuhan pengisian form valuasi secara real-time sekaligus memetakan sebaran objek ekosistem pesisir (Mangrove, Terumbu Karang, dan Lamun) yang paling banyak dianalisis oleh para peneliti dan pengambil kebijakan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
