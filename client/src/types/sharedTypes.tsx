
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
  value: React.ReactNode;
  icon: React.ReactNode;
}
export interface AuthContextType {
  frontendZipCodes: string[];
  zipCodes: ZipCode[];
  searchedResults: Record<string, any>;
  fetchSearchedResults: (searchTerm: string) => Promise<void>;
  authenticated: boolean;
  fetchListings: () => Promise<void>;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  fetchTenants: (adminPassword: string) => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  isDataLoaded: boolean;
  tenants: any[];
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  neighborhoods: string[];
  setTenants: React.Dispatch<React.SetStateAction<any[]>>;
  columns: any[];
  setColumns: React.Dispatch<React.SetStateAction<any[]>>;
}

export type CardLabel = {
  _id: string;
  name: string;
  color: string;
  isActive?: boolean;
};

export interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TenantSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredTenants: Tenant[];
  onTenantSelect: (tenantId: string) => void;
}

export interface Movement {
  _id: string;
  fromColumn: string;
  toColumn: string;
  movedAt: string | Date;
  userName?: string;
  cardName?: string;
}

export interface ActivityLogProps {
  movements: Movement[];
  title?: string;
  emptyMessage?: string;
  maxHeight?: string;
  userDisplayName?: string;
  showHeader?: boolean;
  className?: string;
}

export interface Label {
  _id: string;
  name: string;
  color: string;
  isPredefined?: boolean;
}

export interface CardLabel2 {
  _id: string;
  labelId: Label | string;
  isActive: boolean;
  customName?: string;
}

export interface LabelManagerProps {
  cardId: string;
}

export interface ListingFormData {
  title: string;
  destinationURL: string;
}

export interface ApiResponse {
  message: string;
  data?: {
    id: string;
    title: string;
    destinationURL: string;
    status: string;
    createdAt: string;
  };
  error?: string;
}



export interface Listing {
  phone: any;
  specials: string;
  _id: string;
  destinationURL: string;
  lastScrapeInfo: string;
  createdAt: string;
  updatedAt: string;
  rental_type: string;
  available_units: AvailableUnit[] | null;
  Information?: {
    neighborhood?: string;
  };
}

export interface ZipCode {
  PropertyId: string;
  PropertyZip: string;
  PropertyDisplayName: string;
  PropertyNeighborhood: string | null;
}

interface AvailableUnit {
  id: number;
  name: string;
  bed: number;
  bath: number;
  sqft: number;
  price: number;
  units: Unit[];
}

interface Unit {
  id: number;
  name: string;
  price: number;
  sqft: number;
  availability: string;
  available_on: string;
  display_name: string;
}
