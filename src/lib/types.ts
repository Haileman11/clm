export const CONTRACT_STATUS = [
    "NEW",
    "PRE_EXPIRY",
    "EXPIRED",
    "POST_EXPIRY",
    "INACTIVE",
    "TERMINATED",
] as const;// Add local constant for roles
export const USER_ROLES = [
  "CONTRACT_MANAGER",
  "CONTRACT_OWNER",
  "CATEGORY_SOURCING_MANAGER",
  "LEGAL_TEAM",

] as const;

export enum CONTRACT_TYPE {
  MSA = "MSA",
  NDA = "NDA",
  SOW = "SOW",
  PO = "PO",
  LICENSE = "License",
  EMPLOYMENT = "Employment",
  LEASE = "Lease",
  PARTNERSHIP = "Partnership",
  CONSULTING = "Consulting",
  OTHER = "Other",
}

export enum TERM_TYPE {
  FIXED = "Fixed",
  EVERGREEN = "Evergreen",
  AUTO_RENEWAL = "AutoRenewal",
  PERPETUAL = "Perpetual",
  ROLLING = "Rolling",
  TRIAL = "Trial",
  ONE_TIME = "OneTime",
}

export enum SUPPLIER_SERVICE {
  IT_SERVICES = "ITServices",
  CONSULTING = "Consulting",
  LOGISTICS = "Logistics",
  MANUFACTURING = "Manufacturing",
  FACILITIES = "Facilities",
  MARKETING = "Marketing",
  LEGAL = "Legal",
  HR_SERVICES = "HRServices",
  FINANCIAL = "Financial",
  CONSTRUCTION = "Construction",
  HEALTHCARE = "Healthcare",
  SECURITY = "Security",
  UTILITIES = "Utilities",
  OTHER = "Other",
}

export enum CURRENCY {
  ETB = "ETB",
  USD = "USD",
}

export enum COUNTRY {
  ETHIOPIA = "Ethiopia",
  KENYA = "Kenya",
  TANZANIA = "Tanzania",
  UGANDA = "Uganda",
  SOUTH_AFRICA = "South Africa",
  NIGERIA = "Nigeria",
  GHANA = "Ghana",
  EGYPT = "Egypt",
  MOROCCO = "Morocco",
  OTHER = "Other",
}

export const CONTRACT_TYPE_OPTIONS = Object.entries(CONTRACT_TYPE).map(([key, value]) => ({
  label: value,
  value: value,
  description: getContractTypeDescription(value),
}));

export const TERM_TYPE_OPTIONS = Object.entries(TERM_TYPE).map(([key, value]) => ({
  label: value,
  value: value,
  description: getTermTypeDescription(value),
}));

export const SUPPLIER_SERVICE_OPTIONS = Object.entries(SUPPLIER_SERVICE).map(([key, value]) => ({
  label: value,
  value: value,
  description: getSupplierServiceDescription(value),
}));

export const CURRENCY_OPTIONS = Object.entries(CURRENCY).map(([key, value]) => ({
  label: value,
  value: value,
  description: getCurrencyDescription(value),
}));

export const COUNTRY_OPTIONS = Object.entries(COUNTRY).map(([key, value]) => ({
  label: value,
  value: value,
  description: getCountryDescription(value),
}));

function getContractTypeDescription(type: CONTRACT_TYPE): string {
  const descriptions: Record<CONTRACT_TYPE, string> = {
    [CONTRACT_TYPE.MSA]: "Master Service Agreement",
    [CONTRACT_TYPE.NDA]: "Non-Disclosure Agreement",
    [CONTRACT_TYPE.SOW]: "Statement of Work",
    [CONTRACT_TYPE.PO]: "Purchase Order",
    [CONTRACT_TYPE.LICENSE]: "Software or IP License Agreement",
    [CONTRACT_TYPE.EMPLOYMENT]: "Employment or Contractor Agreement",
    [CONTRACT_TYPE.LEASE]: "Real Estate or Equipment Lease",
    [CONTRACT_TYPE.PARTNERSHIP]: "Joint Venture or Partnership Agreement",
    [CONTRACT_TYPE.CONSULTING]: "Consulting Services Agreement",
    [CONTRACT_TYPE.OTHER]: "Any other type not listed above",
  };
  return descriptions[type];
}

