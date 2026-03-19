// ═══════════════════════════════════════════════════════════════════
//  BODIES  –  all scientific data for planets, moons, stars
// ═══════════════════════════════════════════════════════════════════

export const BODIES = {
  Sun: {
    subtitle: "G-type Main Sequence Star",
    blurb: "The Sun is the gravitational anchor of our Solar System — a sphere of hot plasma 1.4 million km across, fusing 620 million tonnes of hydrogen into helium every second in its core.",
    stats: [
      { label: "Diameter",      value: "1.39 × 10⁶ km" },
      { label: "Mass",          value: "1.99 × 10³⁰ kg" },
      { label: "Surface temp",  value: "5,778 K" },
      { label: "Core temp",     value: "1.5 × 10⁷ K" },
      { label: "Age",           value: "4.603 Gyr" },
      { label: "Spectral type", value: "G2V" },
    ],
    facts: [
      "Contains 99.86% of the Solar System's total mass",
      "Light takes exactly 8 minutes 20 seconds to reach Earth",
      "The solar wind streams out at 400–800 km/s constantly",
      "Will exhaust its hydrogen fuel in ~5 billion years",
      "Differential rotation: 25 days at equator, 35 days at poles",
      "The corona reaches temperatures above 1,000,000 K — hotter than the surface",
    ]
  },

  Mercury: {
    subtitle: "Terrestrial Planet · 1st from Sun",
    blurb: "The innermost and smallest planet in the Solar System. With no significant atmosphere to retain heat, Mercury swings between the Solar System's most extreme surface temperatures.",
    stats: [
      { label: "Avg distance",  value: "5.79 × 10⁷ km" },
      { label: "Diameter",      value: "4,879 km" },
      { label: "Mass",          value: "3.30 × 10²³ kg" },
      { label: "Day length",    value: "58.6 Earth d" },
      { label: "Year length",   value: "87.97 Earth d" },
      { label: "Moons",         value: "0" },
    ],
    facts: [
      "Surface temperatures swing from −180 °C to 430 °C",
      "Its iron core occupies ~85% of the planet's radius",
      "Second densest planet after Earth despite being smallest",
      "Has ice water in permanently shadowed polar craters",
      "Visited by Mariner 10 (1974) and MESSENGER (2004–2015)",
      "BepiColombo mission currently en route, arriving 2025",
    ]
  },

  Venus: {
    subtitle: "Terrestrial Planet · 2nd from Sun",
    blurb: "The brightest planet in Earth's sky and our nearest neighbour. A runaway greenhouse effect has made it the hottest planet — hotter than Mercury despite being farther from the Sun.",
    stats: [
      { label: "Avg distance",  value: "1.08 × 10⁸ km" },
      { label: "Diameter",      value: "12,104 km" },
      { label: "Mass",          value: "4.87 × 10²⁴ kg" },
      { label: "Day length",    value: "243 Earth d" },
      { label: "Year length",   value: "224.7 Earth d" },
      { label: "Surface temp",  value: "465 °C avg" },
    ],
    facts: [
      "Spins retrograde — the Sun rises in the west",
      "Atmospheric pressure at surface is 92× Earth's",
      "A Venusian day is longer than its year",
      "Clouds of sulfuric acid cover the entire planet",
      "No moons and no global magnetic field",
      "Brightest natural night-sky object after the Moon",
    ]
  },

  Earth: {
    subtitle: "Terrestrial Planet · 3rd from Sun",
    blurb: "The only known planet to harbour life, with liquid water on its surface, a protective magnetosphere, and an oxygen-nitrogen atmosphere sustaining an extraordinary diversity of biology.",
    stats: [
      { label: "Avg distance",  value: "1.496 × 10⁸ km" },
      { label: "Diameter",      value: "12,742 km" },
      { label: "Mass",          value: "5.97 × 10²⁴ kg" },
      { label: "Day length",    value: "23 h 56 min" },
      { label: "Year length",   value: "365.25 days" },
      { label: "Moons",         value: "1 (Luna)" },
    ],
    facts: [
      "Axial tilt of 23.5° is responsible for the seasons",
      "~71% of the surface is covered by liquid water",
      "The magnetic field extends 65,000 km into space",
      "Oldest known rocks date to ~4.4 billion years ago",
      "The only planet not named after a mythological deity",
      "Has a single large moon — unusually big for a rocky planet",
    ]
  },

  Mars: {
    subtitle: "Terrestrial Planet · 4th from Sun",
    blurb: "The Red Planet — a cold, dusty desert world with the tallest volcano and longest canyon in the Solar System. Ancient river valleys prove liquid water once shaped its landscape.",
    stats: [
      { label: "Avg distance",  value: "2.28 × 10⁸ km" },
      { label: "Diameter",      value: "6,779 km" },
      { label: "Mass",          value: "6.39 × 10²³ kg" },
      { label: "Day length",    value: "24 h 37 min" },
      { label: "Year length",   value: "687 Earth days" },
      { label: "Moons",         value: "2 (Phobos, Deimos)" },
    ],
    facts: [
      "Olympus Mons is 22 km high — nearly 3× the height of Everest",
      "Valles Marineris stretches 4,000 km — as wide as the USA",
      "CO₂ atmosphere at only ~0.6% of Earth's surface pressure",
      "Average surface temperature is −60 °C",
      "Curiosity and Perseverance rovers currently operate on its surface",
      "Phobos will crash into Mars or break apart in ~50 million years",
    ]
  },

  Jupiter: {
    subtitle: "Gas Giant · 5th from Sun",
    blurb: "The Solar System's giant — more massive than all other planets combined. Jupiter's powerful gravity has shaped the entire Solar System, capturing comets and shielding the inner planets.",
    stats: [
      { label: "Avg distance",  value: "7.78 × 10⁸ km" },
      { label: "Diameter",      value: "139,820 km" },
      { label: "Mass",          value: "1.90 × 10²⁷ kg" },
      { label: "Day length",    value: "9 h 56 min" },
      { label: "Year length",   value: "11.86 Earth yr" },
      { label: "Moons",         value: "95 confirmed" },
    ],
    facts: [
      "Great Red Spot is a storm larger than Earth, raging for 350+ years",
      "Mass equals 2.5× all other planets in the Solar System combined",
      "Its moon Ganymede is larger than Mercury",
      "Europa likely has a liquid ocean beneath its icy crust",
      "Emits more heat than it receives from the Sun",
      "Faint ring system was discovered by Voyager 1 in 1979",
    ]
  },

  Saturn: {
    subtitle: "Gas Giant · 6th from Sun",
    blurb: "The jewel of the Solar System. Saturn's ring system — composed of billions of ice and rock fragments — spans 282,000 km yet averages only ~10 metres in thickness.",
    stats: [
      { label: "Avg distance",  value: "1.43 × 10⁹ km" },
      { label: "Diameter",      value: "116,460 km" },
      { label: "Mass",          value: "5.68 × 10²⁶ kg" },
      { label: "Day length",    value: "10 h 42 min" },
      { label: "Year length",   value: "29.5 Earth yr" },
      { label: "Moons",         value: "146 confirmed" },
    ],
    facts: [
      "Least dense planet — less dense than liquid water (0.687 g/cm³)",
      "Titan has a thick nitrogen atmosphere and liquid methane lakes",
      "Hexagonal polar vortex storm ~30,000 km wide",
      "Ring particles range from micrometres to tens of metres",
      "Wind speeds reach up to 1,800 km/h",
      "Enceladus shoots water vapour geysers from its south pole",
    ]
  },

  Uranus: {
    subtitle: "Ice Giant · 7th from Sun",
    blurb: "An ice giant rotating on its side — axial tilt of 98° means its poles receive more sunlight than its equator. Composed primarily of water, methane, and ammonia ices above a rocky core.",
    stats: [
      { label: "Avg distance",  value: "2.87 × 10⁹ km" },
      { label: "Diameter",      value: "50,724 km" },
      { label: "Mass",          value: "8.68 × 10²⁵ kg" },
      { label: "Axial tilt",    value: "97.77°" },
      { label: "Year length",   value: "84 Earth yr" },
      { label: "Moons",         value: "27 confirmed" },
    ],
    facts: [
      "Only planet to rotate on its side — likely caused by an ancient collision",
      "Named after the Greek sky deity — the only planet with a Greek name",
      "Has 13 known rings — discovered in 1977",
      "Coldest planetary atmosphere in the Solar System at −224 °C",
      "Only visited once: Voyager 2 in January 1986",
      "Miranda, its moon, has cliffs 20 km high — the tallest known",
    ]
  },

  Neptune: {
    subtitle: "Ice Giant · 8th from Sun",
    blurb: "The farthest planet, taking 165 years to orbit the Sun once. Neptune's turbulent atmosphere hosts the fastest sustained winds in the Solar System, despite receiving only 1/900th of Earth's sunlight.",
    stats: [
      { label: "Avg distance",  value: "4.50 × 10⁹ km" },
      { label: "Diameter",      value: "49,244 km" },
      { label: "Mass",          value: "1.02 × 10²⁶ kg" },
      { label: "Day length",    value: "16 h 6 min" },
      { label: "Year length",   value: "164.8 Earth yr" },
      { label: "Moons",         value: "16 confirmed" },
    ],
    facts: [
      "Wind speeds reach 2,100 km/h — fastest sustained winds in the Solar System",
      "Predicted mathematically by Le Verrier and Adams before observation (1846)",
      "Triton orbits retrograde and is being pulled inward — will break apart in ~3.6 Gyr",
      "Emits 2.6× more heat than it receives from the Sun",
      "Only visited by Voyager 2 in 1989 — no other mission has been there since",
      "One Neptune year = 164.8 Earth years — it has completed just one orbit since discovery",
    ]
  },

  // ── Moons ──────────────────────────────────────────────────────────────────
  Luna: {
    subtitle: "Earth's Natural Satellite",
    blurb: "The Moon is Earth's only natural satellite and the fifth largest moon in the Solar System. Its gravitational influence stabilises Earth's axial tilt and drives our ocean tides.",
    stats: [
      { label: "Distance",      value: "384,400 km" },
      { label: "Diameter",      value: "3,474 km" },
      { label: "Orbital period", value: "27.3 days" },
      { label: "Surface temp",  value: "−173 to 127 °C" },
    ],
    facts: [
      "Tidally locked — always shows the same face to Earth",
      "12 humans walked on its surface between 1969 and 1972",
      "Slowly receding from Earth at ~3.8 cm per year",
      "Has no global magnetic field or significant atmosphere",
      "Ice water confirmed in permanently shadowed polar craters",
      "Formed ~4.5 Gyr ago from debris after a Mars-sized body hit proto-Earth",
    ]
  },

  Io: {
    subtitle: "Moon of Jupiter · Most Volcanic World",
    blurb: "Io is the most volcanically active body in the Solar System. Gravitational tidal forces from Jupiter and its neighbouring moons continuously knead its interior, generating intense heat.",
    stats: [
      { label: "Distance (Jupiter)", value: "421,700 km" },
      { label: "Diameter",      value: "3,643 km" },
      { label: "Orbital period", value: "1.77 days" },
      { label: "Volcanism",     value: "400+ active volcanoes" },
    ],
    facts: [
      "Eruptions can shoot plumes 500 km into space",
      "Surface is constantly resurfaced by lava — no impact craters remain",
      "Tidal heating from Jupiter generates more heat than Earth's interior",
      "Surface temperature averages −130 °C between volcanic hotspots",
      "Has a thin atmosphere of sulfur dioxide",
      "Named after Io, a priestess of Hera in Greek mythology",
    ]
  },

  Europa: {
    subtitle: "Moon of Jupiter · Ocean World",
    blurb: "Europa is one of the most promising candidates for extraterrestrial life. Beneath its icy crust lies a global saltwater ocean containing twice as much water as all of Earth's oceans.",
    stats: [
      { label: "Distance (Jupiter)", value: "670,900 km" },
      { label: "Diameter",      value: "3,122 km" },
      { label: "Orbital period", value: "3.55 days" },
      { label: "Ocean depth",   value: "60–150 km est." },
    ],
    facts: [
      "Subsurface ocean may have twice Earth's total ocean volume",
      "Surface ice is criss-crossed with reddish lines — likely mineral-rich water",
      "Could have hydrothermal vents on its ocean floor — potential for life",
      "NASA's Europa Clipper mission launched in October 2024",
      "Tidally locked to Jupiter like our Moon to Earth",
      "Surface temperature is −160 °C at the equator",
    ]
  },

  Titan: {
    subtitle: "Moon of Saturn · Hazy Giant",
    blurb: "Titan is the only moon in the Solar System with a dense atmosphere, and the only body other than Earth with stable liquid on its surface — lakes of liquid methane and ethane.",
    stats: [
      { label: "Distance (Saturn)", value: "1.22 × 10⁶ km" },
      { label: "Diameter",      value: "5,150 km" },
      { label: "Orbital period", value: "15.95 days" },
      { label: "Atm pressure",  value: "1.45× Earth's" },
    ],
    facts: [
      "Larger than Mercury — the second largest moon in the Solar System",
      "Methane rain falls, collects in rivers, and pools in polar seas",
      "The Huygens probe landed on Titan in January 2005",
      "NASA's Dragonfly mission will fly a drone on Titan, launching 2028",
      "Thick orange haze of complex organic chemicals (tholins) fills its atmosphere",
      "A day on Titan lasts nearly 16 Earth days",
    ]
  },

  // ── Real stars ─────────────────────────────────────────────────────────────
  Sirius: {
    subtitle: "Binary Star System · Canis Major",
    blurb: "Sirius — the Dog Star — is the brightest star in Earth's night sky. A binary system consisting of Sirius A, a hot main-sequence star, and Sirius B, a dense white dwarf companion.",
    stats: [
      { label: "Distance",      value: "8.60 ly" },
      { label: "Distance (km)", value: "8.13 × 10¹³ km" },
      { label: "Luminosity",    value: "25.4 × Sun" },
      { label: "Spectral type", value: "A1V / DA2" },
      { label: "Surface temp",  value: "9,940 K" },
      { label: "Age",           value: "~200–300 Myr" },
    ],
    facts: [
      "Sirius A is ~1.7× the Sun's radius and ~2× its mass",
      "Sirius B is a white dwarf the size of Earth but as massive as the Sun",
      "Appears brightest partly because of its proximity — not intrinsic brightness alone",
      "Ancient Egyptians used its heliacal rising to predict Nile floods",
      "Will be the closest star to the Solar System in ~8,600 years",
      "Both stars orbit their common centre of mass every 50.1 years",
    ]
  },

  Betelgeuse: {
    subtitle: "Red Supergiant · Orion (α Orionis)",
    blurb: "One of the largest and most luminous stars visible to the naked eye — a red supergiant near the end of its stellar life. When it explodes as a supernova, it may be visible in daylight.",
    stats: [
      { label: "Distance",      value: "~700 ly" },
      { label: "Distance (km)", value: "~6.62 × 10¹⁵ km" },
      { label: "Radius",        value: "~764 × Sun" },
      { label: "Luminosity",    value: "~1.26 × 10⁵ × Sun" },
      { label: "Surface temp",  value: "~3,500 K" },
      { label: "Mass",          value: "~16–19 M☉" },
    ],
    facts: [
      "If placed at the Sun, its surface would extend past Jupiter's orbit",
      "Will explode as a supernova — possibly within the next 100,000 years",
      "The 'Great Dimming' of 2019–20 was caused by a massive dust ejection",
      "One of very few stars with a visually resolved disc from Earth",
      "Varies in brightness regularly — a semi-regular variable star",
      "Its supernova remnant will be visible from Earth for months",
    ]
  },

  Rigel: {
    subtitle: "Blue Supergiant · Orion (β Orionis)",
    blurb: "Rigel is a blue supergiant and the brightest star in Orion. Despite the β designation, it is usually brighter than Betelgeuse (α Orionis), ranking 7th brightest in the entire sky.",
    stats: [
      { label: "Distance",      value: "~860 ly" },
      { label: "Distance (km)", value: "~8.14 × 10¹⁵ km" },
      { label: "Luminosity",    value: "~1.20 × 10⁵ × Sun" },
      { label: "Spectral type", value: "B8 Ia" },
      { label: "Surface temp",  value: "~12,100 K" },
      { label: "Radius",        value: "~78 × Sun" },
    ],
    facts: [
      "~21× the Sun's mass — a true heavyweight star",
      "Surface temperature of 12,100 K gives it a brilliant blue-white colour",
      "A confirmed multiple-star system with at least 3 companions",
      "Will also eventually explode as a supernova",
      "7th brightest star in Earth's night sky",
      "Its name comes from Arabic — roughly meaning 'the foot of the great one'",
    ]
  },

  "Proxima Centauri": {
    subtitle: "Red Dwarf · Alpha Centauri System",
    blurb: "The closest known star to the Sun — a faint red dwarf in the Alpha Centauri triple system, 4.24 light-years away. It hosts at least one candidate planet in its habitable zone.",
    stats: [
      { label: "Distance",      value: "4.243 ly" },
      { label: "Distance (km)", value: "4.01 × 10¹³ km" },
      { label: "Radius",        value: "0.154 × Sun" },
      { label: "Spectral type", value: "M5.5Ve" },
      { label: "Surface temp",  value: "3,042 K" },
      { label: "Age",           value: "~4.85 Gyr" },
    ],
    facts: [
      "Closest star to the Solar System at 4.243 light-years",
      "Proxima b: a candidate Earth-sized planet in the habitable zone",
      "Emits powerful X-ray flares that could strip planetary atmospheres",
      "Takes ~550,000 years to orbit Alpha Centauri A and B",
      "Magnitude +11.13 — completely invisible to the naked eye",
      "A mission using laser-driven lightsails could reach it in ~20 years",
    ]
  },
};

