import { Link } from 'react-router-dom';
import { MapPin, Zap, Wrench, Camera } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-buzz-navy font-display text-3xl font-bold mb-2">About The Buzz Camper</h1>
        <div className="vw-divider w-24 mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-buzz-navy font-display text-xl font-bold mb-4">The Short Version</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We&apos;re a family based on a 40-acre property in southern Arizona. We&apos;ve been camping — really camping, 
              not glamping — for years. A Sequoia full of gear, the desert, and a campfire. That was the routine.
            </p>
            <p>
              Then we bought a VW ID. Buzz. And we decided we weren&apos;t going to stop camping just because our 
              vehicle no longer runs on dead dinosaurs. We were going to figure out EV camping the hard way: 
              by actually doing it and writing down everything that went wrong.
            </p>
            <p>
              This site is that documentation. It&apos;s also a product review archive, a build log for our 
              ongoing conversion project, and an honest resource for other ID. Buzz owners asking the same 
              questions we were asking six months ago.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-buzz-navy retro-border p-5 text-buzz-cream">
            <h3 className="text-buzz-orange font-bold text-sm uppercase tracking-widest mb-4">Quick Facts</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-buzz-orange mt-0.5 flex-shrink-0" />
                Southern Arizona &mdash; 40-acre off-grid property
              </li>
              <li className="flex items-start gap-2">
                <Zap size={14} className="text-buzz-orange mt-0.5 flex-shrink-0" />
                2024 VW ID. Buzz AWD Pro S
              </li>
              <li className="flex items-start gap-2">
                <Wrench size={14} className="text-buzz-orange mt-0.5 flex-shrink-0" />
                13+ years software engineering background
              </li>
              <li className="flex items-start gap-2">
                <Camera size={14} className="text-buzz-orange mt-0.5 flex-shrink-0" />
                All photos shot in the field — no studio setups
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-buzz-orange pt-8 mb-10">
        <h2 className="text-buzz-navy font-display text-xl font-bold mb-6">What This Site Is (And Isn&apos;t)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Honest reviews from real use', isWhat: true },
            { label: 'Long-term durability notes, not just unboxing', isWhat: true },
            { label: 'Mistakes and failures included', isWhat: true },
            { label: 'EV-specific camping focus', isWhat: true },
            { label: 'Paid positive reviews', isWhat: false },
            { label: 'Affiliate-driven gear recommendations', isWhat: false },
            { label: 'Gear we haven\'t actually used', isWhat: false },
            { label: 'Polished social media camping fantasy', isWhat: false },
          ].map(({ label, isWhat }) => (
            <div
              key={label}
              className={`flex items-center gap-3 p-3 border-2 ${isWhat ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}
            >
              <span className={`font-bold text-lg ${isWhat ? 'text-green-600' : 'text-red-500'}`}>
                {isWhat ? '+' : '–'}
              </span>
              <span className="text-sm text-gray-800">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-8">
        <h2 className="text-buzz-navy font-display text-xl font-bold mb-4">Work With Us</h2>
        <p className="text-gray-700 mb-4">
          If you make products for the ID. Buzz, EV camping, overlanding, or off-grid living, 
          we&apos;re interested in hearing from you. We review gear we believe in and decline everything else.
        </p>
        <Link
          to="/work-with-us"
          className="inline-flex bg-buzz-orange text-white px-5 py-2.5 font-bold retro-btn"
        >
          See Partnership Details &rarr;
        </Link>
      </div>
    </div>
  );
}
