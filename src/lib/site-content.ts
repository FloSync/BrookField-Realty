/** Migrated marketing copy from brookfieldrealtorltd.com — presentation updated for Brookfield Realty. */

export const BRAND = {
  name: "Brookfield Realty",
  legalName: "Brookfield Realty & Investment Ltd.",
  tagline: "Real Estate | Investment | Development",
  legacyTagline: "Redefining Luxury Living",
} as const;

export const heroHeadline = "Comfortable Homes & Land";

export const companyIntro =
  "Brookfield Realty gives you comfortable luxury homes. Get the right properties at affordable prices. We develop, sell, maintain and manage trusted properties.";

export const homeConglomerateLine =
  "Brookfield Realty is a conglomerate of estate developers, surveyors and property realtors.";

export const homeCoreValues =
  "At Brookfield Realty, we thrive on the core values of honesty, integrity, reliability, and professionalism, ensuring that every interaction and transaction is conducted with the utmost care and expertise.";

export const homeLetsHelpYou =
  "We can assist you in acquiring that dream home by helping you make informed decisions. Send us a message and we'll get back to you immediately.";

export const aboutSummary =
  "Brookfield Realty is a conglomerate of estate developers, surveyors and property realtors. We thrive on the core values of honesty, integrity, reliability, and professionalism, ensuring that every interaction and transaction is conducted with the utmost care and expertise.";

export const aboutMission =
  "Our mission is simple yet powerful: to assist our clients in finding their dream properties while offering a seamless and enjoyable real estate experience. Whether you are looking for a cozy apartment, a luxurious villa, a commercial space, or a piece of land to build your own masterpiece, we are here to guide you through every step of the process.";

export const aboutDifferentiator =
  "What sets us apart is our unwavering commitment to the comfort and satisfaction of our clients. We understand that buying or selling a property can be a significant life decision, and we take it upon ourselves to alleviate any concerns or uncertainties you may have.";

export const professionalProfile =
  "Professionality is our watchword and trustworthiness is our tag. Our operations include real estate development, property evaluation, quantitative and qualitative surveying, estate management, property liquidation, land sales, and general contract services.";

export const clientRelationship =
  "We pride ourselves on our robust client relationship system, designed to effectively cater to your needs. From the moment you engage with us, we prioritize open and transparent communication. We actively listen to your requirements, preferences, and concerns, ensuring we fully understand your vision.";

export const aboutVision =
  "Brookfield Realty's core vision is to be the premier real estate partner, renowned for our unwavering commitment to excellence, innovation, and client satisfaction. We aspire to transform the way people experience the world of real estate by delivering exceptional properties and services that exceed expectations. As a company, among our set goals is to globalize our brand in the real estate sector and be a reliable go-between to all major players in the industry.";

export const aboutMissionStatement =
  "Our mission at Brookfield Realty is to provide personalized, trustworthy, and comprehensive real estate solutions to our clients. Through our expertise, integrity, and dedication, we strive to create lasting value and build strong relationships with our clients, partners, and communities. We are driven by a passion for helping people find their ideal properties and achieving their real estate goals with confidence and peace of mind.";

export const teamIntro =
  "At Brookfield Realty, we are more than just a real estate company — we are a family of dedicated professionals who share a common passion for turning dreams into reality. We have set ourselves as reliable, competent, and trustworthy entrepreneurs with a global reach for investors and other stakeholders who are looking for shared interest in real estate for profitable investment to partner with or patronize us.";

export const contactIntro =
  "Whether you are a first-time homebuyer, an experienced investor, or a seller looking to maximize the value of your property, we are here to support you every step of the way. With Brookfield Realty, you can rest assured that your real estate journey will be smooth, enjoyable, and ultimately rewarding.";

export const contactThankYou =
  "Thank you for considering Brookfield Realty as your trusted real estate partner. We look forward to helping you achieve your real estate goals and turning your dreams into reality.";

export const servicesIntro =
  "Our services include real estate development, property evaluation, quantitative and qualitative surveying, estate management, property liquidation, land sales, and general contract services. Contact Brookfield Realty and request a free consultation with our expert. Our consultants are always ready to clear all your doubts, questions and provide real-time solutions to your pain points.";

export const servicesConsultation =
  "Contact Brookfield Realty and request a free consultation with our expert. Our consultants are always ready to clear all your doubts, questions and provide real-time solutions to your pain points.";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

export const services: ServiceItem[] = [
  {
    id: "apartments",
    title: "Apartments",
    description:
      "We have luxury apartments, high-rise apartments, budget apartments and much more for you to choose from. Contact us if you have special needs.",
    href: "/properties?category=residential",
  },
  {
    id: "houses",
    title: "Houses",
    description:
      "Both houses for rent and for sale are available. We have houses in low-key areas and likewise in highbrow areas in Lagos and environ. Call us to get you what you want.",
    href: "/properties?category=residential",
  },
  {
    id: "offices",
    title: "Offices & commercial",
    description:
      "Offices and commercial properties are available, for rent or purchase. Brookfield Realty will give you suitable offices for commercial purposes. Let us know your specification by contacting us.",
    href: "/properties?category=commercial",
  },
  {
    id: "land-sales",
    title: "Land sales",
    description:
      "Serviced plots and estate land across Lagos, Oyo and growth corridors — including Free Zone City, Canty Hills, Greenbrooks Gardens and more.",
    href: "/properties?category=land",
  },
  {
    id: "development",
    title: "Real estate development",
    description:
      "Estate development delivered by our in-house developers, blending design, functionality and quality.",
    href: "/about",
  },
  {
    id: "estate-management",
    title: "Estate management",
    description:
      "Property maintenance and estate management as part of our full-service real estate operations.",
    href: "/contact",
  },
  {
    id: "surveying",
    title: "Property evaluation & surveying",
    description:
      "Quantitative and qualitative surveying to support informed property decisions.",
    href: "/contact",
  },
  {
    id: "liquidation",
    title: "Property liquidation",
    description:
      "Support for property liquidation and general contract services.",
    href: "/contact",
  },
];

export const whyChoose = [
  {
    title: "Honesty & integrity",
    text: "Core values of honesty, integrity, reliability, and professionalism in every transaction.",
  },
  {
    title: "Full-service expertise",
    text: "Development, surveying, estate management, land sales and property advisory under one roof.",
  },
  {
    title: "Client-first communication",
    text: "Transparent communication from first enquiry through to documentation and handover.",
  },
  {
    title: "Trusted properties",
    text: "We develop, sell, maintain and manage trusted properties across Lagos and beyond.",
  },
];

/** About page impact stats (legacy About page figures, updated). */
export const legacyStats = [
  { label: "Apartments sold", value: "252+" },
  { label: "Satisfied clients", value: "985+" },
  { label: "Houses rented", value: "500+" },
  { label: "Listed properties", value: "2500+" },
];

export const socialLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  twitter: "https://twitter.com/",
};
