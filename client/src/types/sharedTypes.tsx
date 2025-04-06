export interface TenantDashboardProps {
  tenants: Tenant[];
  currentCardIndex: number;
  swipeHandlers: any;
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSendInvite: (id: string, firstName: string, lastName: string) => void;
}

export interface Tenant {
  firstName: string;
  lastName: string;
  userType: 'tenant' | 'landlord';
  email: string;
  mobileNumber: string;
  searchType: string;
  budget: string;
  bedrooms: string;
  bathrooms: string;
  leaseEndDate: string;
  desiredLocation?: string[];
  brokenLease?: string[];
  nonNegotiables?: string[];
  grossIncome: string;
  createdAt: string;
  _id: string
}

export interface Card {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
  newCard: string;
}

export interface DetailItemProps {
  label: string;
  value: React.ReactNode; // ✅ Accept JSX like <input />, <span>, text, number, etc.
  icon: React.ReactNode;
}
export interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  fetchTenants: (adminPassword: string) => Promise<void>;
  loading: boolean;
  error: string;
  isDataLoaded: boolean;
  tenants: any[];
  setTenants: React.Dispatch<React.SetStateAction<any[]>>;
  columns: any[];
  setColumns: React.Dispatch<React.SetStateAction<any[]>>;
}