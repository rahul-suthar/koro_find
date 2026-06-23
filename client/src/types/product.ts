export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}
