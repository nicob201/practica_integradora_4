import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  renderProductsService
} from "../services/productService.js";
import { generateProductErrorInfo } from "../services/info.js";
import EErrors from "../services/enums.js";

// Devuelve todos los productos de la base de datos
async function getProducts(req, res) {
  try {
    const { sort, limit, page, category } = req.query;
    const { result, categories } = await getProductsService({ sort, limit, page, category });

    const baseUrl = `/products?limit=${limit}&sort=${sort || ""}&category=${category || ""}`;

    // Estructura de la respuesta del server
    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null,
      categories: categories
    };

    res.json(response);
  } catch (error) {
    console.log("Error fetching products!", error);
    res.status(500).send({ status: "error", error: "Failed to fetch products!" });
  }
}

// Devuelve un producto por su ID
async function getProductById(req, res) {
  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) {
      return res.status(404).send({ status: "error", error: "Product not found!" });
    }
    res.send(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).send({ status: "error", error: "Failed to get product!" });
  }
}

// Crea un nuevo producto
async function createProduct(req, res) {
  try {
    const { title, description, price, thumbnail, code, status, stock } = req.body;

    // Validación de campos
    if (!title || typeof title !== 'string' || !price || typeof price !== 'number' || !stock || typeof stock !== 'number') {
      const errorInfo = generateProductErrorInfo({ title, price, stock });
      const error = new Error(errorInfo);
      error.code = EErrors.INVALID_TYPES_ERROR;
      throw error;
    }

    const result = await createProductService({ title, description, price, thumbnail, code, status, stock });
    res.send({ result: "Product created ok!", payload: result });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.code === EErrors.INVALID_TYPES_ERROR) {
      res.status(400).send({ status: "error", error: error.message });
    } else {
      res.status(500).send({ status: "error", error: "Failed to create the product!" });
    }
  }
}


// Actualiza un producto existente
async function updateProduct(req, res) {
  try {
    const { pid } = req.params;
    const productToReplace = req.body;

    // Validación de campos
    if (!productToReplace.title || typeof productToReplace.title !== 'string' || !productToReplace.price || typeof productToReplace.price !== 'number' || !productToReplace.stock || typeof productToReplace.stock !== 'number') {
      const errorInfo = generateProductErrorInfo(productToReplace);
      const error = new Error(errorInfo);
      error.code = EErrors.INVALID_TYPES_ERROR;
      throw error;
    }

    const result = await updateProductService(pid, productToReplace);
    res.send({ result: "Product edited!", payload: result });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error.code === EErrors.INVALID_TYPES_ERROR) {
      res.status(400).send({ status: "error", error: error.message });
    } else {
      res.status(500).send({ status: "error", error: "Failed to update the product!" });
    }
  }
}

// Elimina un producto
async function deleteProduct(req, res) {
  const { pid } = req.params;
  try {
    const result = await deleteProductService(pid);
    res.status(200).send({ result: "Product deleted!", payload: result });
  } catch (error) {
    console.log("Error deleting product!:", error);
    res.status(500).send({ status: "error", error: "Failed to delete the product!" });
  }
}

// Renderiza los productos en el front
async function renderProducts(req, res) {
  const { sort, limit, page, category } = req.query;

  try {
    const result = await renderProductsService({ sort, limit, page, category });
    const user = req.session.user;

    res.render("products", {
      products: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      sort,
      categories: result.categories,
      user,
    });
  } catch (error) {
    console.log("Error fetching products!", error);
    res.status(500).send({ status: "error", error: "Failed to fetch products!" });
  }
}

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderProducts,
};
