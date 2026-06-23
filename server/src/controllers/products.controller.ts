import { Request, Response } from "express";
import { getProducts } from "../services/products.service";

export async function getProductsController(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 80);

    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : undefined;

    const cursor =
      typeof req.query.cursor === "string"
        ? req.query.cursor.trim()
        : undefined;

    const result = await getProducts({
      limit,
      category,
      cursor,
    });

    res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(result, (_, v) =>
            typeof v === "bigint" ? v.toString() : v,
          ),
        ),
      );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
