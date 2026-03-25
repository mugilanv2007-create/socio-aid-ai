export type OccupationType =
  | 'govt_100_days'
  | 'cook'
  | 'student'
  | 'farmer'
  | 'private_job'
  | 'government_job'
  | 'business'
  | 'unemployed';

export type HealthCategory =
  | 'disability'
  | 'critical_disease'
  | 'chronic_disease'
  | 'maternal_health'
  | 'senior_citizen'
  | 'special_category'
  | 'infectious_disease'
  | 'general_health';

export type CasteCategory = 'SC' | 'ST' | 'OBC' | 'MBC' | 'BC' | 'General';

export type EducationStatus =
  | 'uneducated'
  | 'primary'
  | 'middle'
  | 'high_school'
  | 'higher_secondary'
  | 'diploma'
  | 'graduate'
  | 'post_graduate'
  | 'professional';

export type SchemeCategory =
  | 'education'
  | 'health'
  | 'business'
  | 'women_child'
  | 'senior_citizen'
  | 'housing'
  | 'agriculture'
  | 'employment'
  | 'welfare';

export interface FamilyMember {
  id: string;
  name: string;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  relationship: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  caste: CasteCategory;
  education: EducationStatus;
  occupation: OccupationType;
  occupationDetail?: string;
  annualIncome: number;
  healthCategory: HealthCategory;
  healthDetails?: string;
}

export interface RationCard {
  rationCardNumber: string;
  type: 'AAY' | 'PHH' | 'NPHH';
  headOfFamily: string;
  address: string;
  district: string;
  state: string;
  mobileNumber: string;
  annualIncome: number;
  members: FamilyMember[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameTamil?: string;
  category: SchemeCategory;
  description: string;
  eligibility: SchemeEligibility;
  benefits: string;
  targetGroup: string[];
  documentsRequired: DocumentRequirement[];
  applicationSteps: ApplicationStep[];
  priority: number;
  isActive: boolean;
}

export interface SchemeEligibility {
  maxIncome?: number;
  minAge?: number;
  maxAge?: number;
  caste?: CasteCategory[];
  education?: EducationStatus[];
  occupation?: OccupationType[];
  healthCategory?: HealthCategory[];
  gender?: ('male' | 'female' | 'other')[];
  rationCardType?: ('AAY' | 'PHH' | 'NPHH')[];
}

export interface DocumentRequirement {
  name: string;
  type: 'original' | 'copy' | 'both';
  quantity: number;
  mandatory: boolean;
  description?: string;
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
  location?: string;
  onlineUrl?: string;
}

export interface SchemeRecommendation {
  scheme: GovernmentScheme;
  eligibilityScore: number;
  priorityRank: number;
  matchedCriteria: string[];
  memberMatch: string[];
  saved?: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  rationCard: RationCard | null;
  recommendations: SchemeRecommendation[];
  savedSchemes: string[];
  notifications: Notification[];
  healthScore: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
}
