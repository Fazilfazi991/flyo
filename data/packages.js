const phone = "04 396 4626";
const whatsapp = "#";
const email = "info.dubai@flyotour.com";

const commonInclusions = [
  "Hotel accommodation as selected",
  "Daily breakfast",
  "Airport transfers",
  "Tours and experiences mentioned in the itinerary",
  "Flyo travel coordination and support"
];

const commonExclusions = [
  "International flights unless mentioned",
  "Visa fees unless mentioned",
  "Personal expenses and optional activities",
  "Travel insurance",
  "Meals not mentioned in the itinerary"
];

const commonNotes = [
  "Rates are starting prices per person and may change with travel dates and availability.",
  "Rooms and tours are subject to confirmation at the time of booking.",
  "Final itinerary can be customized for families, couples, groups, or honeymoon travelers."
];

const commonCruiseInclusions = [
  "All meals onboard including snacks",
  "Water, tea, and coffee during meals",
  "Onboard entertainment activities",
  "Games, competitions, tournaments, parties, dance lessons, and themed evenings",
  "Musical shows in the onboard theatre",
  "Entertainment for kids and teenagers",
  "Use of ship facilities including swimming pools, sunbeds, beach towels, gym, jogging area, library, and leisure areas",
  "Fitness and gym access"
];

const commonCruiseExclusions = [
  "Airfare",
  "Entry visa to any ports of call",
  "Pre or post-cruise accommodation",
  "Land transportation",
  "Shore excursions",
  "Room service except for villas",
  "Spa amenities",
  "Beverages outside included meal service",
  "Specialty dining",
  "Internet",
  "Beauty salon",
  "Duty-free shops and boutiques",
  "Laundry except for suites and villas",
  "Alcoholic beverages are not available onboard",
  "Casino facilities are not offered"
];

const commonCruiseImportantInfo = [
  "Prices are starting prices and subject to change at confirmation.",
  "Adult rates apply for the first and second guest regardless of age.",
  "Additional cabin fare, port charges, and gratuities may apply for extra adults.",
  "Single occupancy may be charged at 200% of cabin fare plus port taxes and gratuities.",
  "Itinerary timings may vary depending on cruise schedules.",
  "Passports should be valid for at least 6 months.",
  "Guests should check visa requirements before booking.",
  "Pregnant guests should check cruise pregnancy policies before travel."
];

const cruiseVisaNote = "Visa requirements depend on nationality, residency status, and cruise route. Please contact our team before booking so we can guide you with the correct visa information.";

const cruisePackages = [
  {
    slug: "aroya-dubai-arabian-escape",
    title: "Aroya Dubai Arabian Escape",
    duration: "7 Nights / 8 Days",
    price: "AED 2590",
    availability: "Feb 2027 - 06",
    route: "Dubai, At Sea, Muscat, Khasab, Abu Dhabi, Sir Bani Yas",
    heroImage: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=2400&q=90",
    cardImage: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=86",
    overview: "A 7-night Arabian Gulf cruise round-trip from Dubai with a mix of relaxation, culture, scenic coastlines, and city experiences.",
    itinerary: [
      { day: "Day 1", title: "Dubai", text: "Board the cruise in Dubai, explore onboard facilities, enjoy dining and entertainment, and set sail late evening." },
      { day: "Day 2", title: "At Sea", text: "Relax onboard with pool time, spa options, activities, dining, and ocean views." },
      { day: "Day 3", title: "Muscat", text: "Explore Muscat's traditional charm, coastal scenery, cultural landmarks, markets, and Omani hospitality." },
      { day: "Day 4", title: "Khasab", text: "Visit Khasab, known for dramatic mountain landscapes, fjord-like views, and natural beauty." },
      { day: "Day 5", title: "Abu Dhabi", text: "Arrive in Abu Dhabi and explore architecture, cultural attractions, shopping, and modern landmarks." },
      { day: "Day 6", title: "Abu Dhabi", text: "Continue enjoying Abu Dhabi with extra time for sightseeing and relaxation before departure." },
      { day: "Day 7", title: "Sir Bani Yas", text: "Experience Sir Bani Yas Island, known for wildlife, beaches, and natural landscapes." },
      { day: "Day 8", title: "Dubai", text: "Return to Dubai in the morning." }
    ],
    timings: ["Day 1: Dubai | Depart 11:59 PM", "Day 2: At Sea", "Day 3: Muscat | 07:00 AM to 07:00 PM", "Day 4: Khasab", "Day 5: Abu Dhabi | Arrive 08:00 AM", "Day 6: Abu Dhabi | Depart 02:00 AM", "Day 7: Sir Bani Yas | 08:00 AM to 06:00 PM", "Day 8: Dubai | Arrive 08:00 AM"]
  },
  {
    slug: "aroya-dubai-arabian-signature-voyage",
    title: "Aroya Dubai Arabian Signature Voyage",
    duration: "7 Nights / 8 Days",
    price: "AED 2590",
    availability: "Feb 2027 - 27",
    route: "Dubai, Khasab, Abu Dhabi, Sir Bani Yas, Doha, Bahrain",
    heroImage: "/public/generated/arabian-gulf-cruise-card.png",
    cardImage: "/public/generated/arabian-gulf-cruise-card.png",
    overview: "A 7-night Arabian Gulf cruise round-trip from Dubai combining culture, modern cities, natural beauty, and relaxation.",
    itinerary: [
      { day: "Day 1", title: "Dubai", text: "Board the ship in Dubai, settle into the cabin, enjoy onboard facilities, and depart late night." },
      { day: "Day 2", title: "Khasab", text: "Discover fjord-like landscapes, rugged mountains, scenic coastal views, and cultural experiences." },
      { day: "Day 3", title: "Abu Dhabi", text: "Explore modern architecture, cultural attractions, shopping destinations, and waterfront areas." },
      { day: "Day 4", title: "Sir Bani Yas", text: "Visit Sir Bani Yas Island for beaches, nature, outdoor activities, and wildlife experiences." },
      { day: "Day 5", title: "Doha", text: "Explore Doha's blend of modern skyline, traditional culture, markets, attractions, and waterfront views." },
      { day: "Day 6", title: "Bahrain", text: "Experience Bahrain's Gulf heritage, historical sites, modern districts, and cultural atmosphere." },
      { day: "Day 7", title: "At Sea", text: "Enjoy onboard entertainment, dining, pools, leisure facilities, and relaxation." },
      { day: "Day 8", title: "Dubai", text: "Return to Dubai with memories of the Arabian Gulf journey." }
    ],
    timings: ["Day 1: Dubai | Depart 11:59 PM", "Day 2: Khasab | 09:00 AM to 08:00 PM", "Day 3: Abu Dhabi | 08:00 AM to 11:00 PM", "Day 4: Sir Bani Yas | 08:00 AM to 06:00 PM", "Day 5: Doha | 08:00 AM to 08:00 PM", "Day 6: Bahrain | 10:00 AM to 08:00 PM", "Day 7: At Sea", "Day 8: Dubai | Arrive 08:00 AM"]
  },
  {
    slug: "aroya-dubai-short-escape",
    title: "Aroya Dubai Short Escape",
    duration: "2 Nights / 3 Days",
    price: "AED 791",
    availability: "Feb 2027 - Apr 2027",
    route: "Dubai, Khasab, Abu Dhabi",
    heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=2400&q=90",
    cardImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=86",
    overview: "A short Arabian Gulf cruise from Dubai to Abu Dhabi aboard Aroya Cruises with scenic coastal views, onboard relaxation, and destination experiences.",
    itinerary: [
      { day: "Day 1", title: "Dubai", text: "Begin in Dubai, settle into the cruise, enjoy onboard facilities, dining, and entertainment, then sail late evening." },
      { day: "Day 2", title: "Khasab", text: "Visit Khasab, known for dramatic mountains, fjord-like views, traditional culture, and natural scenery." },
      { day: "Day 3", title: "Abu Dhabi", text: "Arrive in Abu Dhabi and explore architecture, cultural attractions, shopping, and modern landmarks." }
    ],
    timings: ["Day 1: Dubai | Depart 10:00 PM", "Day 2: Khasab | 09:00 AM to 08:00 PM", "Day 3: Abu Dhabi | Arrive 08:00 AM"]
  },
  {
    slug: "aroya-arabian-gulf-signature-voyage",
    title: "Aroya Arabian Gulf Signature Voyage",
    duration: "7 Nights / 8 Days",
    price: "AED 2474",
    availability: "Apr 2027 - 10",
    route: "Dubai, At Sea, Muscat, Salalah, Jeddah",
    heroImage: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=2400&q=90",
    cardImage: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=1200&q=86",
    overview: "A relaxing 7-night voyage aboard Aroya Cruises from Dubai to Jeddah, featuring scenic days at sea and stops in Muscat and Salalah.",
    itinerary: [
      { day: "Day 1", title: "Dubai", text: "Board Aroya Cruises in Dubai and begin the Arabian Gulf journey." },
      { day: "Day 2", title: "At Sea", text: "Relax onboard with entertainment, dining, and panoramic ocean views." },
      { day: "Day 3", title: "Muscat", text: "Discover Muscat's traditional Omani culture, scenic mountains, and waterfronts." },
      { day: "Day 4", title: "At Sea", text: "Enjoy a peaceful cruising day with time to unwind and explore ship amenities." },
      { day: "Day 5", title: "Salalah", text: "Experience Salalah's tropical charm, lush landscapes, and Arabian heritage." },
      { day: "Day 6", title: "At Sea", text: "Spend the day enjoying leisure activities, dining, and relaxation at sea." },
      { day: "Day 7", title: "At Sea", text: "Enjoy the final full day onboard with sunsets and cruise experiences." },
      { day: "Day 8", title: "Jeddah", text: "Arrive in Jeddah, the gateway to the Red Sea and Saudi culture." }
    ],
    timings: ["Day 1: Dubai | Depart 11:59 PM", "Day 2: At Sea", "Day 3: Muscat | 07:00 AM to 07:00 PM", "Day 4: At Sea", "Day 5: Salalah | 07:00 AM to 02:00 PM", "Day 6: At Sea", "Day 7: At Sea", "Day 8: Jeddah | Arrive 07:00 AM"]
  }
].map(item => ({
  ...item,
  country: "Arabian Gulf",
  category: "Cruise Package",
  tags: ["Cruise Package", "Aroya Cruises", "Arabian Gulf"],
  summary: item.overview,
  highlights: ["Aroya Cruises", "Arabian Gulf route", "Onboard dining", "Entertainment", "Port experiences"],
  pricingOptions: [{
    label: "Cruise Fare",
    badge: "Starting Price",
    hotels: ["Cabin options selected based on availability"],
    mealPlan: "Onboard meals included",
    transferType: "Cruise-only package",
    price: item.price,
    priceNote: "per person",
    features: ["Aroya cruise itinerary", "Onboard dining", "Entertainment activities", "Port schedule"],
    cta: "Enquire Now"
  }],
  inclusions: commonCruiseInclusions,
  exclusions: commonCruiseExclusions,
  notes: commonNotes,
  optionalTours: ["Shore excursions can be requested at an additional charge.", "Private transfers and pre or post-cruise hotel stays can be added on request."],
  visaDetails: cruiseVisaNote,
  importantInfo: commonCruiseImportantInfo,
  faqs: [
    { question: "Are shore excursions included?", answer: "Shore excursions are optional and can be quoted separately based on route, availability, and guest preference." },
    { question: "Does Flyo help with cruise visa guidance?", answer: "Yes. Flyo can guide you based on nationality, residency, cruise route, and current port requirements." }
  ],
  whatsappMessage: `Hi, I'm interested in ${item.title}. Please share more details.`
}));

