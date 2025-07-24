// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem("so-cart-count", JSON.stringify(getLocalStorage("so-cart")?.length || 0));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (response.status !== 200) {
      throw new Error(`Failed to load template from ${path}: ${response.statusText}`);
    }
    let template = await response.text();
    return template;
    }
  catch (error) {
    throw new Error(`Error loading template from ${path}: ${error.message}`);
  }

}

export async function loadHeaderFooter () {
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const headerTemplate = await loadTemplate("/partials/header.html");
  const header = document.querySelector("#header");
  const footer = document.querySelector("#footer");
  renderWithTemplate(footerTemplate,footer);
  renderWithTemplate(headerTemplate,header);
  

}

export function calculateTotalWithDiscount(cartItems) {
  if (!Array.isArray(cartItems)) return 0;

  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice || 0), 0);

  if (cartItems.length >= 2) {
    return total * 0.9; // Apply 10% discount
  }

  return total;
}

export function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);

  // Calculate total with discount and log it (or display it in UI)
  const totalWithDiscount = calculateTotalWithDiscount(cartItems);
  console.log(`Total with discount (if applicable): $${totalWithDiscount.toFixed(2)}`);
}