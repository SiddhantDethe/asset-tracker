//types/type.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  rating: { rate: number; count: number };
}

export type ActionState = {
  message: string | null;
  error: string | null;
};
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export type Review = {
  id: string;
  name: string;
  review: string;
  createdAt?: string;
};
export interface Filter {
  searchTerm: string;
  category: string;
}
// /types/type.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
 
}

export interface State {
  filtered: Product[];
  filter: Filter;
  empty: boolean;
}

export interface HeaderProps {
  onFilterChange: (filter: { searchTerm: string; category: string }) => void;
}

export interface Category {
  name: string;
  color: string; 
};


export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}


export type Action =
   { type: 'SET_FILTER'; payload: { searchTerm: string; category: string } }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FILTERED_PRODUCT'; payload: Product[] }
  | { type: 'SET_EMPTY' };

export type FilterContextInitialState = {state : State, dispatch : React.Dispatch<Action>};


export type GeneralError = {
  error: Error & { digest?: string };
  reset: () => void;
}

