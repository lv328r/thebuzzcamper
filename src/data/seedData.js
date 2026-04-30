export const SEED_ARTICLES = [
  {
    id: 'a1',
    type: 'journal',
    title: 'First Camping Trip: Joshua Tree in the ID. Buzz',
    slug: 'first-camping-trip-joshua-tree',
    excerpt: 'We packed up the family and pointed the ID. Buzz toward Joshua Tree. Here\'s what we learned about EV camping in the desert.',
    content: `<p>The moment we rolled past the park entrance with a full charge, I knew this was going to be different from every camping trip we'd done in the Sequoia. The ID. Buzz is a genuinely weird vehicle in the best possible way — it looks like something from a Pixar movie and drives like a luxury SUV, yet here we were hauling a rooftop tent and two weeks' worth of gear into the Mojave Desert.</p>

<h2>Range Anxiety is Real, But Manageable</h2>
<p>The drive from our property in southern Arizona was the first test. We had a full charge (260 miles EPA, roughly 220 in real-world desert conditions with the AC and the added weight of the gear). We planned two charging stops — one at a Electrify America station in Tucson, one in Palm Springs — and it worked exactly as planned. The key is just being honest with the range calculator and building in a buffer.</p>

<blockquote>Pro tip: The Plugshare app + ABRP (A Better Route Planner) combo is essential. Don't rely solely on the VW navigation for charging route planning.</blockquote>

<h2>What Worked</h2>
<p>The <strong>BougeRV 12V fridge</strong> ran continuously off our 200Ah lithium setup for the full three days without touching the main battery. We never even needed to run the van to top it up — our 200W roof solar handled it easily. More on that setup in an upcoming review.</p>

<p>The cabin stayed cool at night thanks to our <strong>Heatso Aircon</strong> unit — yes, we have AC in the van now, and it doesn't require idling the motor. Game changer for desert camping.</p>

<h2>What Didn't Work</h2>
<p>The stock cargo floor is slippery and there's no good way to tie things down. We need custom cargo solutions badly. I've been in contact with a few vendors about this and will have reviews up soon.</p>

<p>The factory roof rack weight limit is officially 75kg / 165lbs, which is tighter than I'd like for a full rooftop tent setup. More on this in my upcoming roof rack weight limit deep-dive.</p>`,
    category: 'journal',
    author: 'Paul Walker',
    authorId: 'admin',
    date: '2026-03-15',
    tags: ['Joshua Tree', 'desert camping', 'first trip', 'range planning'],
    coverImage: null,
    featured: true,
    comments: [
      {
        id: 'c1',
        userId: 'user2',
        userName: 'TerraVanLife',
        userAvatar: null,
        content: 'Great writeup! We\'ve been debating the ID. Buzz for our next build. The roof rack weight limit concern is real — what solutions are you looking at?',
        date: '2026-03-16',
        likes: 4,
      },
      {
        id: 'c2',
        userId: 'admin',
        userName: 'Paul Walker',
        userAvatar: null,
        content: 'Checking out aftermarket options from Thule and a few custom shops. Waiting on weight specs from both — will post when I have them.',
        date: '2026-03-17',
        likes: 2,
      },
    ],
  },
  {
    id: 'a2',
    type: 'review',
    title: 'BougeRV 30Qt 12V Fridge — 6-Week Desert Review',
    slug: 'bougerv-30qt-12v-fridge-review',
    excerpt: 'After six weeks of daily use in the ID. Buzz across Arizona and Utah desert camping, here\'s the honest verdict on the BougeRV 30Qt.',
    content: `<p>I bought this fridge with my own money six weeks ago. No sample, no discount code. Here's what I actually found after hundreds of miles and dozens of nights.</p>

<h2>What It Is</h2>
<p>The BougeRV 30Qt is a dual-zone 12V compressor fridge. It draws around 40W at startup and settles to roughly 25W in steady state at 72°F ambient. For an EV camping setup, that matters a lot — you're not running an alternator, so every watt counts.</p>

<h2>Performance</h2>
<p>In my testing across ambient temps from 55°F (Utah nights) to 105°F (Tucson afternoons), it maintained 38°F fridge / 0°F freezer without complaint. Power draw stayed predictable.</p>

<p>Connected to my 200Ah Battle Born lithium battery + 200W Renogy solar, I never ran the fridge below 80% state of charge. In full sun, the solar more than offset the draw.</p>

<h2>What Didn't Work</h2>
<p>The lid seal started to show wear at week 4. Not a failure — it still seals — but I wouldn't call it bulletproof. Watch this space for a long-term update at 6 months.</p>

<p>The companion app is essentially useless. Buggy, disconnects constantly. Just use the physical controls.</p>

<h2>Verdict</h2>
<p>For the price ($359 at time of purchase), this is the best EV-campvan fridge I've found. The low draw is the key selling point for ID. Buzz use specifically. Recommended, with the lid seal caveat.</p>

<h2>Rating</h2>
<p><strong>4/5 — Recommended</strong></p>`,
    category: 'review',
    rating: 4,
    product: { name: 'BougeRV 30Qt 12V Fridge', brand: 'BougeRV', price: '$359', link: '#' },
    pros: ['Excellent low power draw', 'Dual zone', 'Solid cooling in extreme heat', 'Good price'],
    cons: ['Companion app is buggy', 'Lid seal shows early wear', 'Noisy on hard ground'],
    author: 'Paul Walker',
    authorId: 'admin',
    date: '2026-04-01',
    tags: ['fridge', '12V', 'BougeRV', 'gear review'],
    coverImage: null,
    featured: true,
    vendorProvided: false,
    comments: [],
  },
  {
    id: 'a3',
    type: 'upgrade',
    title: 'Installing 200Ah Lithium Battery + 200W Solar in the ID. Buzz',
    slug: 'lithium-battery-solar-install',
    excerpt: 'The full build log for our off-grid power system: Battle Born batteries, Renogy solar, and Victron MPPT. What we learned and what we\'d do differently.',
    content: `<p>This install took three weekends. Here's the complete walkthrough, parts list, and the three mistakes I made so you don't have to.</p>

<h2>The Goal</h2>
<p>Run a 12V fridge, LED lighting, phone/device charging, and a small DC-AC inverter for 72 hours without sun input. Have solar cover steady-state loads on a clear day.</p>

<h2>Parts List</h2>
<p>Battle Born 100Ah 12V LiFePO4 (x2) — $999 each. Yes, expensive. Worth it for the weight savings, the BMS, and the warranty.</p>
<p>Renogy 100W Flexible Solar Panel (x2) — $189 each. The flexible panels work around the factory roof rail without drilling.</p>
<p>Victron SmartSolar MPPT 75/15 — $89. The Bluetooth monitoring alone is worth the price premium over a generic MPPT.</p>
<p>Victron BMV-712 Battery Monitor — $129. You need this. Flying blind on battery state of charge is how you kill cells.</p>

<h2>Install Notes</h2>
<p>The ID. Buzz has almost no under-floor storage compared to a traditional van. We mounted the batteries in the rear cargo area, secured with a custom aluminum bracket I fabricated. They sit below the cargo floor level using a recess I cut into the platform.</p>

<blockquote>Key lesson: Ground the system properly. I had a 2A parasitic draw for three days before I tracked it down to a poorly grounded inverter chassis. Get a multimeter and check everything before buttoning it up.</blockquote>`,
    category: 'upgrade',
    author: 'Paul Walker',
    authorId: 'admin',
    date: '2026-04-10',
    tags: ['solar', 'lithium battery', 'electrical', 'build log'],
    coverImage: null,
    featured: false,
    comments: [
      {
        id: 'c3',
        userId: 'user3',
        userName: 'DesertDwellerKJ',
        userAvatar: null,
        content: 'This is exactly what I needed. Question: did you have any issues with the ID. Buzz\'s 12V system interfering with the auxiliary battery?',
        date: '2026-04-11',
        likes: 3,
      },
    ],
  },
];

export const SEED_USERS = [
  {
    id: 'admin',
    username: 'Paul Walker',
    email: 'paul@thebuzzcamper.com',
    passwordHash: 'admin2026', 
    role: 'admin',
    bio: 'Engineer, off-grid desert dweller in southern Arizona. Daily-driving a VW ID. Buzz and converting it for family camping and overland adventures.',
    joinDate: '2026-01-01',
    avatar: null,
  },
];
