import { ExternalLink, Zap, Map, Smartphone, ShoppingBag, Users } from 'lucide-react';

const RESOURCE_SECTIONS = [
  {
    icon: Zap,
    color: 'bg-buzz-orange',
    title: 'EV Charging & Route Planning',
    items: [
      { name: 'A Better Route Planner (ABRP)', desc: 'Best EV-specific route planner. Account for real weather, speed, and load.', url: 'https://abetterrouteplanner.com', tag: 'Essential' },
      { name: 'PlugShare', desc: 'Crowd-sourced charging station map with real user check-ins and photos.', url: 'https://plugshare.com', tag: 'Essential' },
      { name: 'Electrify America', desc: 'Primary fast-charging network for ID. Buzz in the US.', url: 'https://electrifyamerica.com', tag: 'Charging' },
      { name: 'ChargePoint', desc: 'Secondary network with good coverage in urban and suburban areas.', url: 'https://chargepoint.com', tag: 'Charging' },
    ],
  },
  {
    icon: Smartphone,
    color: 'bg-buzz-teal',
    title: 'Apps & Tools',
    items: [
      { name: 'We Connect ID. (VW)', desc: 'Official VW app for remote charging, pre-conditioning, and status monitoring.', url: '#', tag: 'VW Official' },
      { name: 'Victron Connect', desc: 'Monitor your Victron battery system, MPPT, and BMV-712 via Bluetooth.', url: 'https://victronenergy.com', tag: 'Power System' },
      { name: 'iOverlander', desc: 'Community-sourced campsite database with off-grid locations and conditions.', url: 'https://ioverlander.com', tag: 'Camping' },
      { name: 'Gaia GPS', desc: 'Offline topo maps. Essential for desert camping where cell coverage drops out.', url: 'https://gaiagps.com', tag: 'Navigation' },
    ],
  },
  {
    icon: ShoppingBag,
    color: 'bg-buzz-navy',
    title: 'Vendors We Trust',
    items: [
      { name: 'Battle Born Batteries', desc: 'Premium LiFePO4 batteries. Expensive but the BMS and warranty justify it for long-term builds.', url: 'https://battlebornbatteries.com', tag: 'Power' },
      { name: 'Renogy', desc: 'Solar panels, MPPT controllers, and accessories. Good value, widely available.', url: 'https://renogy.com', tag: 'Solar' },
      { name: 'BougeRV', desc: '12V fridges and camping electronics. Best price-to-draw ratio we\'ve found.', url: 'https://bougerv.com', tag: 'Fridges' },
      { name: 'Victron Energy', desc: 'Battery monitoring and charge controllers. The Bluetooth monitoring is worth the premium.', url: 'https://victronenergy.com', tag: 'Power' },
    ],
  },
  {
    icon: Map,
    color: 'bg-buzz-rust',
    title: 'Camping in the American Southwest',
    items: [
      { name: 'Recreation.gov', desc: 'Federal campsite reservations — national parks, BLM, and Forest Service.', url: 'https://recreation.gov', tag: 'Booking' },
      { name: 'BLM Arizona', desc: 'Free dispersed camping on Bureau of Land Management land. Our home turf.', url: 'https://blm.gov/arizona', tag: 'Free Camping' },
      { name: 'Campendium', desc: 'Campsite database with EV-friendliness filters and real photos.', url: 'https://campendium.com', tag: 'Research' },
      { name: 'The Dyrt', desc: 'Campsite reviews with offline capabilities and ranger tips.', url: 'https://thedyrt.com', tag: 'Research' },
    ],
  },
  {
    icon: Users,
    color: 'bg-buzz-teal',
    title: 'ID. Buzz Community',
    items: [
      { name: 'ID. Buzz Owners Forum', desc: 'Active community of ID. Buzz owners sharing mods, fixes, and experiences.', url: 'https://idbuzzowners.com', tag: 'Community' },
      { name: 'VW ID. Buzz Facebook Group', desc: 'Large community group — good for crowd-sourcing issues quickly.', url: 'https://facebook.com', tag: 'Community' },
      { name: 'Reddit r/VWIDBuzz', desc: 'Honest discussions, recall information, and mod advice.', url: 'https://reddit.com/r/VWIDBuzz', tag: 'Community' },
    ],
  },
];

const TAG_COLORS = {
  Essential: 'bg-buzz-orange text-white',
  'VW Official': 'bg-buzz-navy text-white',
  default: 'bg-gray-100 text-gray-700',
};

export default function Resources() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-buzz-rust p-2">
            <ExternalLink size={20} className="text-white" />
          </div>
          <h1 className="text-buzz-navy font-display text-3xl font-bold">Resources</h1>
        </div>
        <div className="vw-divider w-24 mt-1 mb-4" />
        <p className="text-gray-600 max-w-xl">
          Curated tools, apps, vendors, and communities for ID. Buzz owners. Updated as we discover 
          what actually earns a spot on this list.
        </p>
      </div>

      <div className="space-y-12">
        {RESOURCE_SECTIONS.map(({ icon: Icon, color, title, items }) => (
          <section key={title}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`${color} p-1.5`}>
                <Icon size={16} className="text-white" />
              </div>
              <h2 className="text-buzz-navy font-display font-bold text-lg">{title}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(({ name, desc, url, tag }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group retro-card p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-buzz-navy text-sm group-hover:text-buzz-orange transition-colors">
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 font-bold ${TAG_COLORS[tag] || TAG_COLORS.default}`}>
                        {tag}
                      </span>
                      <ExternalLink size={12} className="text-gray-400 group-hover:text-buzz-orange transition-colors" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
