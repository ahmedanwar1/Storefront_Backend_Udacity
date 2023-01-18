import express from "express";
import { ProductStore } from "../models/Product";
import { ProductReturnedType } from "../types/product";
import AppError from "../utils/AppError";
import SearchProducts from "../utils/SearchProducts";

const productStore = new ProductStore();

//get all products
const getAllProducts = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const category = req.query.category;
    let products: ProductReturnedType[] = [];

    products = category
      ? await SearchProducts.getProductsByCategory(category as string)
      : await productStore.index();

    if (products.length == 0) {
      return res.status(404).json(products);
    }

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

//get product by id
const getProductById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const id: string = req.params.id;
    const product: ProductReturnedType = await productStore.show(id);

    if (!product) {
      return res.status(404).json(product);
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

//create product
const createProduct = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const name: string = req.body.name;
    const price: number = req.body.price;
    const category: string = req.body.category;

    if (!name || !price || !category) {
      throw new AppError(
        "Missing data! Please provide all required data.",
        400
      );
    }

    const product: ProductReturnedType = await productStore.create({
      name,
      price,
      category,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export { getAllProducts, createProduct, getProductById };
