import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter }  from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");
const productID = getParam("product");
console.log("Product ID from URL:", productID);
const product = new ProductDetails(productID, dataSource);
product.init();
console.log(product);
