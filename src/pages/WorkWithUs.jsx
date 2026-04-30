import { Mail, FileText, CheckCircle, Clock, Camera, PenSquare } from 'lucide-react';

const DELIVERABLES = [
  { icon: PenSquare, title: 'Long-Form Written Review', desc: '1,000–2,500 words. Structured with context, real conditions, pros/cons, and a clear verdict. SEO-optimized for the ID. Buzz niche.' },
  { icon: Camera, title: 'Photo Set (8–12 Images)', desc: 'Shot in the field — desert light, real camping conditions. Not stock photography. Usable for social and press channels with credit.' },
  { icon: Clock, title: '6-Week Minimum Test Period', desc: 'We test products across multiple trips and conditions before publishing. No rushed reviews. Long-term durability noted where applicable.' },
  { icon: CheckCircle, title: 'FTC-Compliant Disclosure', desc: 'Every vendor-provided sample is clearly disclosed in the post header and footer. We maintain full editorial control.' },
];

const AUDIENCE = [
  { label: 'Primary Niche', value: 'VW ID. Buzz owners, prospective buyers, EV campers' },
  { label: 'Location', value: 'US — primarily Southwest, growing national' },
  { label: 'Profile', value: 'Technical, gear-oriented, outdoor families' },
  { label: 'Interests', value: 'EV camping, overlanding, off-grid living, vehicle upgrades' },
];

export default function WorkWithUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-block bg-buzz-orange px-3 py-1 text-white text-xs font-bold uppercase tracking-widest mb-4 font-mono-retro">
          Vendor &amp; Brand Partnerships
        </div>
        <h1 className="text-buzz-navy font-display text-3xl font-bold mb-2">Work With Us</h1>
        <div className="vw-divider w-24 mb-4" />
        <p className="text-gray-700 text-lg max-w-xl leading-relaxed">
          We review gear for EV campers, ID. Buzz owners, and overlanders. If your product fits our 
          audience, let&apos;s talk.
        </p>
      </div>

      {/* Why Us */}
      <section className="mb-12 bg-buzz-navy text-buzz-cream p-6 retro-border">
        <h2 className="text-buzz-orange font-display font-bold text-xl mb-4">Why the ID. Buzz Niche Matters</h2>
        <div className="space-y-3 text-sm leading-relaxed text-buzz-sand">
          <p>
            &ldquo;ID. Buzz daily-driver-meets-camper-conversion&rdquo; is an absurdly specific niche — 
            and that&apos;s the point. Any vendor making products for it will see almost zero overlap 
            with bigger generalist outdoor blogs.
          </p>
          <p>
            For niche products — rooftop tents sized for the ID. Buzz, EV-friendly fridges, low-draw 
            lighting, fitted bedding, bike racks that clear the rear hatch — a small dedicated 
            audience converts better than a large generic one. That&apos;s your advantage here.
          </p>
          <p>
            We&apos;re building content specifically for ID. Buzz owners searching for product recommendations, 
            and we rank for long-tail queries that generalist sites haven&apos;t covered.
          </p>
        </div>
      </section>

      {/* Audience */}
      <section className="mb-10">
        <h2 className="text-buzz-navy font-display font-bold text-xl mb-5">Audience Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AUDIENCE.map(({ label, value }) => (
            <div key={label} className="border-2 border-buzz-navy p-4">
              <p className="text-xs font-mono-retro text-buzz-teal uppercase tracking-widest mb-1">{label}</p>
              <p className="text-buzz-navy font-medium">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          Detailed audience stats and growth metrics available in our media kit upon request.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mb-10">
        <h2 className="text-buzz-navy font-display font-bold text-xl mb-5">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DELIVERABLES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="retro-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-buzz-orange" />
                <h3 className="font-bold text-buzz-navy text-sm">{title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Standards */}
      <section className="mb-10 bg-buzz-cream border-2 border-buzz-navy p-6">
        <h2 className="text-buzz-navy font-display font-bold text-xl mb-4">Our Standards</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          {[
            'We only review products relevant to the ID. Buzz camping and overland space.',
            'We test for a minimum of 6 weeks across multiple real camping trips.',
            'We publish honest reviews — including criticism and failure modes.',
            'We disclose every vendor-provided sample clearly in every post.',
            'We retain full editorial control. We do not accept payment for positive reviews.',
            'We do not review products we wouldn\'t use ourselves or recommend to our community.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle size={14} className="text-buzz-teal flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-buzz-navy font-display font-bold text-xl mb-4">Get in Touch</h2>
        <p className="text-gray-700 mb-4 text-sm">
          Send us a brief overview of your product, who it&apos;s for, and why you think it fits our audience. 
          We review every inquiry and respond within 5 business days.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:partnerships@thebuzzcamper.com"
            className="flex items-center gap-2 bg-buzz-orange text-white px-5 py-3 font-bold retro-btn"
          >
            <Mail size={16} /> partnerships@thebuzzcamper.com
          </a>
          <a
            href="#media-kit"
            className="flex items-center gap-2 border-2 border-buzz-navy text-buzz-navy px-5 py-3 font-bold hover:bg-buzz-navy hover:text-white transition-colors retro-btn"
          >
            <FileText size={16} /> Request Media Kit
          </a>
        </div>
      </section>

      {/* Media Kit stub */}
      <section id="media-kit" className="border-t-2 border-gray-200 pt-8">
        <h2 className="text-buzz-navy font-display font-bold text-xl mb-4">Media Kit</h2>
        <p className="text-gray-600 text-sm mb-4">
          Our full media kit includes audience demographics, traffic statistics, example past reviews, 
          photo samples, and past brand partnerships. Request it via email and we&apos;ll send it within 24 hours.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Audience Stats', 'Sample Reviews', 'Photo Portfolio', 'Contact & Rates'].map((item) => (
            <div key={item} className="bg-buzz-cream border-2 border-dashed border-buzz-navy p-3 text-center">
              <p className="text-xs font-bold text-buzz-navy">{item}</p>
              <p className="text-xs text-gray-500 mt-1">Included in kit</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
