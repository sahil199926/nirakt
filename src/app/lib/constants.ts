import {
  Compass,
  MapPin,
  HeartHandshake,
  Headphones,
  Sparkles,
  Globe,
  Heart,
  Plane,
  Building2,
  Gem,
  Gift,
  Users,
  Map,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/app/components/SocialIcons";

export const BRAND = {
  name: "Nirakt Travels",
  tagline: "Your Journey, Our Promise",
  phone: "011 7106 9431",
  mobile: "+91 9319053504",
  email: "info@nirakt.com",
  address:
    "1/9, Ground Floor, Indira Vikas, Opposite Nirankari School, Dr. Mukherjee Nagar, Delhi-110009",
  social: {
    instagram: "https://www.instagram.com/nirakt_travels?igsh=MWt5NW8zczJsd3Z2aw==",
    facebook: "https://www.facebook.com/share/1EaRvDpSGv/?mibextid=wwXIfr",
    youtube: "https://youtube.com/@nirakttravelsofficial?si=w6TJzZbnBNXRMn_A",
  },
};

export const EMAILJS_CONFIG = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Destinations", href: "#destinations" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Trending destinations - capsule carousel
export const TRENDING_DESTINATIONS = {
  domestic: [
    { name: "Himachal Pradesh", image: "/images/destinations/manali.jpg" },
    { name: "Kerala", image: "/images/destinations/kerala.jpg" },
    { name: "Goa", image: "/images/destinations/goa.jpg" },
    { name: "Kedarnath", image: "/images/destinations/kedarnath.jpg" },
    { name: "Delhi", image: "/images/destinations/delhi.jpg" },
    { name: "Taj Mahal", image: "/images/destinations/tajmahal.jpg" },
  ],
  international: [
    { name: "Bali", image: "/images/destinations/bali.jpg" },
    { name: "Dubai", image: "/images/destinations/dubai.jpg" },
    { name: "Maldives", image: "/images/destinations/maldives.jpg" },
    { name: "Thailand", image: "/images/destinations/thailand.jpg" },
    { name: "Singapore", image: "/images/destinations/singapore.jpg" },
    { name: "Paris", image: "/images/destinations/paris.jpg" },
  ],
};

// Thomas Cook Specials - masonry grid
export const SPECIALS = [
  {
    title: "Your Spiritual Journey Starts Here",
    subtitle: "Explore divine destinations in India",
    price: "₹12,999",
    image: "/images/destinations/kedarnath.jpg",
    size: "tall",
    href: "#contact",
  },
  {
    title: "Dubai",
    subtitle: "Where Luxury Meets Tradition",
    price: "₹29,999",
    image: "/images/destinations/dubai.jpg",
    size: "wide",
    href: "#contact",
  },
  {
    title: "Bali",
    subtitle: "Island of the Gods",
    price: "₹34,999",
    image: "/images/destinations/bali.jpg",
    size: "normal",
    href: "#contact",
  },
  {
    title: "Maldives",
    subtitle: "Crystal Waters & Overwater Villas",
    price: "₹49,999",
    image: "/images/destinations/maldives.jpg",
    size: "normal",
    href: "#contact",
  },
  {
    title: "Looking for Flights?",
    subtitle: "Find Your Best Fare Here!",
    cta: "Search Flights",
    image: "/images/destinations/paris.jpg",
    size: "wide",
    href: "#contact",
  },
];

export const WHY_CHOOSE_CARDS = [
  {
    icon: Compass,
    title: "Personalized Journeys",
    description:
      "Every traveler is unique. We design tailor-made packages that fit your budget, style, and dreams.",
  },
  {
    icon: MapPin,
    title: "Hidden Gems & Iconic Destinations",
    description:
      "From world-famous landmarks to secret, unexplored spots — we bring you experiences that others miss.",
  },
  {
    icon: HeartHandshake,
    title: "Comfort & Care",
    description:
      "Handpicked stays, seamless transfers, and packages that usually include meals. Travel stress-free.",
  },
  {
    icon: Headphones,
    title: "24/7 Trusted Support",
    description:
      "With round-the-clock support and an experienced team, we don't just plan trips — we walk with you on the journey.",
  },
  {
    icon: Sparkles,
    title: "Special Touches",
    description:
      "Surprise arrangements for honeymoons, anniversaries, pre-wedding trips, and couple getaways that make moments unforgettable.",
  },
  {
    icon: Globe,
    title: "Diverse Expertise",
    description:
      "Religious yatras, luxury escapes, corporate tours, trekking adventures, destination weddings — all under one roof.",
  },
];

export const SERVICE_CARDS = [
  {
    icon: Heart,
    title: "Couple's Celebration & Pre-Wedding",
    description: "Honeymoon tours, anniversary getaways, luxury couple trips, and cinematic pre-wedding shoots.",
    image: "/images/services/couples-celebration.jpg",
    href: "/services/couples-celebration",
  },
  {
    icon: Building2,
    title: "Corporate & Group Travel",
    description: "MICE events, team-building adventures, incentive trips, and educational institutional tours.",
    image: "/images/services/corporate-travel.jpg",
    href: "/services/corporate-group-travel",
  },
  {
    icon: Gift,
    title: "Proposal & Surprise Planning",
    description: "Private yacht dinners, rooftop setups, drone coverage, and cinematic surprise events.",
    image: "/images/services/proposal-planning.jpg",
    href: "/services/proposal-surprise-planning",
  },
  {
    icon: Plane,
    title: "Leisure & International Travel",
    description: "Family holidays, beach escapes, Southeast Asia tours, Europe packages & customized itineraries.",
    image: "/images/services/leisure-vacation.jpg",
    href: "/services/leisure-vacation-international",
  },
  {
    icon: Gem,
    title: "Destination Wedding & Events",
    description: "Palace weddings, beach weddings, luxury resort celebrations & grand destination events.",
    image: "/images/services/destination-wedding.jpg",
    href: "/services/destination-wedding-events",
  },
];

export const FEATURED_TRIPS = [
  {
    image: "/images/destinations/kedarnath.jpg",
    title: "Kedarnath-Badrinath Yatra",
    duration: "12 Days",
    description: "Experience divine bliss in the Himalayas. Includes helicopter option, VIP darshan, comfortable stays & guided rituals.",
    price: "₹24,999",
    badge: "Most Popular",
    rating: 4.9,
    reviewCount: 128,
  },
  {
    image: "/images/destinations/kerala.jpg",
    title: "Kerala Romance Package",
    duration: "7 Days",
    description: "Backwaters, tea gardens, beach sunsets & candlelight dinners. Perfect for honeymooners & couples.",
    price: "₹18,499",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 96,
  },
  {
    image: "/images/destinations/bali.jpg",
    title: "Bali Paradise Escape",
    duration: "6 Days",
    description: "Ubud rice terraces, temple tours, beach clubs & luxury villa stay. Visa assistance included.",
    price: "₹34,999",
    badge: "Trending",
    rating: 4.9,
    reviewCount: 214,
  },
  {
    image: "/images/destinations/maldives.jpg",
    title: "Maldives Island Hopping",
    duration: "5 Days",
    description: "Crystal clear waters, overwater villas, snorkeling & sunset cruises in paradise.",
    price: "₹49,999",
    badge: "Luxury",
    rating: 4.9,
    reviewCount: 156,
  },
];

export const TESTIMONIALS = [
  {
    quote: "Our Kedarnath yatra was flawlessly organized. The VIP darshan, comfortable stays, and our guide's knowledge made this spiritual journey truly divine.",
    name: "Rahul & Family",
    location: "Delhi",
    tripType: "Spiritual Yatra",
    rating: 5,
  },
  {
    quote: "Nirakt planned our honeymoon to Kerala and surprised us with a private candlelight dinner on the backwaters. It was magical!",
    name: "Priya & Arjun",
    location: "Mumbai",
    tripType: "Honeymoon",
    rating: 5,
  },
  {
    quote: "The Bali trip exceeded all expectations — from the villa stay to the Instagram-worthy spots they recommended. Hassle-free and memorable!",
    name: "Sneha K.",
    location: "Bangalore",
    tripType: "International",
    rating: 5,
  },
  {
    quote: "Our corporate offsite in Manali was perfectly executed. 45 people, zero hiccups. The team bonding activities were a hit!",
    name: "Vikram S.",
    location: "HR Head, TechCorp",
    tripType: "Corporate",
    rating: 5,
  },
  {
    quote: "From proposal planning in Udaipur to the palace wedding — Nirakt made every moment picture perfect. Forever grateful!",
    name: "Ananya & Rohan",
    location: "Jaipur",
    tripType: "Wedding",
    rating: 5,
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Tell Us Your Dream",
    description: "Share your destination, dates, budget & preferences. Call us, WhatsApp, or fill the form.",
  },
  {
    number: "02",
    icon: Mail,
    title: "We Craft Your Itinerary",
    description: "Our experts design a personalized plan with handpicked stays, transfers & activities within 24 hours.",
  },
  {
    number: "03",
    icon: Globe,
    title: "Pack Your Bags",
    description: "Review, confirm & pay securely. We handle bookings, permits & all logistics. Just show up & enjoy!",
  },
];

export const STATS = [
  { number: 5000, suffix: "+", label: "Happy Travelers", icon: Users },
  { number: 100, suffix: "+", label: "Destinations Covered", icon: Map },
  { number: 7, suffix: "+", label: "Years of Experience", icon: Calendar },
  { number: 24, suffix: "/7", label: "Customer Support", icon: Headphones },
];

export const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, "")}` },
  { icon: Phone, label: "Mobile", value: BRAND.mobile, href: `tel:${BRAND.mobile.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: MapPin, label: "Address", value: BRAND.address },
  { icon: MessageCircle, label: "WhatsApp", value: BRAND.mobile, href: `https://wa.me/${BRAND.mobile.replace(/\D/g, "")}` },
];

export const SOCIAL_LINKS = [
  { icon: InstagramIcon, href: BRAND.social.instagram, label: "Instagram" },
  { icon: FacebookIcon, href: BRAND.social.facebook, label: "Facebook" },
  { icon: YoutubeIcon, href: BRAND.social.youtube, label: "YouTube" },
];

export const DESTINATION_TYPES = [
  "Spiritual Yatra",
  "Honeymoon / Couple Trip",
  "Domestic Holiday",
  "International Holiday",
  "Trekking & Adventure",
  "Corporate Tour",
  "Wedding / Event",
  "Other",
];

export const BUDGET_RANGES = [
  "Under ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000+",
  "Flexible",
];

// Footer tag pills
export const FOOTER_TAGS = [
  "Kerala tour packages", "Bali tour packages", "Dubai tour packages",
  "Maldives tour packages", "Thailand tour packages", "Singapore tour packages",
  "Europe tour packages", "Himachal tour packages", "Goa tour packages",
  "Kedarnath Yatra", "Chardham Yatra", "Honeymoon packages",
  "Corporate tours", "Destination weddings", "Trekking adventures",
];
