export type OrderedProduct = {
  id: number | string;
  quantity: number;
  name?: string;
  price?: number | string;
};

export type OrderBase = { user_id: number; status: OrderStatus };

export type OrderReturnedType = OrderBase & {
  id: number | string;
  products?: OrderedProduct[];
};

export type Order = OrderBase & {
  products: OrderedProduct[];
};
