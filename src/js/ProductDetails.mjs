export default class Product {
  constructor(productId, dataSource){
  this.productId = productId;
  this.product = {};
  this.dataSource = dataSource;
  this.product.quantity = 1;
}
    async init() {
      this.product = await this.dataSource.findProductById(this.productId);
      this.product.quantity = 1; // Default quantity
    

    if (this.product) {
      this.renderProductDetails();
    } else {
      console.error(`Product with ID ${this.productId} not found.`);
    }
  }
  addProductToCart() {
    console.log("Adding product to cart:", this.product);
    let cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
    if (!Array.isArray(cartItems) && cartItems !== null) {
      cartItems = [cartItems];
    }
    const existingProduct = cartItems.find(item => item.Id === this.product.Id);

    if (existingProduct) {  
      existingProduct.quantity += 1; // Increment quantity if product already in cart
    } else {
      cartItems.push(this.product); // Add new product to cart
    }
    localStorage.setItem("so-cart", JSON.stringify(cartItems));
  }

  renderProductDetails() {
    const productDetails = document.querySelector(".product-detail");
    if (!productDetails) {
      console.log("Product details container not found in DOM.");
      return;
    }

    productDetails.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>

      <h2 class="divider">${this.product.NameWithoutBrand}</h2>

      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.NameWithoutBrand}"
      />

      <p class="product-card__price">$${this.product.FinalPrice}</p>

      <p class="product__color">${this.product.Colors[0].ColorName}</p>

      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>

      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
    document.getElementById("addToCart").addEventListener("click", () => this.addProductToCart());
  }
}