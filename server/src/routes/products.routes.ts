import { Router } from "express";
import { getProductsController } from "../controllers/products.controller";

const router = Router();

router.get("/", getProductsController);

export default router;
