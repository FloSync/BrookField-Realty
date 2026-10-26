import type {
  Property,
  TeamMember,
  Testimonial,
  JobOpening,
  FAQItem,
  Project,
} from "./types";
import { migratedProperties } from "./migrated-properties";

// --- Properties (migrated from brookfieldrealtorltd.com + marketing assets) ---

export const properties: Property[] = migratedProperties;

export function getAllProperties(): Property[] {
  return properties;
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

/** Homepage “Latest properties” row — flyer-backed listings in display order. */
const HOME_LATEST_PROPERTY_SLUGS = [
  "beverly-homes",
  "free-zone-city",
  "coastal-villa",
  "paris-villa",
] as const;

export function getLatestHomeProperties(): Property[] {
  return HOME_LATEST_PROPERTY_SLUGS.map((slug) => getPropertyBySlug(slug)).filter(
    (p): p is Property => p !== undefined
  );
}

export function getInvestmentProperties(): Property[] {
  return properties.filter((p) => p.isInvestment);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

// --- Projects / Estates ------------------------------------------------

export const projects: Project[] = [
  {
    id: "1",
    name: "Crestwood Gardens Estate",
    slug: "crestwood-gardens-estate",
    location: "Sangotedo, Lagos",
    description:
      "A 40-hectare gated residential estate with parks, a shopping court, and dedicated power infrastructure.",
    status: "Ongoing",
    imageUrl: "/properties/greenbrooks-gardens/01-cover.jpg",
    unitsInfo: "220 plots, 60% allocated",
  },
  {
    id: "2",
    name: "Willowbrook Free Zone Corridor",
    slug: "willowbrook-free-zone-corridor",
    location: "Epe, Lagos",
    description:
      "A land-banking project positioned along Lagos's eastern growth axis, ahead of the Epe free trade zone.",
    status: "Ongoing",
    imageUrl: "/properties/free-zone-city/01-cover.jpeg",
    unitsInfo: "500 plots released in Phase 1",
  },
  {
    id: "3",
    name: "Palm Court Business District",
    slug: "palm-court-business-district",
    location: "Ikeja GRA, Lagos",
    description:
      "A mixed-use commercial development bringing retail, office, and hospitality space to Ikeja GRA.",
    status: "Coming Soon",
    imageUrl: "/properties/canty-hills-phase-4/01-cover.jpg",
  },
  {
    id: "4",
    name: "Harborview Residences",
    slug: "harborview-residences",
    location: "Banana Island, Lagos",
    description:
      "A completed waterfront tower with 48 luxury apartments and a private marina.",
    status: "Completed",
    imageUrl: "/properties/4-bedroom-semi-detached-beachwood/01-cover.jpg",
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// --- Team ---------------------------------------------------------------

export const team: TeamMember[] = [
  {
    id: "fadare-yemi",
    name: "Fadare Ayodele Yemi",
    position: "Managing Director and CEO",
    bio: "Board — Brookfield Realty.",
    group: "board",
    photoUrl:
      "https://brookfieldrealtorltd.com/wp-content/uploads/2025/04/IMG_0379-scaled.jpg",
  },
  {
    id: "uzoigwe-sunday",
    name: "Uzoigwe Emezuo Sunday",
    position: "Executive Director",
    bio: "Board — Brookfield Realty.",
    group: "board",
    photoUrl:
      "https://brookfieldrealtorltd.com/wp-content/uploads/2025/04/IMG_0380-scaled.jpg",
  },
  {
    id: "chukwuanugo-chukwueloka-mokeme",
    name: "Chukwuanugo Chukwueloka Mokeme",
    position: "Board Member",
    bio: "Board — Brookfield Realty.",
    group: "board",
    photoUrl: "/team/chukwuanugo-chukwueloka-mokeme.png",
  },
  {
    id: "chidinma-emeruem",
    name: "Chidinma Emeruem",
    position: "Human Resource",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/chidinma-emeruem.png",
  },
  {
    id: "recheal-bamidele",
    name: "Recheal Bamidele",
    position: "Admin",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/recheal-bamidele.png",
  },
  {
    id: "florence-abayomi",
    name: "Florence Abayomi",
    position: "Head of Sales, Digital Marketing & Technology",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/florence-abayomi.png",
  },
  {
    id: "samuel-innocent",
    name: "Samuel Innocent",
    position: "Head of Graphics",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/samuel-innocent.png",
  },
  {
    id: "happiness-innocent",
    name: "Happiness Innocent",
    position: "Head of Social Media Analyst / Content Creator",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/happiness-innocent.png",
  },
  {
    id: "wealth-oyeshina",
    name: "Wealth Oyeshina",
    position: "Sales / Customer Representative",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/wealth-oyeshina.png",
  },
  {
    id: "blessing-isaac",
    name: "Blessing Isaac",
    position: "AI Specialist",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/blessing-isaac.png",
  },
  {
    id: "john-bright",
    name: "John Bright",
    position: "Visual Strategist",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/john-bright.png",
  },
  {
    id: "rejoice-ideh",
    name: "Rejoice Ideh",
    position: "Front Desk Officer",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/rejoice-ideh.png",
  },
  {
    id: "emmanuel-jason-ebojere",
    name: "Emmmanuel-Jason Ebojere",
    position: "Site Manager",
    bio: "Brookfield Realty team.",
    group: "team",
    photoUrl: "/team/emmanuel-jason-ebojere.png",
  },
];

export function getTeam(): TeamMember[] {
  return team;
}

export function getTeamBoard(): TeamMember[] {
  return team.filter((m) => m.group === "board");
}

export function getTeamStaff(): TeamMember[] {
  return team.filter((m) => m.group === "team");
}

// --- Testimonials ---------------------------------------------------------

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Chioma A.",
    role: "Homeowner, Lekki Phase 1",
    quote:
      "Brookfield walked us through every stage of the purchase, including the title search. We closed with no surprises and moved in three months later.",
    isDemo: true,
  },
  {
    id: "2",
    name: "Segun O.",
    role: "Investor, Willowbrook Estate",
    quote:
      "I bought three plots at Willowbrook on the payment plan. The documentation process was transparent from day one and the team kept me updated at every stage.",
    isDemo: true,
  },
  {
    id: "3",
    name: "Grace M.",
    role: "Diaspora Buyer, UK",
    quote:
      "Buying property in Lagos from abroad felt risky until I worked with Brookfield. They handled inspections and sent video updates so I always knew what I was paying for.",
    isDemo: true,
  },
];

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

// --- Careers ---------------------------------------------------------

export const jobOpenings: JobOpening[] = [
  {
    id: "1",
    title: "Property Advisory Officer",
    department: "Sales",
    location: "Lagos (Lekki office)",
    type: "Full-time",
    description:
      "Guide buyers through property selection, site inspections, and closing, working closely with our legal and documentation team.",
    requirements: [
      "2+ years in real estate sales or advisory",
      "Strong communication and negotiation skills",
      "Familiarity with the Lagos property market",
    ],
  },
  {
    id: "2",
    title: "Legal & Documentation Associate",
    department: "Legal",
    location: "Lagos (Lekki office)",
    type: "Full-time",
    description:
      "Support title verification, contract drafting, and regulatory filings for property transactions.",
    requirements: [
      "LLB with active Bar license",
      "Experience with land title verification in Lagos State",
      "High attention to detail",
    ],
  },
  {
    id: "3",
    title: "Digital Marketing Intern",
    department: "Marketing",
    location: "Lagos (Lekki office)",
    type: "Contract",
    description:
      "Support content creation and campaign execution across Brookfield's digital channels.",
    requirements: [
      "Currently studying or recently graduated in Marketing or a related field",
      "Comfortable with social media platforms and basic content tools",
    ],
  },
];

export function getJobOpenings(): JobOpening[] {
  return jobOpenings;
}

// --- FAQs ---------------------------------------------------------

/** FAQ questions migrated from brookfieldrealtorltd.com/faq (answers preserved from legacy site). */
export const faqs: FAQItem[] = [
  {
    id: "1",
    question: "Am I Ready to Be a Homeowner?",
    answer:
      "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
  },
  {
    id: "2",
    question: "Is Renting or Buying Better?",
    answer:
      "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus.",
  },
  {
    id: "3",
    question: "What Is the Lender's Formula?",
    answer:
      "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
  },
  {
    id: "4",
    question: "What Do I Look for in Homes?",
    answer:
      "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus.",
  },
  {
    id: "5",
    question: "Do I Need a Home Warranty?",
    answer:
      "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
  },
  {
    id: "6",
    question: "What Should I Expect at Closing?",
    answer:
      "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
  },
  {
    id: "7",
    question: "What Is Pre-approval?",
    answer:
      "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus.",
  },
  {
    id: "8",
    question: "Am I Ready to Rent?",
    answer:
      "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
  },
  {
    id: "9",
    question: "What Should I Offer?",
    answer:
      "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus.",
  },
  {
    id: "10",
    question: "Can I Ask You for Advice?",
    answer:
      "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
  },
];

export function getFAQs(): FAQItem[] {
  return faqs;
}
