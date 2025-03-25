// types.ts
export interface Tenant {
  firstName: string;
  lastName: string;
  userType: 'tenant' | 'landlord';
  email: string;
  mobileNumber: string;
  searchType: string;
  budget: string;
  bedrooms: number;
  bathrooms: number;
  leaseEndDate: string;
  desiredLocation?: string[];
  brokenLease?: string[];
  nonNegotiables?: string[];
  grossIncome: string;
  createdAt: string;
  _id: string
}
