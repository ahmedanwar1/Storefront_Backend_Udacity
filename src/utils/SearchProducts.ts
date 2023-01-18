import { ProductStore } from "../models/Product";
import { ProductReturnedType } from "../types/product";

const productStore = new ProductStore();

export default class SearchProducts {
  //get all products by category
  static getProductsByCategory = async (
    category: string
  ): Promise<ProductReturnedType[]> => {
    const products: ProductReturnedType[] = await productStore.indexByCategory(
      category
    );
    return products;
  };
}