// ═══════════════════════════════════════════════════════════════════
//  PLANET VISUAL CONFIG  –  orbital + rendering parameters
// ═══════════════════════════════════════════════════════════════════

export const PLANET_CONFIG = [
  {
    // Mercury: 0.39 AU  → scale: 12 units
    name: "Mercury",
    a: 12, e: 0.205, speed: 0.04,
    radius: 0.8,
    color: 0xb5b5b5, emissive: 0x222222, tilt: 0.034,
    moons: [],
  },
  {
    // Venus: 0.72 AU → scale: 20 units
    name: "Venus",
    a: 20, e: 0.0067, speed: 0.031,
    radius: 1.3,
    color: 0xf5deb3, emissive: 0x3a2800, tilt: 177.3,
    moons: [],
  },
  {
    // Earth: 1.00 AU → scale: 28 units
    name: "Earth",
    a: 28, e: 0.0167, speed: 0.025,
    radius: 1.4,
    color: 0x2266cc, emissive: 0x001133, tilt: 23.4,
    moons: [
      { name: "Luna", orbitR: 3.5, speed: 0.08, radius: 0.38, color: 0xaaaaaa },
    ],
  },
  {
    // Mars: 1.52 AU → scale: 38 units
    name: "Mars",
    a: 38, e: 0.0934, speed: 0.018,
    radius: 1.0,
    color: 0xcc4411, emissive: 0x330a00, tilt: 25.2,
    moons: [
      { name: "Phobos", orbitR: 2.2, speed: 0.22, radius: 0.15, color: 0x999988 },
      { name: "Deimos", orbitR: 3.2, speed: 0.13, radius: 0.10, color: 0x888877 },
    ],
  },
  {
    // Jupiter: 5.20 AU → scale: 72 units (asteroid belt 48–62)
    name: "Jupiter",
    a: 72, e: 0.0489, speed: 0.01,
    radius: 4.0,
    color: 0xc88b3a, emissive: 0x180d00, tilt: 3.1,
    hasGRS: true,
    moons: [
      { name: "Io",       orbitR: 7.0,  speed: 0.07,  radius: 0.40, color: 0xddcc44 },
      { name: "Europa",   orbitR: 9.0,  speed: 0.05,  radius: 0.34, color: 0xddccbb },
      { name: "Ganymede", orbitR: 11.5, speed: 0.032, radius: 0.52, color: 0x998877 },
      { name: "Callisto", orbitR: 14.5, speed: 0.022, radius: 0.48, color: 0x665544 },
    ],
  },
  {
    // Saturn: 9.58 AU → scale: 115 units
    name: "Saturn",
    a: 115, e: 0.0565, speed: 0.007,
    radius: 3.5,
    color: 0xe8d5a3, emissive: 0x1a1200, tilt: 26.7,
    hasRings: true, ringInner: 5.0, ringOuter: 9.5,
    moons: [
      { name: "Titan",     orbitR: 12.0, speed: 0.018, radius: 0.55, color: 0xd4a030 },
      { name: "Enceladus", orbitR: 7.5,  speed: 0.032, radius: 0.20, color: 0xeeeeff },
      { name: "Rhea",      orbitR: 9.5,  speed: 0.024, radius: 0.28, color: 0xccbbaa },
    ],
  },
  {
    // Uranus: 19.2 AU → scale: 175 units
    name: "Uranus",
    a: 175, e: 0.046, speed: 0.005,
    radius: 2.5,
    color: 0x7de8e8, emissive: 0x003333, tilt: 97.8,
    hasRings: true, ringInner: 3.4, ringOuter: 4.5, ringColor: 0x446666,
    moons: [
      { name: "Titania", orbitR: 6.0, speed: 0.025, radius: 0.25, color: 0xbbaaaa },
      { name: "Oberon",  orbitR: 7.5, speed: 0.018, radius: 0.23, color: 0xaaaaaa },
    ],
  },
  {
    // Neptune: 30.1 AU → scale: 235 units
    name: "Neptune",
    a: 235, e: 0.009, speed: 0.004,
    radius: 2.4,
    color: 0x3355cc, emissive: 0x000520, tilt: 28.3,
    moons: [
      { name: "Triton", orbitR: 5.5, speed: -0.03, radius: 0.35, color: 0xbbccdd },
    ],
  },
];

