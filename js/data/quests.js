// Gamified Quests & Student Trivia Challenges for SanskritiVerse

export const quests = [
  {
    id: "quest-chola-empire",
    title: "Secrets of the Chola Dynasty",
    category: "Architecture & Maritime",
    difficulty: "Medium",
    xpReward: 350,
    badge: {
      name: "Chola Imperial Architect",
      icon: "crown",
      color: "from-amber-500 to-yellow-600",
      description: "Mastered the engineering marvels of the Great Living Chola Temples and ancient bronze metallurgy."
    },
    description: "Unravel how Rajaraja Chola built the 216-foot Brihadisvara granite vimana with zero mortar, mastered the lost-wax bronze casting technique, and commanded an oceanic navy across Southeast Asia.",
    questions: [
      {
        question: "How was the 80-ton single granite capstone (Kumbam) placed atop the 66-meter vimana of the Brihadisvara Temple in 1010 CE?",
        options: [
          "Using wooden scaffolding cranes imported from Persia",
          "Via a 6-kilometer gently inclined earthen ramp using elephants and rollers",
          "It was carved in-situ from a natural granite mountain peak",
          "Constructed using hollow clay bricks painted to look like granite"
        ],
        correct: 1,
        explanation: "Chola engineers constructed a massive 6-kilometer earthen ramp starting from the village of Sarapallam. War elephants and wooden log rollers hauled the 80-ton monolith gradually to the summit!"
      },
      {
        question: "Which ancient metallurgical casting technique was perfected by Chola artisans to create the world-famous bronze Nataraja sculptures?",
        options: [
          "Sand-cast iron molding",
          "Cire-perdue (Lost-Wax) solid bronze casting (Madhuchehishtavidhana)",
          "Hammered sheet metal repoussé",
          "Direct cold-chisel stone hammering"
        ],
        correct: 1,
        explanation: "Chola master sculptors used Cire-perdue (Lost-Wax casting). A detailed beeswax model was enclosed in fine alluvial clay, heated so the wax melted out, and filled with molten Panchaloha bronze."
      },
      {
        question: "What unique architectural innovation did the Brihadisvara Temple employ to survive 6 major regional earthquakes without cracking?",
        options: [
          "Deep steel reinforcement rods inside the columns",
          "Dry-stone granite interlocking puzzle joints without binding mortar",
          "Underground springs that absorb seismic vibrations",
          "Flexible bamboo timber frames embedded within the granite"
        ],
        correct: 1,
        explanation: "No binding mortar or cement was used! The entire colossal structure relies on weight-balanced, interlocking mortise-and-tenon granite stones that safely dissipate seismic energy."
      },
      {
        question: "Under Emperor Rajendra Chola I, the Chola navy sailed across the Bay of Bengal to conquer which historic maritime empire?",
        options: [
          "The Srivijaya Empire (modern Indonesia, Malaysia, Singapore)",
          "The Byzantine Empire",
          "The Ottoman Fleet",
          "The Roman Mediterranean ports"
        ],
        correct: 0,
        explanation: "In 1025 CE, Rajendra Chola's formidable ocean-going navy launched a victorious maritime campaign across the Bay of Bengal, liberating the Straits of Malacca and securing the Srivijaya trade routes."
      }
    ]
  },
  {
    id: "quest-western-wonders",
    title: "Wonders of Western India: Caves & Stepwells",
    category: "Subterranean & Rock-Cut Art",
    difficulty: "Hard",
    xpReward: 450,
    badge: {
      name: "Subterranean Explorer",
      icon: "compass",
      color: "from-blue-600 to-indigo-700",
      description: "Unlocked the secrets of subterranean stepwells and top-down monolithic mountain excavation."
    },
    description: "Investigate how the volcanic basalt cliffs of the Western Ghats were sculpted into the caves of Ajanta and Ellora, and delve into Gujarat's underground water temples.",
    questions: [
      {
        question: "How was the world-famous Kailasa Temple (Cave 16) at Ellora carved out of the basalt mountain?",
        options: [
          "Assembled block-by-block using granite stones brought from Karnataka",
          "Excavated strictly from the top of the mountain downwards from a single rock cliff",
          "Hollowed out from the bottom cave chambers upwards with wooden wedges",
          "Formed naturally by ancient lava tubes and later decorated by monks"
        ],
        correct: 1,
        explanation: "It is the world's greatest top-down monolithic excavation! Over 200,000 tons of solid basalt rock were carved away starting from the mountain summit downward—meaning the sculptors could make zero structural mistakes."
      },
      {
        question: "Why was the inverted temple of Rani ki Vav in Patan, Gujarat, preserved in such immaculate detail for over 700 years?",
        options: [
          "It was sealed inside an airtight granite sarcophagus",
          "It was buried completely under deep silt and sand deposited by the flooded Saraswati River",
          "It was guarded by a secret monastic order that hid the entrance",
          "It was coated in waterproof beeswax and pine resin"
        ],
        correct: 1,
        explanation: "Around 1300 CE, devastating floods of the Saraswati River buried the 7-tier subterranean stepwell under meters of soft silt, preserving 800+ pristine carvings from weather and warfare until 1980s excavation!"
      },
      {
        question: "What natural mineral was imported all the way from the Badakhshan mines of Afghanistan to paint the vibrant blue robes in the Ajanta Cave frescoes?",
        options: [
          "Cobalt glass",
          "Lapis Lazuli (Ultramarine)",
          "Crushed Turquoise",
          "Indigo plant dye"
        ],
        correct: 1,
        explanation: "Ajanta artists used pure pulverized Lapis Lazuli imported along the ancient Silk Road from Afghanistan, giving the Padmapani Bodhisattva's celestial attire an unfading royal blue luster after 1,500 years."
      },
      {
        question: "What primary ecological and social purpose did stepwells (Vavs) serve in the arid landscapes of medieval Gujarat and Rajasthan?",
        options: [
          "Only as royal secret escape tunnels during wars",
          "As sacred cooling communal community hubs, social gathering spots, and sustainable rainwater reservoirs",
          "Exclusively as private royal swimming baths for queens",
          "To store military gunpowder dry underground"
        ],
        correct: 1,
        explanation: "Stepwells were engineering marvels of sustainable water harvesting: collecting monsoon runoff, recharging aquifers, providing cool subterranean respite (often 5°C cooler), and serving as women's community gathering sanctums."
      }
    ]
  },
  {
    id: "quest-astronomical-temples",
    title: "Sacred Geometry & Astronomical Marvels",
    category: "Astronomy & Acoustics",
    difficulty: "Master",
    xpReward: 500,
    badge: {
      name: "Virasat Grand Guardian",
      icon: "sparkles",
      color: "from-emerald-500 to-teal-700",
      description: "Mastered ancient Indian astronomical alignments, solar timekeeping, and architectural acoustic resonance."
    },
    description: "Explore the astronomical calculations etched into the 24 sundial wheels of Konark, the 56 musical acoustic pillars of Hampi, and the cosmic mandala orientation of ancient temples.",
    questions: [
      {
        question: "How do the 24 stone wheels of the Konark Sun Temple function as an accurate solar clock?",
        options: [
          "Water drips through a hole in the central axle marking minutes",
          "The shadow cast by the wheel's central hub onto the 8 major spokes tells the exact prahar (time of day)",
          "The wheels rotate with the wind to point towards magnetic north",
          "Crystals in the spokes glow when hit by ultraviolet sunlight"
        ],
        correct: 1,
        explanation: "Each wheel acts as a sundial! The 8 major spokes divide the 24-hour day into 3-hour intervals (Prahars), while the 8 minor spokes break it down into 90-minute segments, allowing time calculation accurate to 3 minutes using the axle's shadow."
      },
      {
        question: "What acoustical wonder is engineered into the 56 monolithic pillars of the Vittala Temple in Hampi?",
        options: [
          "They echo spoken voices 7 times in a row",
          "When tapped gently with fingers, they produce the distinct resonant notes of Indian musical instruments (Sa-Re-Ga-Ma)",
          "They amplify flute sounds using internal hollow bamboo chambers",
          "They create infrasound frequencies that calm temple elephants"
        ],
        correct: 1,
        explanation: "The 56 pillars are carved from solid resonant granite with varying mineral compositions and densities. Each pillar emits pure acoustic musical notes matching mridangam, bells, and strings when lightly tapped!"
      },
      {
        question: "What does the circular hemispherical dome (Anda) of the Great Stupa at Sanchi symbolize in early Buddhist philosophy?",
        options: [
          "The wheel of an imperial war chariot",
          "The cosmic egg of the universe and the vault of heaven enclosing sacred relics",
          "The rising morning sun over Mount Meru",
          "The royal parasol of the Mauryan Emperor"
        ],
        correct: 1,
        explanation: "The massive hemispherical dome represents the Anda (Cosmic Egg) and the eternal vault of heaven, centered around the axial pillar (Yasti) linking the mortal earth to transcendent Nirvana."
      },
      {
        question: "Why has the 1,600-year-old Iron Pillar of Delhi at the Qutub Complex never corroded despite centuries of tropical rain and heat?",
        options: [
          "It was coated in petroleum grease by Mughal artisans",
          "Ancient metallurgists used high phosphorus iron forming a protective crystalline passive layer of 'misawite'",
          "It is made of pure space meteorite nickel-titanium alloy",
          "It is covered in an invisible microscopic coat of clear glass glaze"
        ],
        correct: 1,
        explanation: "Gupta-era metallurgists utilized high phosphorus wrought iron without lime slag. When exposed to weather, this catalytically created an ultra-thin, protective passive film of iron hydrogen phosphate (Misawite) that shields the metal from rust!"
      }
    ]
  }
];
