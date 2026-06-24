export type PackageDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  heroImage: string;
  phone: string;
  booking: {
    title: string;
    datePlaceholder: string;
    defaultAdults: string;
    defaultChildren: string;
    defaultPackage: string;
    button: string;
    note: string;
  };
  heroFeatures: Array<{ icon: string; title: string }>;
  trustLine: string[];
  highlights: Array<{ number: string; title: string; text: string; image: string }>;
  timeline: Array<{ icon: string; title: string; text: string }>;
  gallery: Array<{ icon: string; title: string; image: string }>;
  options: Array<{ icon: string; title: string; description: string; bestFor?: string; features?: string[]; price: string; suffix: string; cta?: string; featured?: boolean; badge?: string }>;
  packageTrust: Array<{ icon: string; title: string }>;
  reviewIntro: { badge: string; title: string; text: string; button: string };
  trustPoints: Array<{ icon: string; title: string }>;
  testimonials: Array<{ quote: string; name: string; location: string; initials: string; rating: number }>;
  stats: Array<{ icon: string; value: string; label: string }>;
  essentialInfo: Array<{ icon: string; title: string; text?: string; items: Array<string | { title: string; text?: string }>; link?: string }>;
  faqs: Array<{ question: string; answer: string }>;
  cta: { title: string; text: string; buttons: Array<{ label: string; href: string }> };
};