export const REAL_STARS_CONFIG = [
  { name: "Sirius",           pos: [110, 55, -220], radius: 3.5, color: 0xaaddff },
  { name: "Betelgeuse",       pos: [-210, 85, -310], radius: 5.0, color: 0xff6633 },
  { name: "Rigel",            pos: [310, -45, -410], radius: 4.0, color: 0xaaccff },
  { name: "Proxima Centauri", pos: [55, 22, 160],   radius: 1.8, color: 0xff4444 },
];

// Dwarf planets
export const DWARF_CONFIG = [
  {
    // Pluto: 39.5 AU → scale: 265 units
    name: "Pluto",
    a: 265, e: 0.248, speed: 0.0025,
    radius: 0.6,
    color: 0xbbaa99, emissive: 0x111100, tilt: 122.5,
    moons: [
      { name: "Charon", orbitR: 2.2, speed: 0.04, radius: 0.30, color: 0x998877 },
    ],
  },
  {
    // Ceres: 2.77 AU → scale: 55 units (in asteroid belt between Mars 38 and Jupiter 72)
    name: "Ceres",
    a: 55, e: 0.079, speed: 0.013,
    radius: 0.45,
    color: 0x998877, emissive: 0x0a0800, tilt: 4.0,
    moons: [],
  },
];