const packageRecommendedMonths = {
  "kuala-lumpur-getaway": ["January", "February", "March", "June", "July", "August", "November", "December"],
  "thai-wonders": ["January", "February", "March", "November", "December"],
  "sri-lanka-highlights": ["January", "February", "March", "April", "July", "August", "December"],
  "singapore-family-escape": ["January", "February", "March", "June", "July", "August", "December"],
  "beaches-of-thailand": ["January", "February", "March", "November", "December"],
  "kenya-inspiring-safari": ["January", "February", "June", "July", "August", "September", "October"],
  "golden-triangle-special": ["January", "February", "March", "October", "November", "December"],
  "royal-rajasthan-heritage-tour": ["January", "February", "March", "October", "November", "December"],
  "kerala-economy-tour": ["January", "February", "March", "September", "October", "November", "December"],
  "dubai-desert-safari": ["January", "February", "March", "April", "October", "November", "December"],
  "aroya-dubai-arabian-escape": ["January", "February", "March", "April", "November", "December"],
  "aroya-dubai-arabian-signature-voyage": ["January", "February", "March", "April", "November", "December"],
  "aroya-dubai-short-escape": ["January", "February", "March", "April", "November", "December"],
  "aroya-arabian-gulf-signature-voyage": ["January", "February", "March", "April", "November", "December"]
};

