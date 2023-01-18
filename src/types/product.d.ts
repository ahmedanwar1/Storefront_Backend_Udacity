export type Product = {
  name: string;
  price: number;
  category?: string;
};
export type ProductReturnedType = {
  id: number;
  name: string;
  price: number | string;
  category?: string;
};
