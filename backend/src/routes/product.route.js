import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import {
  createProduct,
  getReviews,
  addReviews,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  getWishlistProducts,
  productAddToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

import {
  getCartProducts,
  addProductToCart,
  removeProductFromCart,
  updateSize,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadImages } from "../controllers/upload.controller.js";
const productRouter = Router();

productRouter.route("/api/products").get(getAllProducts);
productRouter
  .route("/api/admin/products")
  .post(authMiddleware, adminMiddleware, createProduct);
productRouter
  .route("/api/admin/products/:productId")
  .put(authMiddleware, adminMiddleware, updateProduct);
// wishlist product routes
productRouter
  .route("/api/wishlist-products")
  .post(authMiddleware, getWishlistProducts);

productRouter
  .route("/api/add-to-wishlist/:id")
  .post(authMiddleware, productAddToWishlist);

productRouter
  .route("/api/remove-from-wishlist/:id")
  .post(authMiddleware, removeFromWishlist);

// Cart product routes
productRouter.route("/api/cart-products").post(authMiddleware, getCartProducts);
productRouter
  .route("/api/add-to-cart/:id")
  .post(authMiddleware, addProductToCart);
productRouter
  .route("/api/remove-from-cart/:id")
  .post(authMiddleware, removeProductFromCart);

// Update size and quantity for cart items
productRouter.route("/api/update-size").post(authMiddleware, updateSize);
productRouter
  .route("/api/update-quantity")
  .post(authMiddleware, updateQuantity);

// Image upload endpoint for admin - accepts multipart form-data 'images' field
productRouter
  .route("/api/admin/upload-images")
  .post(authMiddleware, adminMiddleware, upload.array("images"), uploadImages);

productRouter.route("/api/reviews").post(authMiddleware, getReviews);

productRouter
  .route("/api/user/upload-images")
  .post(authMiddleware, upload.array("images"), uploadImages);

productRouter.route("/api/add-review").post(authMiddleware, addReviews);

export default productRouter;
