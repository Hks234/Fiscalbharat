export const DEFAULT_SETTINGS = {
  websiteName: "Fiscal Bharat",
  tagline:
    "A collaboration on both fiscal and monetary policies to elevate growth.",
  subBrand: "A venture by Israni Consultancies",
  contactPhone: "070240 00156",
  whatsappNumber: "917024000156",
  email: "hello@fiscalbharat.com",
  address:
    "Second Floor, Progressive Point, 205, Road, Rishabh Nagar and Pawan Vihar Colony, Lalpur, Raipur, Chhattisgarh 492015.",
  websiteUrl: "https://www.fiscalbharat.com/",
  logoUrl: "/brand/fiscal-bharat-logo.png",
  footerText:
    "Fiscal Bharat provides professional taxation, advisory and corporate support. Engagements are tailored to each client's circumstances.",
  googleReviewsUrl: "https://www.google.com/search?q=fiscal+bharat",
  googleReviewCount: "22",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Progressive%20Point%20Lalpur%20Raipur&t=&z=16&ie=UTF8&iwloc=&output=embed",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Progressive+Point,+Lalpur,+Raipur,+Chhattisgarh+492015",
};

export const DOCUMENT_CATEGORIES = [
  "GST Certificate",
  "GST Returns",
  "Income Tax Returns",
  "PAN Card",
  "Aadhaar Documents",
  "Company Registration",
  "Financial Statements",
  "Audit Reports",
  "Loan Documents",
  "Other Documents",
];

export const DEFAULT_SERVICES = [
  {
    name: "Tax Planning",
    description: "Structured tax planning aligned with applicable Indian tax laws.",
  },
  {
    name: "Income Tax Filing",
    description: "Assistance with accurate income tax return preparation and filing.",
  },
  {
    name: "GST Registration & Compliance",
    description: "Support for GST registration and ongoing compliance requirements.",
  },
  {
    name: "GST Return Assistance",
    description: "Help compiling and filing GST returns with supporting records.",
  },
  {
    name: "Financial Consulting",
    description: "Practical financial consulting for business decision-making.",
  },
  {
    name: "Business Plan Development",
    description: "Assistance in preparing clear, usable business plans.",
  },
  {
    name: "Bookkeeping",
    description: "Bookkeeping support to keep financial records organised.",
  },
  {
    name: "Financial Statement Preparation",
    description: "Preparation of financial statements from available records.",
  },
  {
    name: "Company Registration",
    description: "Guidance through company registration formalities.",
  },
  {
    name: "Payroll Processing",
    description: "Payroll processing support for businesses.",
  },
  {
    name: "Audit Assistance",
    description: "Coordination and documentation support during audits.",
  },
  {
    name: "Loan Application Assistance",
    description: "Help assembling documentation and applications for financing.",
  },
];

export const FALLBACK_LOGO = "/brand/fiscal-bharat-logo.png";

export function resolveLogoUrl(logoUrl?: string | null) {
  return logoUrl && logoUrl.trim() ? logoUrl : FALLBACK_LOGO;
}

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact Us" },
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const ADMIN_COOKIE = "fb_admin_session";
export const CLIENT_COOKIE = "fb_client_session";

export const SERVICE_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DOCUMENTS_REQUIRED: "Documents Required",
  COMPLETED: "Completed",
};

export const ENQUIRY_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};