function getTermTypeDescription(type: TERM_TYPE): string {
  const descriptions: Record<TERM_TYPE, string> = {
    [TERM_TYPE.FIXED]: "Contract has a fixed start and end date",
    [TERM_TYPE.EVERGREEN]: "Automatically renews unless terminated",
    [TERM_TYPE.AUTO_RENEWAL]: "Renews for a specified period unless notice is given",
    [TERM_TYPE.PERPETUAL]: "No end date; continues indefinitely",
    [TERM_TYPE.ROLLING]: "Renews continuously based on usage or time",
    [TERM_TYPE.TRIAL]: "Short-term trial period contract",
    [TERM_TYPE.ONE_TIME]: "Single-use or one-time agreement",
  };
  return descriptions[type];
}

function getSupplierServiceDescription(service: SUPPLIER_SERVICE): string {
  const descriptions: Record<SUPPLIER_SERVICE, string> = {
    [SUPPLIER_SERVICE.IT_SERVICES]: "Software development, IT support, cloud services",
    [SUPPLIER_SERVICE.CONSULTING]: "Business, legal, or management consulting",
    [SUPPLIER_SERVICE.LOGISTICS]: "Transportation, warehousing, and delivery services",
    [SUPPLIER_SERVICE.MANUFACTURING]: "Production of goods or components",
    [SUPPLIER_SERVICE.FACILITIES]: "Maintenance, cleaning, or building management",
    [SUPPLIER_SERVICE.MARKETING]: "Advertising, branding, or digital marketing services",
    [SUPPLIER_SERVICE.LEGAL]: "Legal advisory or representation services",
    [SUPPLIER_SERVICE.HR_SERVICES]: "Recruitment, payroll, or training services",
    [SUPPLIER_SERVICE.FINANCIAL]: "Accounting, auditing, or financial advisory",
    [SUPPLIER_SERVICE.CONSTRUCTION]: "Building, renovation, or infrastructure development",
    [SUPPLIER_SERVICE.HEALTHCARE]: "Medical services, equipment, or staffing",
    [SUPPLIER_SERVICE.SECURITY]: "Physical or cybersecurity services",
    [SUPPLIER_SERVICE.UTILITIES]: "Electricity, water, internet, or telecom services",
    [SUPPLIER_SERVICE.OTHER]: "Any service not covered by the above categories",
  };
  return descriptions[service];
}

function getCurrencyDescription(currency: CURRENCY): string {
  const descriptions: Record<CURRENCY, string> = {
    [CURRENCY.ETB]: "Ethiopian Birr",
    [CURRENCY.USD]: "US Dollar",
  };
  return descriptions[currency];
}

function getCountryDescription(country: COUNTRY): string {
  const descriptions: Record<COUNTRY, string> = {
    [COUNTRY.ETHIOPIA]: "Federal Democratic Republic of Ethiopia",
    [COUNTRY.KENYA]: "Republic of Kenya",
    [COUNTRY.TANZANIA]: "United Republic of Tanzania",
    [COUNTRY.UGANDA]: "Republic of Uganda",
    [COUNTRY.SOUTH_AFRICA]: "Republic of South Africa",
    [COUNTRY.NIGERIA]: "Federal Republic of Nigeria",
    [COUNTRY.GHANA]: "Republic of Ghana",
    [COUNTRY.EGYPT]: "Arab Republic of Egypt",
    [COUNTRY.MOROCCO]: "Kingdom of Morocco",
    [COUNTRY.OTHER]: "Other country not listed above",
  };
  return descriptions[country];
}