export const packages: PackageDetail[] = [
  {
    slug: "dubai-desert-safari",
    title: "Dubai Desert Safari",
    eyebrow: "#1 Desert Experience in Dubai",
    subtitle: "Feel the rush of the dunes, savor authentic Arabian hospitality, and create unforgettable memories in the heart of the desert.",
    heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=92",
    phone: "+971 50 123 4567",
    booking: {
      title: "Quick Book Your Safari",
      datePlaceholder: "Choose your date",
      defaultAdults: "2",
      defaultChildren: "0",
      defaultPackage: "Premium Package",
      button: "Check Availability",
      note: "Secure Booking • No Hidden Charges"
    },
    heroFeatures: [
      { icon: "⌖", title: "Hotel Pickup & Drop-off" },
      { icon: "▱", title: "4x4 Dune Bashing" },
      { icon: "◒", title: "BBQ Dinner Included" },
      { icon: "♨", title: "Live Shows & Entertainment" }
    ],
    trustLine: ["Instant Confirmation", "Best Price Guarantee", "5-Star Experience"],
    highlights: [
      {
        number: "01",
        title: "Thrill of Dune Bashing",
        text: "Feel the rush as our expert drivers take you across rolling dunes in a powerful 4x4. An experience you’ll never forget.",
        image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85"
      },
      {
        number: "02",
        title: "Arabian Camp Experience",
        text: "Step into a traditional Bedouin-style camp and enjoy warm Arabian hospitality with dates, Arabic coffee & more.",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=85"
      },
      {
        number: "03",
        title: "Sunset & BBQ Dinner",
        text: "Watch the desert turn magical at sunset and indulge in a delicious BBQ dinner with vegetarian & non-veg options.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85"
      },
      {
        number: "04",
        title: "Live Entertainment",
        text: "Enjoy mesmerizing performances including Tanoura, Belly Dance & Fire Show under the stars.",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85"
      }
    ],
    timeline: [
      { icon: "▣", title: "Pickup", text: "We pick you up from your location in a comfortable 4x4." },
      { icon: "▤", title: "Dune Bashing", text: "Thrilling 30–40 minutes of dune bashing across high red dunes." },
      { icon: "◉", title: "Photo Stop", text: "Capture stunning moments at the sunset point." },
      { icon: "△", title: "Camp Arrival", text: "Warm welcome at the desert camp with Arabic coffee." },
      { icon: "✦", title: "Activities", text: "Camel ride, sandboarding, henna painting & more fun activities." },
      { icon: "◈", title: "Dinner & Shows", text: "BBQ dinner followed by live entertainment & fire show." },
      { icon: "▣", title: "Drop-off", text: "We drop you back safely to your location." }
    ],
    gallery: [
      { icon: "▣", title: "Dune Bashing", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85" },
      { icon: "△", title: "Desert Camp", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=85" },
      { icon: "◈", title: "Camel Ride", image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=900&q=85" },
      { icon: "✧", title: "Live Entertainment", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85" },
      { icon: "✦", title: "Sandboarding", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85" }
    ],
    options: [
      { icon: "◎", title: "Standard Package", description: "Perfect for a quick desert adventure.", bestFor: "Best for quick desert adventure", features: ["Shared pickup", "Dune bashing", "BBQ dinner", "Live shows"], price: "AED 149", suffix: "/ Per Person", cta: "View Details" },
      { icon: "◉", title: "Premium Package", description: "Our best-selling package with more delights.", bestFor: "Best value experience", features: ["Hotel pickup", "Extended dune bashing", "Premium camp seating", "BBQ dinner & shows"], price: "AED 229", suffix: "/ Per Person", cta: "Select Premium", featured: true, badge: "Most Popular" },
      { icon: "♕", title: "VIP Majlis Package", description: "Luxury seating, premium dining & top service.", bestFor: "Best for luxury comfort", features: ["VIP seating", "Premium dining", "Priority service", "Private table option"], price: "AED 349", suffix: "/ Per Person", cta: "View Details" },
      { icon: "△", title: "Overnight Experience", description: "Stay overnight in the desert under the stars.", bestFor: "Best for stargazing & camp stay", features: ["Overnight camp stay", "Dinner & breakfast", "Evening shows", "Desert sunrise experience"], price: "AED 499", suffix: "/ Per Person", cta: "View Details" }
    ],
    packageTrust: [
      { icon: "♡", title: "Instant Confirmation" },
      { icon: "◇", title: "Best Price Guarantee" },
      { icon: "☆", title: "5-Star Experience" },
      { icon: "☏", title: "24/7 Customer Support" },
      { icon: "▣", title: "Flexible Booking" }
    ],
    reviewIntro: {
      badge: "Trusted by Thousands",
      title: "Why Travelers\nLove This\nExperience",
      text: "Unforgettable moments, exceptional service, and memories that stay with you forever.",
      button: "View All Reviews"
    },
    trustPoints: [
      { icon: "☆", title: "5-Star Rated By Thousands" },
      { icon: "✱", title: "Unforgettable Memories" },
      { icon: "♙", title: "Professional Guides" },
      { icon: "◇", title: "Best Price Guarantee" }
    ],
    testimonials: [
      { quote: "Absolutely amazing experience! The dune bashing was thrilling and the camp setup was excellent.", name: "Sophie M.", location: "United Kingdom", initials: "SM", rating: 5 },
      { quote: "Perfect way to spend an evening in Dubai. Great food, shows and super friendly staff.", name: "James T.", location: "Australia", initials: "JT", rating: 5 },
      { quote: "Our family had a fantastic time. Highly recommend the premium package!", name: "Neha R.", location: "India", initials: "NR", rating: 5 }
    ],
    stats: [
      { icon: "♡", value: "10,000+", label: "Happy Travelers" },
      { icon: "◎", value: "4.8/5", label: "Average Rating" },
      { icon: "♕", value: "5+ Years", label: "Of Excellence" },
      { icon: "☏", value: "24/7", label: "Customer Support" }
    ],
    essentialInfo: [
      {
        icon: "☑",
        title: "What’s Included",
        text: "Everything you need for an unforgettable Dubai Desert Safari experience — all included in your package.",
        items: [
          { title: "Hotel Pickup & Drop-off", text: "Convenient pickup and drop-off from your location" },
          { title: "Dune Bashing (30–40 mins)", text: "Thrilling 4x4 adventure across the red dunes" },
          { title: "Sunset Photo Stop", text: "Scenic stop to capture the stunning desert sunset" },
          { title: "Camel Ride & Sandboarding", text: "Enjoy a short camel ride and try sandboarding" },
          { title: "BBQ Dinner (Veg & Non-Veg)", text: "Delicious BBQ buffet with vegetarian and non-vegetarian options" },
          { title: "Live Shows & Entertainment", text: "Traditional Tanoura, Belly Dance & Fire Show" },
          { title: "Water, Tea, Coffee", text: "Complimentary refreshments throughout the tour" }
        ],
        link: "View all inclusions"
      },
      { icon: "⌖", title: "Pickup Zones", text: "We pick up from all major areas in Dubai & Sharjah.", items: ["Dubai Marina", "Downtown Dubai", "Deira", "Bur Dubai", "Sharjah", "Jumeirah"], link: "View all zones" },
      { icon: "♙", title: "What to Wear", text: "Dress comfortably for the best desert safari experience.", items: ["Comfortable casual wear", "Closed shoes or sneakers", "Light jacket during Nov–Feb", "Sunglasses & hat", "Sunscreen"], link: "View all tips" },
      { icon: "♧", title: "Family Friendly", text: "A comfortable desert experience suitable for families and all age groups.", items: ["Suitable for all age groups", "Children under 3 years are free", "Child seats available on request", "Private tours available for families"], link: "Learn more" },
      { icon: "♡", title: "Cancellation Policy", text: "Flexible options and clear cancellation terms for peace of mind.", items: ["Free cancellation up to 24 hours before tour", "50% refund for cancellations within 24 hours", "No-show: Non-refundable"], link: "View full policy" },
      { icon: "▤", title: "Important Notes", text: "Key things to know before booking your desert safari.", items: ["Tour duration: 6–7 hours approx.", "Not recommended for pregnant women and people with back problems", "Timings may vary during Ramadan", "Pickup time will be confirmed before the tour"], link: "Read important notes" }
    ],
    faqs: [
      { question: "What is the best time to go for a Dubai Desert Safari?", answer: "Late afternoon is ideal because you can enjoy dune bashing, sunset photos, dinner and evening entertainment in one smooth experience." },
      { question: "Is dune bashing safe?", answer: "Yes. Experienced desert drivers operate the safari in suitable 4x4 vehicles, with safety briefings and route planning based on conditions." },
      { question: "Are vegetarian food options available?", answer: "Yes. Vegetarian and non-vegetarian BBQ dinner options are available at the camp." },
      { question: "Can I book a private desert safari?", answer: "Yes. Private transfers and private safari experiences can be arranged on request." },
      { question: "What is included in the VIP Majlis package?", answer: "VIP Majlis includes upgraded seating, premium dining service and a more personalized camp experience." },
      { question: "Do you provide hotel pickup from all areas?", answer: "Pickup is available from major Dubai and Sharjah locations. Our team confirms the exact pickup point after booking." }
    ],
    cta: {
      title: "Ready for an Unforgettable Adventure?",
      text: "Book now and get the best desert safari experience in Dubai.",
      buttons: [
        { label: "Book on WhatsApp", href: "#" },
        { label: "Call Now\n+971 50 123 4567", href: "tel:+971501234567" }
      ]
    }
  }
];

export const navLinks = ["Home", "Destinations", "Packages", "Visa Services", "Holidays", "About", "Contact"];

export const footerColumns = [
  { title: "Company", links: ["About Us", "Our Story", "Careers", "Blog", "Contact Us"] },
  { title: "Destinations", links: ["Dubai", "Abu Dhabi", "Sharjah", "Oman", "International"] },
  { title: "Experiences", links: ["Desert Safaris", "City Tours", "Cruises", "Adventure", "Private Tours"] },
  { title: "Travel Info", links: ["Visa Information", "Travel Guide", "FAQs", "Terms & Conditions", "Privacy Policy"] }
];
