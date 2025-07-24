import ProductData from "./ProductData.mjs";
import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter }  from "./utils.mjs";
import {addProductToCart} from "./utils.mjs";

loadHeaderFooter();
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  const cartTotalContainer = document.querySelector(".cart-total");
  if (cartItems.length > 0) {
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
    cartTotalContainer.innerHTML = `
      <div class="cart-total__summary">
        <h3>Total: $${totalAmount.toFixed(2)}</h3>
        <button class="checkout-btn">Checkout</button>
      </div>
    `;
    cartTotalContainer.style.display = "block"; // Show the total section
  } else {
    cartTotalContainer.style.display = "none"; // Hide if no items
  }
  addCartButtonListener();

}

function cartItemTemplate(item) {

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
      
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">${item.quantity}</p>
  <button class="cart-card__add" data-product-id="${item.Id}">Add to Cart</button>
  <button class="cart-card__remove" data-product-id="${item.Id}">Remove</button>
  <p class="cart-card__price">$${item.FinalPrice * item.quantity}</p>
  
</li>`;

  return newItem;
}

function addCartButtonListener() {
  const addButtons = document.querySelectorAll(".cart-card__add");
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const productId = button.getAttribute("data-product-id");
      const cartItems = getLocalStorage("so-cart") || [];
      const product = cartItems.find(item => item.Id === productId);
      if (product) {
        product.quantity += 1; // Increment quantity if product already in cart
      }
      localStorage.setItem("so-cart", JSON.stringify(cartItems));  
      renderCartContents(); // Re-render the cart contents
    });
  });
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const productId = button.getAttribute("data-product-id");
      let cartItems = getLocalStorage("so-cart") || [];
      let current_storage = cartItems.filter(item => item.Id != productId);
      const product = cartItems.find(item => item.Id === productId);
      if (product && product.quantity > 1) {
        product.quantity -= 1; // Decrement quantity if more than 1
        current_storage.push(product);
      }
      cartItems = current_storage;
      localStorage.setItem("so-cart", JSON.stringify(cartItems));
      renderCartContents(); // Re-render the cart contents
    });
  }); 
}
async function addToCartHandler(e) {
  const productId = e.target?.dataset?.id;
  if (!productId) return;

  const product = await ProductData.findProductById(e.target.dataset.id);
  addProductToCart(product); // ✅ This is necessary
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("addToCart");
  if (btn) {
    btn.addEventListener("click", addToCartHandler); // ✅ USING the handler
  }
});

renderCartContents();