const holidayPackages = [
  {
    slug: "kuala-lumpur-getaway",
    title: "Kuala Lumpur Getaway",
    country: "Malaysia",
    duration: "3 Nights / 4 Days",
    price: "AED 899",
    route: "Kuala Lumpur",
    category: "City Break",
    tags: ["Best Value", "City Break", "Family Friendly"],
    cardImage: "/packages/Kuala_Lumpur_WebP_Images/KL_Day.webp",
    heroImage: "/packages/Kuala_Lumpur_WebP_Images/KL_Night.webp",
    galleryImages: [
      { src: "/packages/Kuala_Lumpur_WebP_Images/KL_Night.webp", label: "Kuala Lumpur Night Skyline" },
      { src: "/packages/Kuala_Lumpur_WebP_Images/KL_Day.webp", label: "Kuala Lumpur City View" },
      { src: "/packages/Kuala_Lumpur_WebP_Images/KL_Sunset.webp", label: "Kuala Lumpur Sunset" }
    ],
    imageHighlights: ["Kuala Lumpur skyline", "City lights", "Sunset views"],
    summary: "A compact Malaysia escape with city icons, skyline views, hill-station fun, and easy family-friendly pacing.",
    overview: "Discover Kuala Lumpur with a well-balanced itinerary covering the city's modern skyline, cultural landmarks, Batu Caves, and the cool mountain air of Genting Highlands.",
    highlights: ["Kuala Lumpur City Tour", "KL Tower Observatory & Sky Deck", "Genting Highlands", "Batu Caves photo stop", "Daily breakfast"],
    itinerary: [
      { day: "Day 1", title: "Arrival in Kuala Lumpur", text: "Meet your driver at the airport and transfer to your hotel. Evening at leisure around Bukit Bintang or KLCC.", images: ["/packages/Kuala_Lumpur_WebP_Images/KL_Night.webp"] },
      { day: "Day 2", title: "City Tour and KL Tower", text: "Explore Kuala Lumpur's key landmarks, then visit KL Tower Observatory and Sky Deck for skyline views.", images: ["/packages/Kuala_Lumpur_WebP_Images/KL_Day.webp", "/packages/Kuala_Lumpur_WebP_Images/KL_Sunset.webp"] },
      { day: "Day 3", title: "Genting Highlands and Batu Caves", text: "Enjoy a full-day excursion to Genting Highlands with a Batu Caves photo stop en route.", images: ["/packages/Kuala_Lumpur_WebP_Images/KL_Sunset.webp"] },
      { day: "Day 4", title: "Departure", text: "Breakfast at the hotel, checkout, and private transfer to the airport." }
    ],
    hotels: [
      { title: "3 Star Package", price: "AED 899 per person", features: ["City hotel", "Breakfast", "Standard transfers"] },
      { title: "4 Star Package", price: "AED 1199 per person", features: ["Upgraded hotel", "Breakfast", "Private airport transfers"] }
    ],
    pricingOptions: [
      {
        label: "3 Star Package",
        badge: "Best Value",
        hotels: ["Cosmo Hotel or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "SIC Transfers",
        price: "AED 899",
        priceNote: "per person",
        features: ["City hotel", "Daily breakfast", "Selected tours", "Airport transfers"],
        cta: "Enquire Now"
      },
      {
        label: "4 Star Package",
        badge: "Popular Upgrade",
        hotels: ["Upgraded city hotel or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "SIC Transfers",
        price: "AED 979",
        priceNote: "per person",
        features: ["Upgraded stay", "Daily breakfast", "Selected tours", "Airport transfers"],
        cta: "Enquire Now"
      }
    ],
    inclusions: commonInclusions,
    exclusions: commonExclusions,
    notes: commonNotes,
    faqs: [
      { question: "Is this package suitable for families?", answer: "Yes. The itinerary is light, comfortable, and works well for families, couples, and first-time Malaysia travelers." },
      { question: "Can Genting Highlands be replaced?", answer: "Yes. Flyo can customize the day with shopping, theme parks, or more city sightseeing." }
    ]
  },
  {
    slug: "thai-wonders",
    title: "Thai Wonders",
    country: "Thailand",
    duration: "4 Nights / 5 Days",
    price: "AED 999",
    route: "Bangkok & Pattaya",
    category: "Budget Friendly",
    tags: ["Budget Friendly", "Island Tour", "Entertainment", "Honeymoon Packages"],
    cardImage: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp",
    heroImage: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Temple.webp",
    galleryImages: [
      { src: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Temple.webp", label: "Bangkok Temple Visit" },
      { src: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Beach.webp", label: "Thailand Beach Escape" },
      { src: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp", label: "Thailand Night Market" }
    ],
    imageHighlights: ["Bangkok nightlife", "Temple visits", "Beach escape"],
    summary: "A lively Thailand break combining Bangkok sightseeing, Pattaya entertainment, island time, and smooth transfers.",
    overview: "Ideal for travelers who want a budget-conscious Thailand holiday with beaches, shows, city touring, and private airport and hotel transfers included.",
    highlights: ["Coral Island tour with lunch", "Tiger Park Pattaya", "Alcazar Cabaret Show", "Bangkok city tour", "Private airport and hotel transfers"],
    itinerary: [
      { day: "Day 1", title: "Arrive in Bangkok and Transfer to Pattaya", text: "Airport welcome and private transfer to Pattaya. Check in and relax by the coast.", images: ["/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp"] },
      { day: "Day 2", title: "Coral Island and Alcazar Show", text: "Enjoy Coral Island with lunch, then return for an evening Alcazar Cabaret Show.", images: ["/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Beach.webp"] },
      { day: "Day 3", title: "Tiger Park and Bangkok Transfer", text: "Visit Tiger Park Pattaya before transferring to Bangkok for check-in.", images: ["/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Temple.webp"] },
      { day: "Day 4", title: "Bangkok City Tour", text: "See Bangkok's temples, local neighborhoods, shopping areas, and city highlights.", images: ["/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Temple.webp", "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp"] },
      { day: "Day 5", title: "Departure", text: "Breakfast, checkout, and transfer to the airport." }
    ],
    hotels: [
      { title: "3 Star Package", price: "AED 999 per person", features: ["Pattaya and Bangkok hotels", "Breakfast", "Private transfers"] },
      { title: "4 Star Package", price: "AED 1399 per person", features: ["Upgraded hotels", "Breakfast", "Selected tours"] }
    ],
    pricingOptions: [
      {
        label: "4 Star Package",
        badge: "Best Value",
        hotels: ["Bangkok and Pattaya hotels or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Private airport and hotel transfers",
        price: "AED 999",
        priceNote: "per person",
        features: ["Bangkok and Pattaya stays", "Daily breakfast", "Coral Island tour", "Selected sightseeing"],
        cta: "Enquire Now"
      }
    ],
    inclusions: commonInclusions,
    exclusions: commonExclusions,
    notes: commonNotes,
    faqs: [
      { question: "Are transfers private?", answer: "Airport and hotel transfers are planned privately unless a different arrangement is requested." },
      { question: "Can this be changed into a honeymoon trip?", answer: "Yes. Flyo can add romantic dinners, upgraded rooms, or beach extensions." }
    ]
  },
  {
    slug: "sri-lanka-highlights",
    title: "Sri Lanka Highlights",
    country: "Sri Lanka",
    duration: "3 Nights / 4 Days",
    price: "AED 1899",
    route: "Kandy, Nuwara Eliya, Colombo",
    category: "Culture",
    tags: ["Culture", "Nature", "Family Friendly"],
    cardImage: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_Sigiriya.webp",
    heroImage: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_TeaTrain.webp",
    galleryImages: [
      { src: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_TeaTrain.webp", label: "Sri Lanka Tea Country" },
      { src: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_Sigiriya.webp", label: "Sri Lanka Heritage Landmark" },
      { src: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_Lighthouse.webp", label: "Sri Lanka Coastal View" }
    ],
    imageHighlights: ["Tea country", "Cultural landmarks", "Coastal views"],
    summary: "A scenic Sri Lanka journey through culture, tea country, waterfalls, and Colombo's city life.",
    overview: "Travel through Sri Lanka's most loved highlights with comfortable routing from Kandy to Nuwara Eliya and Colombo, blending temples, culture, nature, and city sightseeing.",
    highlights: ["Pinnawala Elephant Orphanage", "Temple of Tooth Relic", "Kandy Cultural Show", "Ramboda Falls", "Colombo City Tour"],
    itinerary: [
      { day: "Day 1", title: "Arrival, Pinnawala and Kandy", text: "Arrive in Sri Lanka, visit Pinnawala Elephant Orphanage, and continue to Kandy.", images: ["/packages/Sri_Lanka_Highlights_WebP/SriLanka_Sigiriya.webp"] },
      { day: "Day 2", title: "Kandy and Nuwara Eliya", text: "Visit Temple of Tooth Relic, enjoy a cultural show, and travel through tea country toward Nuwara Eliya.", images: ["/packages/Sri_Lanka_Highlights_WebP/SriLanka_TeaTrain.webp"] },
      { day: "Day 3", title: "Ramboda Falls and Colombo", text: "Stop at Ramboda Falls and continue to Colombo for a city tour and overnight stay.", images: ["/packages/Sri_Lanka_Highlights_WebP/SriLanka_Lighthouse.webp"] },
      { day: "Day 4", title: "Departure", text: "Breakfast, checkout, and airport transfer." }
    ],
    hotels: [
      { title: "3 Star Package", price: "AED 1899 per person", features: ["Standard hotels", "Breakfast", "Sightseeing transfers"] },
      { title: "4 Star Package", price: "AED 2199 per person", features: ["Upgraded hotels", "Breakfast", "Private touring"] }
    ],
    pricingOptions: [
      {
        label: "3 Star Package",
        badge: "Best Value",
        hotels: ["Standard hotels or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Sightseeing transfers",
        price: "AED 1899",
        priceNote: "per person",
        features: ["Kandy stay", "Nuwara Eliya routing", "Colombo tour", "Airport transfers"],
        cta: "Enquire Now"
      },
      {
        label: "4 Star Package",
        badge: "Popular Upgrade",
        hotels: ["Upgraded hotels or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Private touring transfers",
        price: "AED 2199",
        priceNote: "per person",
        features: ["Upgraded stays", "Daily breakfast", "Private touring", "Airport transfers"],
        cta: "Enquire Now"
      }
    ],
    inclusions: commonInclusions,
    exclusions: commonExclusions,
    notes: commonNotes,
    faqs: [
      { question: "Is Sri Lanka good for kids?", answer: "Yes. The package includes nature, culture, and gentle sightseeing that works well for families." },
      { question: "Can beach nights be added?", answer: "Yes. Bentota, Mirissa, or other beach stays can be added as a custom extension." }
    ]
  },
  {
    slug: "singapore-family-escape",
    title: "Singapore Family Escape",
    country: "Singapore",
    duration: "4 Nights / 5 Days",
    price: "AED 2999",
    route: "Singapore",
    category: "Family Favourite",
    tags: ["Family Favourite", "Theme Parks", "City Holiday"],
    cardImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=85",
    heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=2400&q=90",
    summary: "A family-focused Singapore holiday packed with theme parks, Sentosa attractions, gardens, skyline views, and easy logistics.",
    overview: "Built for families who want Singapore's signature attractions without planning stress, this package combines Universal Studios, Sentosa, Gardens by the Bay, and more.",
    highlights: ["Universal Studios", "Sentosa Island", "Cable Car", "Singapore Oceanarium", "Luge & Skyride", "Wings of Time", "Gardens by the Bay"],
    itinerary: [
      { day: "Day 1", title: "Arrival in Singapore", text: "Airport transfer, hotel check-in, and evening at leisure." },
      { day: "Day 2", title: "Universal Studios", text: "Full day at Universal Studios with time for rides, shows, and family attractions." },
      { day: "Day 3", title: "Sentosa Island", text: "Enjoy Cable Car, Singapore Oceanarium, Luge & Skyride, and Wings of Time." },
      { day: "Day 4", title: "Gardens by the Bay", text: "Visit Gardens by the Bay and explore Singapore's city highlights." },
      { day: "Day 5", title: "Departure", text: "Breakfast, checkout, and airport transfer." }
    ],
    hotels: [
      { title: "3 Star Package", price: "AED 2999 per person", features: ["Family-friendly hotel", "Breakfast", "Attraction tickets"] },
      // TODO: Verify Singapore 4-star and 5-star rates with client; both currently show AED 3480.
      { title: "4 Star Package", price: "AED 3480 per person", features: ["Upgraded hotel", "Breakfast", "Attraction tickets"] },
      { title: "5 Star Package", price: "AED 3480 per person", features: ["Premium hotel", "Breakfast", "Attraction tickets"] }
    ],
    pricingOptions: [
      {
        label: "3 Star Package",
        badge: "Family Value",
        hotels: ["Family-friendly hotel or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Shared or private transfers",
        price: "AED 2999",
        priceNote: "per person",
        features: ["Family-friendly stay", "Daily breakfast", "Attraction tickets", "Airport transfers"],
        cta: "Enquire Now"
      },
      {
        label: "4 Star Package",
        badge: "Popular Upgrade",
        hotels: ["Upgraded hotel or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Shared or private transfers",
        price: "AED 3480",
        priceNote: "per person",
        features: ["Upgraded hotel", "Daily breakfast", "Attraction tickets", "Airport transfers"],
        cta: "Enquire Now"
      },
      // TODO: Verify Singapore 4-star and 5-star pricing with client because both are currently the same.
      {
        label: "5 Star Package",
        badge: "Premium Stay",
        hotels: ["Premium hotel or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Shared or private transfers",
        price: "AED 3480",
        priceNote: "per person",
        features: ["Premium stay", "Daily breakfast", "Attraction tickets", "Airport transfers"],
        cta: "Enquire Now"
      }
    ],
    inclusions: commonInclusions,
    exclusions: commonExclusions,
    notes: commonNotes,
    faqs: [
      { question: "Are attraction tickets included?", answer: "The listed attractions can be included in the package quote based on final availability and travel date." },
      { question: "Can the itinerary be slowed down?", answer: "Yes. Extra nights can be added for families who prefer a more relaxed pace." }
    ]
  },
  {
    slug: "beaches-of-thailand",
    title: "Beaches of Thailand",
    country: "Thailand",
    duration: "6 Nights / 7 Days",
    price: "AED 1875",
    route: "Krabi, Phi Phi Island, Phuket",
    category: "Beach Holiday",
    tags: ["Beach Holiday", "Island Hopping", "Honeymoon"],
    cardImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=90",
    summary: "An island-hopping Thailand escape across Krabi, Phi Phi, and Phuket with beaches, viewpoints, and easy transfers.",
    overview: "This beach holiday is designed for couples, honeymooners, and friends who want Thailand's turquoise waters, island tours, and relaxed coastal rhythm.",
    highlights: ["Krabi 4 Island Tour", "Phi Phi Island stay", "James Bond Island tour", "Phuket City Tour", "Big Buddha and Wat Chalong"],
    itinerary: [
      { day: "Day 1", title: "Arrive in Krabi", text: "Transfer to your Krabi hotel and relax by the beach." },
      { day: "Day 2", title: "Krabi 4 Island Tour", text: "Spend the day island hopping around Krabi's clear-water beaches." },
      { day: "Day 3", title: "Phi Phi Island", text: "Transfer to Phi Phi Island for check-in and leisure time." },
      { day: "Day 4", title: "Phi Phi Leisure", text: "Enjoy beaches, cafes, viewpoints, or optional snorkeling." },
      { day: "Day 5", title: "Phuket Transfer", text: "Travel to Phuket and settle into your hotel." },
      { day: "Day 6", title: "James Bond Island and Phuket City", text: "Visit James Bond Island and see Big Buddha, Wat Chalong, and Phuket highlights." },
      { day: "Day 7", title: "Departure", text: "Breakfast, checkout, and airport transfer." }
    ],
    hotels: [
      { title: "3 Star Package", price: "AED 1875 per person", features: ["Beach-area hotels", "Breakfast", "Island tours"] },
      { title: "4 Star Package", price: "AED 2499 per person", features: ["Upgraded resorts", "Breakfast", "Tour transfers"] }
    ],
    pricingOptions: [
      {
        label: "3 Star Package",
        badge: "Best Value",
        hotels: ["Beach-area hotels or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Tour transfers",
        price: "AED 1875",
        priceNote: "per person",
        features: ["Krabi stay", "Phi Phi stay", "Island tours", "Airport transfers"],
        cta: "Enquire Now"
      },
      {
        label: "4 Star Package",
        badge: "Popular Upgrade",
        hotels: ["Upgraded beach hotels or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Tour transfers",
        price: "AED 2705",
        priceNote: "per person",
        features: ["Upgraded resorts", "Daily breakfast", "Island tours", "Airport transfers"],
        cta: "Enquire Now"
      },
      {
        label: "5 Star Package",
        badge: "Premium Stay",
        hotels: ["Premium resorts or similar"],
        mealPlan: "Daily Breakfast",
        transferType: "Tour transfers",
        price: "AED 2799",
        priceNote: "per person",
        features: ["Premium resorts", "Daily breakfast", "Island tours", "Airport transfers"],
        cta: "Enquire Now"
      }
    ],
    inclusions: commonInclusions,
    exclusions: commonExclusions,
    notes: commonNotes,
    faqs: [
      { question: "Is this package suitable for honeymooners?", answer: "Yes. Flyo can add room decoration, private transfers, candlelight dinners, and resort upgrades." },
      { question: "Are island tours weather dependent?", answer: "Yes. Island tour timing can change based on marine and weather conditions." }
    ]
  },
  {
    slug: "kenya-inspiring-safari",
    title: "Kenya Inspiring Safari",
    country: "Kenya",
    duration: "3 Nights / 4 Days",
    price: "AED 9385",
    route: "Lake Nakuru, Masai Mara",
    category: "Safari",
    tags: ["Safari", "Wildlife", "Premium"],
    cardImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=85",
    heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=90",
    summary: "A premium Kenya safari with private vehicle, full-board lodge stays, Lake Nakuru, and Masai Mara game drives.",
    overview: "Experience Kenya's wildlife landscapes with a private safari vehicle, English-speaking driver guide, full-board lodges, and game drives through Lake Nakuru and Masai Mara.",
    highlights: ["Private safari vehicle", "Lake Nakuru National Park", "Masai Mara game drives", "Full-board lodge accommodation", "English-speaking driver guide"],
    itinerary: [
      { day: "Day 1", title: "Nairobi to Lake Nakuru", text: "Meet your driver guide and travel to Lake Nakuru National Park for your first safari experience." },
      { day: "Day 2", title: "Lake Nakuru to Masai Mara", text: "Drive to Masai Mara, check in to your lodge, and enjoy an afternoon game drive if timing allows." },
      { day: "Day 3", title: "Masai Mara Game Drives", text: "Spend the day exploring Masai Mara with game drives and full-board lodge meals." },
      { day: "Day 4", title: "Return to Nairobi", text: "Breakfast at the lodge and drive back to Nairobi for onward travel." }
    ],
    hotels: [
      { title: "Premium Safari Lodge", price: "AED 9385 per person", features: ["Full-board stay", "Private vehicle", "English-speaking guide"] }
    ],
    pricingOptions: [
      {
        label: "Premium Safari Package",
        badge: "Seasonal Rates Apply",
        hotels: ["Premium safari lodges or similar"],
        mealPlan: "Full Board",
        transferType: "Private safari vehicle",
        price: "AED 9385",
        priceNote: "per person",
        features: ["Full-board lodge stay", "Private safari vehicle", "Game drives", "English-speaking driver guide"],
        cta: "Enquire Now",
        seasonalNote: "Valid July to October, based on 2 adults and subject to availability."
      }
    ],
    inclusions: ["Full-board lodge accommodation", "Private safari vehicle", "English-speaking driver guide", "Park visits mentioned in itinerary", "Flyo travel coordination"],
    exclusions: commonExclusions,
    notes: commonNotes,
    faqs: [
      { question: "Is the safari private?", answer: "The package includes a private safari vehicle for a more comfortable wildlife experience." },
      { question: "What meals are included?", answer: "Safari lodge accommodation is planned on full-board basis unless otherwise stated in the final quote." }
    ]
  },
  {
    slug: "golden-triangle-special",
    title: "Golden Triangle Special",
    country: "India",
    duration: "5 Nights / 6 Days",
    price: "AED 999",
    route: "Delhi, Agra & Jaipur",
    category: "Cultural Tour",
    tags: ["India Packages", "Family Holidays", "Cultural Tour"],
    cardImage: "/packages/golden_triangle_package_images_webp/golden-triangle-taj-mahal-agra.webp",
    heroImage: "/packages/golden_triangle_package_images_webp/golden-triangle-delhi-india-gate.webp",
    galleryImages: [
      { src: "/packages/golden_triangle_package_images_webp/golden-triangle-delhi-india-gate.webp", label: "Delhi City and India Gate" },
      { src: "/packages/golden_triangle_package_images_webp/golden-triangle-red-fort-delhi.webp", label: "Red Fort Delhi" },
      { src: "/packages/golden_triangle_package_images_webp/golden-triangle-chandni-chowk-market.webp", label: "Chandni Chowk Market" },
      { src: "/packages/golden_triangle_package_images_webp/golden-triangle-taj-mahal-agra.webp", label: "Taj Mahal Agra" },
      { src: "/packages/golden_triangle_package_images_webp/golden-triangle-fatehpur-sikri.webp", label: "Fatehpur Sikri" },
      { src: "/packages/golden_triangle_package_images_webp/golden-triangle-jaipur-amer-fort.webp", label: "Jaipur Amer Fort" }
    ],
    imageHighlights: ["Delhi heritage", "Taj Mahal", "Jaipur forts"],
    summary: "Explore India's iconic Golden Triangle covering Delhi, Agra, and Jaipur in a 5-night cultural journey with historic monuments, colorful markets, Mughal architecture, and the world-famous Taj Mahal.",
    overview: "This Golden Triangle holiday connects India's most loved first-time route: Delhi's historic city sights, Agra's Mughal landmarks, and Jaipur's royal forts and markets. It is designed for families and culture-focused travelers who want a comfortable, guided India experience with breakfast and planned transfers included.",
    highlights: [
      "Delhi city sightseeing",
      "Chandni Chowk local market visit",
      "Red Fort and Jama Masjid",
      "India Gate, Rashtrapati Bhawan, Parliament House",
      "Qutub Minar and Humayun's Tomb",
      "Agra Fort visit",
      "Taj Mahal visit",
      "Fatehpur Sikri en route to Jaipur",
      "Jaipur local markets",
      "Amer Fort visit",
      "Hawa Mahal photo stop",
      "City Palace and Jantar Mantar",
      "Daily breakfast included",
      "Airport transfers included as per itinerary"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Delhi",
        text: "Arrive at Delhi Airport or Station and meet the representative. Transfer to the hotel and check in. In the evening, visit Chandni Chowk and explore the local markets. Overnight stay in Delhi.",
        images: [
          "/packages/golden_triangle_package_images_webp/golden-triangle-delhi-india-gate.webp",
          "/packages/golden_triangle_package_images_webp/golden-triangle-chandni-chowk-market.webp"
        ]
      },
      {
        day: "Day 2",
        title: "Delhi Sightseeing",
        text: "After breakfast, proceed for Delhi sightseeing. Visit Old Delhi, Red Fort, Jama Masjid, Raj Ghat, India Gate, Rashtrapati Bhawan, Parliament House, Qutub Minar, and Humayun's Tomb. In the evening, explore local markets. Overnight stay in Delhi.",
        images: [
          "/packages/golden_triangle_package_images_webp/golden-triangle-red-fort-delhi.webp",
          "/packages/golden_triangle_package_images_webp/golden-triangle-delhi-india-gate.webp"
        ]
      },
      {
        day: "Day 3",
        title: "Delhi to Agra",
        text: "After breakfast, proceed to Agra by road. Visit Agra Fort and the iconic Taj Mahal. In the evening, explore the local bazaars of Agra known for marble craftsmanship and handicrafts. Overnight stay in Agra. Note: Taj Mahal remains closed on Fridays.",
        images: [
          "/packages/golden_triangle_package_images_webp/golden-triangle-taj-mahal-agra.webp",
          "/packages/golden_triangle_package_images_webp/golden-triangle-fatehpur-sikri.webp"
        ]
      },
      {
        day: "Day 4",
        title: "Agra to Jaipur via Fatehpur Sikri",
        text: "After breakfast, proceed to Jaipur. En route, visit Fatehpur Sikri, the historic Mughal royal city. Later, continue to Jaipur and explore colorful evening markets and handicraft shops. Overnight stay in Jaipur.",
        images: [
          "/packages/golden_triangle_package_images_webp/golden-triangle-fatehpur-sikri.webp",
          "/packages/golden_triangle_package_images_webp/golden-triangle-jaipur-amer-fort.webp"
        ]
      },
      {
        day: "Day 5",
        title: "Jaipur Sightseeing",
        text: "After breakfast, visit Amer Fort and enjoy Elephant Ride or Jeep Ride on own cost. En route, stop at Hawa Mahal. Later visit City Palace and Jantar Mantar. Evening is free for shopping and leisure. Overnight stay in Jaipur.",
        images: [
          "/packages/golden_triangle_package_images_webp/golden-triangle-jaipur-amer-fort.webp"
        ]
      },
      {
        day: "Day 6",
        title: "Departure from Jaipur",
        text: "After breakfast, check out and transfer to Jaipur Airport or Station for onward journey.",
        images: [
          "/packages/golden_triangle_package_images_webp/golden-triangle-jaipur-amer-fort.webp"
        ]
      }
    ],
    hotels: [
      { title: "3 Star Standard Package", price: "AED 999 per person", features: ["Hotel Amr 3* Standard or similar", "Daily breakfast", "AC vehicle transfers"] },
      { title: "3 Star Deluxe Package", price: "AED 1350 per person", features: ["Hotel Nirman Vihar 3* Deluxe or similar", "Daily breakfast", "AC vehicle transfers"] },
      { title: "4 Star Package", price: "AED 1695 per person", features: ["Hotel Vesta International 4* or similar", "Daily breakfast", "AC vehicle transfers"] }
    ],
    pricingOptions: [
      {
        label: "3 Star Standard Package",
        badge: "Best Value",
        hotels: ["Hotel Amr 3* Standard or similar"],
        mealPlan: "Daily Breakfast except Day 1",
        transferType: "AC vehicle as per itinerary",
        price: "AED 999",
        priceNote: "per person",
        features: ["Delhi, Agra and Jaipur stays", "Daily breakfast", "Planned sightseeing transfers", "Airport or station transfer"],
        cta: "Enquire Now"
      },
      {
        label: "3 Star Deluxe Package",
        badge: "Popular Upgrade",
        hotels: ["Hotel Nirman Vihar 3* Deluxe or similar"],
        mealPlan: "Daily Breakfast except Day 1",
        transferType: "AC vehicle as per itinerary",
        price: "AED 1350",
        priceNote: "per person",
        features: ["Deluxe category hotel", "Daily breakfast", "Golden Triangle sightseeing", "AC vehicle transfers"],
        cta: "Enquire Now"
      },
      {
        label: "4 Star Package",
        badge: "Premium Stay",
        hotels: ["Hotel Vesta International 4* or similar"],
        mealPlan: "Daily Breakfast except Day 1",
        transferType: "AC vehicle as per itinerary",
        price: "AED 1695",
        priceNote: "per person",
        features: ["4 star category stay", "Daily breakfast", "Cultural city sightseeing", "Airport or station transfer"],
        cta: "Enquire Now"
      }
    ],
    inclusions: [
      "Accommodation in listed hotels or similar category hotels",
      "Airport transfers in AC vehicle as per itinerary",
      "Sightseeing transfers in AC vehicle as per itinerary",
      "Vehicle based on group size: Sedan, SUV, Tempo Traveller or similar",
      "Daily breakfast at hotel restaurants except Day 1",
      "Hotel and transportation taxes included, except GST"
    ],
    exclusions: [
      "5% GST over and above tour cost",
      "Flights, trains, buses, or cruise fares unless specified",
      "Entrance fees for sightseeing places",
      "Travel insurance",
      "Personal expenses",
      "Tips, porterage, laundry, phone charges, shopping, camera fees",
      "Elephant ride, jeep ride, boat ride, pony ride, safari, or similar activities",
      "Any extra sightseeing or services not mentioned in inclusions",
      "High season surcharge, festive surcharge, gala dinner charges if applicable",
      "Any cost due to unforeseen circumstances, travel changes, illness, or personal emergency"
    ],
    notes: [
      "Taj Mahal remains closed on Fridays.",
      "Final vehicle type depends on group size and confirmed routing.",
      "High season, festive dates, gala dinners, and availability changes may affect the final quote."
    ],
    optionalTours: [
      "Elephant ride, Jeep ride, boat ride, and similar activities can be added on request at additional cost.",
      "Extra sightseeing, shopping stops, or upgraded experiences can be customized before confirmation."
    ],
    visaDetails: "India visa requirements depend on nationality and residency status. Flyo can guide document requirements before booking.",
    importantInfo: [
      "5% GST is applicable over and above the tour cost.",
      "Entrance fees for sightseeing places are not included unless mentioned in the final quote.",
      "Taj Mahal remains closed on Fridays.",
      "Vehicle and transfer arrangements are based on group size and final itinerary confirmation."
    ],
    faqs: [
      { question: "Is Golden Triangle Special suitable for families?", answer: "Yes. The route is a classic family-friendly India holiday with cultural sightseeing, markets, monuments, and comfortable city-to-city transfers." },
      { question: "Can hotels be upgraded?", answer: "Yes. Flyo can customize hotels, room categories, vehicle type, and sightseeing pace around your dates and budget." },
      { question: "Are monument entrance fees included?", answer: "Entrance fees are excluded unless they are specifically added to the final confirmed quote." }
    ],
    whatsappMessage: "Hi, I'm interested in Golden Triangle Special. Please share more details."
  },
  {
    slug: "royal-rajasthan-heritage-tour",
    title: "Royal Rajasthan Heritage Tour",
    country: "India",
    destinationState: "Rajasthan",
    duration: "8 Nights / 9 Days",
    price: "AED 1845",
    route: "Jaipur, Bikaner, Jaisalmer & Jodhpur",
    category: "Heritage Tour",
    tags: ["India Packages", "Heritage Tour", "Family Holidays", "Cultural Tour"],
    cardImage: "/packages/rajasthan_package_images_webp/rajasthan-jaipur-amber-fort.webp",
    heroImage: "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-mehrangarh-fort.webp",
    galleryImages: [
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jaipur-amber-fort.webp", label: "Jaipur Amber Fort" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jaipur-hawa-mahal.webp", label: "Jaipur Hawa Mahal" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jaipur-city-palace.webp", label: "Jaipur City Palace" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-bikaner-junagarh-fort.webp", label: "Bikaner Junagarh Fort" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jaisalmer-desert-camp-camel-safari.webp", label: "Jaisalmer Desert Camp and Camel Safari" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jaisalmer-golden-fort.webp", label: "Jaisalmer Golden Fort" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-mehrangarh-fort.webp", label: "Jodhpur Mehrangarh Fort" },
      { src: "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-blue-city.webp", label: "Jodhpur Blue City" }
    ],
    imageHighlights: ["Jaipur palaces", "Jaisalmer desert camp", "Jodhpur heritage"],
    summary: "Experience the royal charm of Rajasthan with Jaipur's palaces, Bikaner's forts, Jaisalmer's golden desert, and Jodhpur's majestic heritage.",
    overview: "This 8-night Rajasthan journey blends royal palaces, desert heritage, historic forts, market time, a Jaisalmer camp stay, camel safari, and cultural highlights across Jaipur, Bikaner, Jaisalmer, and Jodhpur.",
    highlights: [
      "Jaipur city tour",
      "City Palace and Palace Museum",
      "Jantar Mantar visit",
      "Hawa Mahal drive past or photo stop",
      "Amber Fort visit",
      "Elephant ride or Jeep ride at Amber Fort on own cost",
      "Birla Temple visit",
      "Bikaner sightseeing",
      "Junagarh Fort visit",
      "Camel Breeding Farm",
      "Deshnok Karni Mata Temple",
      "Jaisalmer desert camp stay",
      "Camel ride or camel safari during camp stay",
      "Jaisalmer Golden Fort",
      "Gadhisar Lake",
      "Patwon Ki Haveli",
      "Nathmal Ji Ki Haveli",
      "Local market shopping",
      "Jodhpur Blue City visit",
      "Desert Cultural Centre en route",
      "Umaid Bhawan Palace & Museum",
      "Mehrangarh Fort",
      "Jaswant Thada"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Jaipur",
        text: "Arrive in Jaipur and transfer to the hotel. Later proceed for a city tour of Jaipur. Visit City Palace, Palace Museum, Jantar Mantar, and drive past Hawa Mahal, also known as the Palace of Winds. Overnight stay at the hotel in Jaipur.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jaipur-city-palace.webp",
          "/packages/rajasthan_package_images_webp/rajasthan-jaipur-hawa-mahal.webp"
        ]
      },
      {
        day: "Day 2",
        title: "Jaipur Sightseeing",
        text: "After breakfast, drive to the outskirts of Jaipur to visit Amber Fort, the ancient capital of Jaipur. Explore the fort's grand palaces and mirrored interiors. Enjoy an Elephant Ride or Jeep Ride at Amber Fort on own cost. Later visit Birla Temple. Rest of the day is free for shopping and personal activities. Overnight stay in Jaipur.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jaipur-amber-fort.webp",
          "/packages/rajasthan_package_images_webp/rajasthan-jaipur-hawa-mahal.webp"
        ]
      },
      {
        day: "Day 3",
        title: "Jaipur to Bikaner",
        text: "Early morning, drive to the walled city of Bikaner. On arrival, check in at the hotel. Rest of the day is free for leisure. Overnight stay in Bikaner.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-bikaner-junagarh-fort.webp"
        ]
      },
      {
        day: "Day 4",
        title: "Bikaner Sightseeing",
        text: "After breakfast, proceed for Bikaner local sightseeing. Visit Junagarh Fort, Camel Breeding Farm, and Deshnok Karni Mata Temple. Rest of the day is free for leisure activities. Overnight stay in Bikaner.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-bikaner-junagarh-fort.webp"
        ]
      },
      {
        day: "Day 5",
        title: "Bikaner to Jaisalmer",
        text: "After breakfast, check out from the hotel and proceed to the desert town of Jaisalmer. In the evening, enjoy a camel ride arranged during the hotel or camp stay. Overnight stay at Jaisalmer Camp.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jaisalmer-desert-camp-camel-safari.webp"
        ]
      },
      {
        day: "Day 6",
        title: "Jaisalmer Sightseeing",
        text: "After breakfast, check out from the camp and proceed to Jaisalmer town. Visit Jaisalmer Golden Fort, Gadhisar Lake, Patwon Ki Haveli, and Nathmal Ji Ki Haveli. Later enjoy shopping in the local market. Overnight stay at Jaisalmer Hotel.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jaisalmer-golden-fort.webp",
          "/packages/rajasthan_package_images_webp/rajasthan-jaisalmer-desert-camp-camel-safari.webp"
        ]
      },
      {
        day: "Day 7",
        title: "Jaisalmer to Jodhpur",
        text: "After breakfast, drive to Jodhpur, known as the Blue City. En route, visit the Desert Cultural Centre. On arrival, check in at the hotel. Rest of the day is free for leisure. Overnight stay in Jodhpur.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-blue-city.webp"
        ]
      },
      {
        day: "Day 8",
        title: "Jodhpur Sightseeing",
        text: "After breakfast, proceed for Jodhpur sightseeing. Visit Umaid Bhawan Palace & Museum, the majestic Mehrangarh Fort, and Jaswant Thada, a cluster of royal cenotaphs built in 1899. Overnight stay at Jodhpur Hotel.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-mehrangarh-fort.webp",
          "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-blue-city.webp"
        ]
      },
      {
        day: "Day 9",
        title: "Departure from Jodhpur",
        text: "After breakfast, check out and transfer to Jodhpur Airport or Railway Station for onward journey.",
        images: [
          "/packages/rajasthan_package_images_webp/rajasthan-jodhpur-mehrangarh-fort.webp"
        ]
      }
    ],
    hotels: [
      { title: "3 Star Package", price: "AED 1845 per person", features: ["Bhanwar Hotel or similar 3*", "Daily breakfast except Day 1", "AC vehicle transfers"] },
      { title: "3 Star Standard Package", price: "AED 2085 per person", features: ["Garh Jaisal Hotel or similar 3* Standard", "Daily breakfast except Day 1", "Jaisalmer camp dinner"] },
      { title: "4 Star Package", price: "AED 2320 per person", features: ["Vista Bikaner or similar 4*", "Daily breakfast except Day 1", "AC vehicle transfers"] }
    ],
    pricingOptions: [
      {
        label: "3 Star Package",
        badge: "Best Value",
        hotels: ["Bhanwar Hotel or similar 3*"],
        mealPlan: "Daily Breakfast except Day 1, dinner during Jaisalmer Camp stay",
        transferType: "AC vehicle as per itinerary",
        price: "AED 1845",
        priceNote: "per person",
        features: ["Jaipur, Bikaner, Jaisalmer and Jodhpur stays", "Jaisalmer camp stay", "Camel safari during camp stay", "Sightseeing transfers"],
        cta: "Enquire Now"
      },
      {
        label: "3 Star Standard Package",
        badge: "Popular Upgrade",
        hotels: ["Garh Jaisal Hotel or similar 3* Standard"],
        mealPlan: "Daily Breakfast except Day 1, dinner during Jaisalmer Camp stay",
        transferType: "AC vehicle as per itinerary",
        price: "AED 2085",
        priceNote: "per person",
        features: ["Standard category stay", "Desert camp experience", "Camel safari included", "Planned sightseeing transfers"],
        cta: "Enquire Now"
      },
      {
        label: "4 Star Package",
        badge: "Premium Stay",
        hotels: ["Vista Bikaner or similar 4*"],
        mealPlan: "Daily Breakfast except Day 1, dinner during Jaisalmer Camp stay",
        transferType: "AC vehicle as per itinerary",
        price: "AED 2320",
        priceNote: "per person",
        features: ["Upgraded hotel category", "Jaisalmer camp stay", "Camel safari included", "Airport or station transfer"],
        cta: "Enquire Now"
      }
    ],
    inclusions: [
      "Accommodation in listed hotels or similar category hotels as per availability",
      "Airport transfers in AC vehicle as per itinerary",
      "Sightseeing transfers in AC vehicle as per itinerary",
      "Vehicle based on group size: Sedan, SUV, Tempo Traveller or similar",
      "Daily breakfast at all hotel restaurants except Day 1",
      "Dinner during Jaisalmer Camp stay",
      "Camel Safari during Jaisalmer Camp stay",
      "Hotel and transportation taxes included, except GST"
    ],
    exclusions: [
      "5% GST over and above tour cost",
      "Flights, trains, buses, or cruise fares unless specified",
      "Entrance fees for sightseeing places",
      "Travel insurance",
      "Personal expenses",
      "Tips, porterage, laundry, phone charges, shopping, camera fees",
      "Elephant ride, horse ride, pony ride, jeep safari, boat ride, or similar activities unless mentioned",
      "Any extra sightseeing or services not mentioned in inclusions",
      "High season surcharge, festive surcharge, Christmas/New Year surcharge, gala dinner charges if applicable",
      "Any cost due to unforeseen circumstances, route changes, travel date changes, illness, accident, or personal emergency",
      "Anything not specifically mentioned in the inclusions"
    ],
    notes: [
      "5% GST is applicable over and above the tour cost.",
      "Final vehicle type depends on group size and confirmed routing.",
      "High season, festive dates, gala dinners, and availability changes may affect the final quote."
    ],
    optionalTours: [
      "Elephant ride, Jeep ride, horse ride, pony ride, boat ride, or similar activities can be added on request at additional cost.",
      "Extra sightseeing, shopping stops, or upgraded experiences can be customized before confirmation."
    ],
    visaDetails: "India visa requirements depend on nationality and residency status. Flyo can guide document requirements before booking.",
    importantInfo: [
      "5% GST is applicable over and above the tour cost.",
      "Entrance fees for sightseeing places are not included unless they are specifically added to the final confirmed quote.",
      "Vehicle and transfer arrangements are based on group size and final itinerary confirmation.",
      "Camp stay and camel safari arrangements depend on weather, availability, and local operating conditions."
    ],
    faqs: [
      { question: "Is Royal Rajasthan Heritage Tour suitable for families?", answer: "Yes. The route is designed for families and culture-focused travelers who want forts, palaces, desert experiences, markets, and comfortable city-to-city transfers." },
      { question: "Is the Jaisalmer camel safari included?", answer: "Yes. Camel Safari during the Jaisalmer Camp stay is included in the package." },
      { question: "Can hotels be upgraded?", answer: "Yes. Flyo can customize hotels, room categories, vehicle type, and sightseeing pace around your dates and budget." },
      { question: "Are monument entrance fees included?", answer: "Entrance fees are excluded unless they are specifically added to the final confirmed quote." }
    ],
    whatsappMessage: "Hi, I'm interested in Royal Rajasthan Heritage Tour. Please share more details."
  },
  {
    slug: "kerala-economy-tour",
    title: "Kerala Economy Tour",
    country: "India",
    destinationState: "Kerala",
    duration: "5 Nights / 6 Days",
    price: "AED 1199",
    route: "Cochin, Munnar, Thekkady & Alleppey",
    category: "Nature Tour",
    tags: ["India Packages", "Kerala Packages", "Nature Tour", "Family Holidays", "Honeymoon Packages"],
    cardImage: "/packages/kerala_package_images_webp/kerala-alleppey-houseboat-backwaters.webp",
    heroImage: "/packages/kerala_package_images_webp/kerala-munnar-tea-plantations.webp",
    galleryImages: [
      { src: "/packages/kerala_package_images_webp/kerala-cochin-chinese-fishing-nets.webp", label: "Cochin Chinese Fishing Nets" },
      { src: "/packages/kerala_package_images_webp/kerala-fort-kochi-heritage-street.webp", label: "Fort Kochi Heritage Street" },
      { src: "/packages/kerala_package_images_webp/kerala-munnar-tea-plantations.webp", label: "Munnar Tea Plantations" },
      { src: "/packages/kerala_package_images_webp/kerala-munnar-waterfalls-hills.webp", label: "Munnar Waterfalls and Hills" },
      { src: "/packages/kerala_package_images_webp/kerala-thekkady-periyar-lake.webp", label: "Thekkady Periyar Lake" },
      { src: "/packages/kerala_package_images_webp/kerala-spice-plantation.webp", label: "Kerala Spice Plantation" },
      { src: "/packages/kerala_package_images_webp/kerala-alleppey-houseboat-backwaters.webp", label: "Alleppey Houseboat Backwaters" }
    ],
    imageHighlights: ["Munnar tea gardens", "Periyar nature", "Alleppey houseboat"],
    summary: "Discover Kerala's natural beauty with Cochin heritage, Munnar tea gardens, Thekkady wildlife and spice plantations, and an overnight Alleppey houseboat cruise.",
    overview: "This Kerala economy holiday is a relaxed 5-night journey through Cochin, Munnar, Thekkady, and Alleppey with colonial heritage, waterfalls, hill viewpoints, wildlife experiences, spice plantations, and a private houseboat stay in the famous Kerala backwaters.",
    highlights: [
      "Cochin city sightseeing",
      "Jewish Synagogue and Jew Town",
      "St. Francis Church",
      "Dutch Palace or Mattancherry Palace",
      "Santa Cruz Basilica",
      "Chinese Fishing Nets",
      "Marine Drive",
      "Lulu Mall shopping option",
      "Scenic drive to Munnar",
      "Munnar waterfalls and natural viewpoints",
      "Tea Museum",
      "Rose Garden or Floriculture Centre",
      "Eravikulam National Park",
      "Mattupetty Dam or Lake",
      "Kundala Lake or Dam",
      "Photo Point and Echo Point",
      "Thekkady sightseeing",
      "Periyar Wildlife Sanctuary",
      "Periyar Lake boating option",
      "Spice Plantation visit",
      "Optional Kathakali and Kalaripayattu show",
      "Optional Elephant Ride and Jeep Safari",
      "Alleppey overnight houseboat stay",
      "Backwater cruise with meals onboard",
      "Airport or railway station transfers"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Cochin & Sightseeing",
        text: "Arrive at Cochin Airport or Ernakulam Railway Station and transfer to the hotel. Spend the afternoon with local sightseeing in and around Cochin, known as the Queen of the Arabian Sea. Visit Jewish Synagogue, Jew Town, St. Francis Church, Dutch Palace or Mattancherry Palace, Santa Cruz Basilica, Chinese Fishing Nets at Vasco da Gama Square, Marine Drive, and Lulu Mall if time permits. Overnight stay in Cochin. Entrance fees and activity charges are not included unless mentioned in inclusions.",
        images: [
          "/packages/kerala_package_images_webp/kerala-cochin-chinese-fishing-nets.webp",
          "/packages/kerala_package_images_webp/kerala-fort-kochi-heritage-street.webp"
        ]
      },
      {
        day: "Day 2",
        title: "Cochin to Munnar",
        text: "After breakfast, check out and drive to Munnar, approximately 4 hours. Enjoy waterfalls and scenic natural spots on the way. Munnar is a beautiful hill station located around 1600 meters above sea level. On arrival, check in to the hotel. Visit Tea Museum if open and Floriculture Centre or Rose Garden if time permits. Overnight stay in Munnar. Tea Museum is closed on Mondays.",
        images: [
          "/packages/kerala_package_images_webp/kerala-munnar-tea-plantations.webp",
          "/packages/kerala_package_images_webp/kerala-munnar-waterfalls-hills.webp"
        ]
      },
      {
        day: "Day 3",
        title: "Munnar Sightseeing",
        text: "After breakfast, proceed for full-day sightseeing in Munnar. Visit Eravikulam National Park, Mattupetty Dam or Lake, Kundala Lake or Dam, Photo Point, and Echo Point. Optional activities such as boating and horse riding can be done based on availability and direct payment. Overnight stay in Munnar.",
        images: [
          "/packages/kerala_package_images_webp/kerala-munnar-tea-plantations.webp",
          "/packages/kerala_package_images_webp/kerala-munnar-waterfalls-hills.webp"
        ]
      },
      {
        day: "Day 4",
        title: "Munnar to Thekkady",
        text: "After breakfast, check out and drive to Thekkady, approximately 4 hours. On arrival, check in to the hotel and proceed for sightseeing. Visit Periyar Wildlife Sanctuary and enjoy optional boating at Periyar Lake. You may also visit spice plantations and choose optional activities such as jeep safari, Kathakali show, Kalaripayattu show, or elephant ride based on availability. Overnight stay in Thekkady.",
        images: [
          "/packages/kerala_package_images_webp/kerala-thekkady-periyar-lake.webp",
          "/packages/kerala_package_images_webp/kerala-spice-plantation.webp"
        ]
      },
      {
        day: "Day 5",
        title: "Thekkady to Alleppey Houseboat",
        text: "After breakfast, check out and drive to Alleppey, approximately 4 hours. Board the traditionally decorated private houseboat. Check-in time is around 1:00 PM and the cruise starts with lunch. Food will be served onboard. Enjoy the peaceful Kerala backwaters and overnight stay in the houseboat.",
        images: [
          "/packages/kerala_package_images_webp/kerala-alleppey-houseboat-backwaters.webp"
        ]
      },
      {
        day: "Day 6",
        title: "Alleppey to Cochin Departure",
        text: "After breakfast, check out from the houseboat and drive to Cochin Airport or railway station for departure, carrying wonderful memories from God's Own Country.",
        images: [
          "/packages/kerala_package_images_webp/kerala-alleppey-houseboat-backwaters.webp"
        ]
      }
    ],
    hotels: [
      { title: "Kerala Economy Package", price: "AED 1199 per person", features: ["Luxo Cochin - Deluxe", "Leaf Munnar - Green Leaf", "Citadel Boutique Hotel - Knight", "AC Premium Private Houseboat - 01 BR Premium"] }
    ],
    pricingOptions: [
      {
        label: "Kerala Economy Package",
        badge: "Best Value",
        hotels: [
          "Cochin: Luxo Cochin - Deluxe",
          "Munnar: Leaf Munnar - Green Leaf",
          "Thekkady: Citadel Boutique Hotel - Knight",
          "Alleppey: AC Premium Private Houseboat - 01 BR Premium"
        ],
        mealPlan: "Hotels and resorts on breakfast basis, all meals during houseboat stay",
        transferType: "A/C Sedan at disposal for transfers and sightseeing",
        price: "AED 1199",
        priceNote: "per person on double sharing basis",
        features: ["1 double room accommodation", "Private premium houseboat", "Backwater cruise with meals", "Airport or railway station transfers"],
        cta: "Enquire Now"
      }
    ],
    inclusions: [
      "Accommodation in the mentioned hotels",
      "Hotels and resorts on breakfast basis",
      "Houseboat stay with all meals",
      "Accommodation with 1 double room",
      "Transfers and sightseeing by A/C Sedan at disposal",
      "Driver bata, toll, parking, driver night halt, fuel charges, and interstate permit if required"
    ],
    exclusions: [
      "GST @ 5% as per government rules",
      "Airfare",
      "Entrance fees",
      "Personal expenses such as drinks, telephone, laundry bills, etc.",
      "Tips and porter charges",
      "Any boating charges such as motor boat or pedal boat",
      "Additional expenses due to flight delay, cancellation, weather conditions, political closures, technical faults, etc.",
      "Any service not specifically mentioned in inclusions"
    ],
    notes: [
      "Rates are valid only for the mentioned travel dates.",
      "Package cost can be amended based on hotel and budget preferences.",
      "Check-in time at hotels is 2:00 PM and checkout is 11:00 AM.",
      "Overnight houseboat check-in is 1:00 PM and checkout is 9:00 AM next day.",
      "Price is based on base category rooms unless otherwise specified.",
      "Higher room categories are available on request.",
      "This is only an offer and not a booking confirmation.",
      "Booking will be processed after payment and subject to availability.",
      "If the original hotels are unavailable, equivalent or alternative hotels will be provided.",
      "Air conditioning in Deluxe Houseboat works from 9 PM to 6 AM.",
      "Full-time A/C is available only in Premium and Luxury Houseboat."
    ],
    optionalTours: [
      "Periyar Lake boating, motor boat or pedal boat can be added at direct payment.",
      "Kathakali show, Kalaripayattu show, Elephant Ride, Jeep Safari, boating, and horse riding can be arranged based on availability."
    ],
    visaDetails: "India visa requirements depend on nationality and residency status. Flyo can guide document requirements before booking.",
    importantInfo: [
      "Meeting on arrival: our representative will receive guests at the airport.",
      "For railway station arrival, the chauffeur will receive guests with a placard in the guest name.",
      "Tea Museum is closed on Mondays.",
      "Entrance fees and activity charges are not included unless mentioned in inclusions.",
      "Overnight houseboat check-in is 1:00 PM and checkout is 9:00 AM next day.",
      "Booking is subject to availability and processed after payment."
    ],
    faqs: [
      { question: "Is Kerala Economy Tour suitable for honeymoon travelers?", answer: "Yes. The route works well for honeymoon travelers, families, and nature-focused guests, with Munnar hills and an Alleppey houseboat stay as key highlights." },
      { question: "Are meals included on the houseboat?", answer: "Yes. The houseboat stay includes all meals onboard as part of the package." },
      { question: "Are entrance fees and boating included?", answer: "Entrance fees and boating charges are excluded unless they are specifically added to the final confirmed quote." },
      { question: "Can the hotels be changed?", answer: "Yes. Package cost can be amended based on hotel and budget preferences, subject to availability." }
    ],
    whatsappMessage: "Hi, I'm interested in Kerala Economy Tour. Please share more details."
  },
  {
    slug: "dubai-desert-safari",
    title: "Dubai Desert Safari",
    country: "UAE",
    duration: "Evening Experience",
    price: "AED 149",
    route: "Dubai Desert Conservation Area",
    category: "UAE Experience",
    tags: ["Adventure", "Best Seller"],
    cardImage: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85",
    heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=92",
    summary: "A classic UAE experience with dune bashing, desert sunset, camp activities, BBQ dinner, and live shows.",
    overview: "Keep Dubai Desert Safari as a signature UAE experience, perfect for visitors who want adventure, Arabian hospitality, and a memorable evening in the dunes.",
    highlights: ["Hotel pickup and drop-off", "4x4 dune bashing", "Sunset photo stop", "BBQ dinner", "Live shows and camp activities"],
    itinerary: [
      { day: "Stop 1", title: "Pickup", text: "We pick you up from your Dubai or Sharjah location in a comfortable vehicle." },
      { day: "Stop 2", title: "Dune Bashing", text: "Enjoy a thrilling desert drive with experienced safari drivers." },
      { day: "Stop 3", title: "Sunset and Camp", text: "Capture desert sunset photos, then arrive at the camp for activities." },
      { day: "Stop 4", title: "Dinner and Shows", text: "Enjoy BBQ dinner, live entertainment, and a relaxed evening under the sky." },
      { day: "Stop 5", title: "Drop-off", text: "Return transfer to your hotel or residence." }
    ],
    hotels: [
      { title: "Standard Package", price: "AED 149 per person", features: ["Shared pickup", "Dune bashing", "BBQ dinner"] },
      { title: "Premium Package", price: "AED 229 per person", features: ["Hotel pickup", "Premium camp seating", "Dinner and shows"] },
      { title: "VIP Majlis Package", price: "AED 349 per person", features: ["VIP seating", "Premium service", "Private table option"] }
    ],
    inclusions: ["Pickup and drop-off", "Dune bashing", "Camel ride and sandboarding", "BBQ dinner", "Live entertainment"],
    exclusions: ["Quad bike or buggy rides unless selected", "Personal expenses", "Premium add-ons not selected"],
    notes: ["Not recommended for pregnant guests or guests with serious back problems.", "Pickup timing may vary by season and location.", "Private desert safari options are available."],
    faqs: [
      { question: "Is dune bashing safe?", answer: "Yes. Experienced drivers operate suitable 4x4 vehicles and adjust the experience based on guest comfort." },
      { question: "Can I book a private safari?", answer: "Yes. Private transfers and private safari experiences can be arranged on request." }
    ]
  }
];

export const packages = holidayPackages.concat(cruisePackages).map(item => ({
  ...item,
  recommendedMonths: item.recommendedMonths || packageRecommendedMonths[item.slug] || []
}));

export const navLinks = ["Home", "Flights", "Holidays", "Experiences", "Visa Services", "Contact"];

export const footerColumns = [
  { title: "Quick Links", links: ["Home", "Flights", "Holidays", "Experiences", "Visa Services", "Contact", "Privacy Policy", "Terms & Conditions"] },
  { title: "Services", links: ["Flight Booking Assistance", "Holiday Packages", "Visa Assistance", "Custom Holidays", "Honeymoon Packages", "Family Holidays", "Group Tours"] }
];

export const contact = { phone, whatsapp, email };
