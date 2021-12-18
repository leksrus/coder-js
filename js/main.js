//local storage key variables
const localkeys = {
  productStock: "stock-products",
  registerUsers: "registered-users",
  logedUser: "loged-user",
  cartProducts: "cart-products",
};

class Product {
  constructor(id, name, description, price, imgSrc) {
    this.id = id;
    this.name = name;
    this.desctiption = description;
    this.price = price;
    this.imgSrc = imgSrc;
  }
}

class User {
  constructor(id, username, firstname, lastname, password) {
    this.id = id;
    this.username = username;
    this.lastname = lastname;
    this.firstname = firstname;
    this.password = password;
  }
}

//avaiable products

function preloadProducts(routePrefix) {
  const products = [];
  products.push(new Product(1, "Cpu Intel I5", "Some text..", 190.99, `${routePrefix}/images/products/cpu-intel-i5.jpg`));
  products.push(new Product(2, "Keyboard HyperX", "Some text..", 19.99, `${routePrefix}/images/products/mouse-redrgon-m711.jpg`));
  products.push(new Product(3, "Memory HyperX", "Some text..", 250.99, `${routePrefix}/images/products/memory-hyperx.jpg`));
  products.push(new Product(4, "Mouse Redragon M610", "Some text..", 25.99, `${routePrefix}/images/products/mouse-redrgon-m610.jpg`));
  products.push(new Product(5, "Keyboard Redragon K551", "Some text..", 27.99, `${routePrefix}/images/products/keyboard-redragon-k551.jfif`));
  products.push(new Product(6, "MSI RTX 3080TI", "Some text..", 550.99, `${routePrefix}/images/products/msi-rtx-3080ti.jpg`));
  products.push(new Product(7, "SSD Firecuda", "Some text..", 240.99, `${routePrefix}/images/products/ssd-firecuda.jpg`));
  products.push(new Product(8, "Cpu Intel I5", "Some text..", 190.99, `${routePrefix}/images/products/cpu-intel-i5.jpg`));
  products.push(new Product(9, "Keyboard HyperX", "Some text..", 19.99, `${routePrefix}/images/products/mouse-redrgon-m711.jpg`));
  products.push(new Product(10, "Memory HyperX", "Some text..", 250.99, `${routePrefix}/images/products/memory-hyperx.jpg`));
  products.push(new Product(11, "Mouse Redragon M610", "Some text..", 25.99, `${routePrefix}/images/products/mouse-redrgon-m610.jpg`));
  products.push(new Product(12, "Keyboard Redragon K551", "Some text..", 27.99, `${routePrefix}/images/products/keyboard-redragon-k551.jfif`));
  products.push(new Product(13, "MSI RTX 3080TI", "Some text..", 550.99, `${routePrefix}/images/products/msi-rtx-3080ti.jpg"`));
  products.push(new Product(14, "SSD Firecuda", "Some text..", 240.99, `${routePrefix}/images/products/ssd-firecuda.jpg`));

  return products;
}

//preload existant users for login
function loadRegisteredUsers() {
  const users = [];
  users.push(new User(1, "Leksus", "Aleksey", "Kotylev", "123456"));
  users.push(new User(2, "Admin", "Admin", "Admin", "Admin123"));

  setToLocalStorage(localkeys.registerUsers, users, false);
}

//load productos for products page
function loadProducts() {
  let productElement = document.getElementById("product-list");

  if (productElement) {
    const products = preloadProducts("..");
    setToLocalStorage(localkeys.productStock, products, false);
    productElement.innerHTML = "";

    for (const product of products) {
      productElement.insertAdjacentHTML(
        "beforeend",
        `
      <div class="card-list font-varela">
        <img class="product-img" src="${product.imgSrc}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <p>${product.desctiption}</p>
        <p><button id="${product.id}" class="btn">Add to Cart</button></p>
      </div>
      `
      );
    }
  }
}

//load productos in home

function loadProductsInHome() {
  let productElement = document.getElementById("product-list-home");

  if (productElement) {
    const products = preloadProducts(".");
    setToLocalStorage(localkeys.productStock, products, false);
    productElement.innerHTML = "";

    for (const product of products) {
      productElement.insertAdjacentHTML(
        "beforeend",
        `
      <div class="card-list font-varela">
        <img class="product-img" src="${product.imgSrc}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <p>${product.desctiption}</p>
      </div>
      `
      );
    }
  }
}

//set variables in localstorage
function setToLocalStorage(key, item, override) {
  const storageItem = JSON.parse(localStorage.getItem(key));

  if (override || !storageItem) localStorage.setItem(key, JSON.stringify(item));
}

//user login
function loginUser() {
  const userName = document.getElementById("uname");
  const pass = document.getElementById("password");
  const registerUsers = JSON.parse(localStorage.getItem(localkeys.registerUsers));

  if (userName && pass && registerUsers) {
    const user = registerUsers.find((x) => x.username === userName.value && x.password === pass.value);

    if (user) {
      setUpLogedUser(user);
      const logoutBtn = document.getElementById("sign-out");
      logoutBtn.addEventListener("click", logoutUser);

      return;
    }
  }

  const message = document.getElementById("message");

  message?.parentNode.removeChild(message);

  userName.parentNode.insertAdjacentHTML(
    "beforeend",
    `
    <label id="message" style="color: red;">User or password is incorrect</label>
    `
  );
}

//register a user
function registerUser() {
  const firstName = document.getElementById("fname");
  const lastName = document.getElementById("lname");
  const userName = document.getElementById("uname");
  const password = document.getElementById("password");
  const repeatedPassword = document.getElementById("rpassword");
  const message = document.getElementById("message");
  message?.parentNode.removeChild(message);

  if (firstName.value && lastName.value && userName.value && password.value && repeatedPassword.value) {
    if (password.value === repeatedPassword.value) {
      const users = JSON.parse(localStorage.getItem(localkeys.registerUsers));
      const lastUserId = Math.max(...users.map((u) => u.id));
      const user = new User(lastUserId + 1, userName.value, firstName.value, lastName.value, password.value);
      users.push(user);
      setToLocalStorage(localkeys.registerUsers, users, true);

      firstName.parentNode.insertAdjacentHTML(
        "beforeend",
        `
        <label id="message" style="color: green;">Register successful</label>
        `
      );

      return;
    }
    firstName.parentNode.insertAdjacentHTML(
      "beforeend",
      `
      <label id="message" style="color: red;">Passwords does not match</label>
      `
    );

    return;
  }
  firstName.parentNode.insertAdjacentHTML(
    "beforeend",
    `
    <label id="message" style="color: red;">Ingress data for register the user correctly</label>
    `
  );
}

//user visalization in nav bar

function setUpLogedUser(user) {
  let signUl = document.getElementsByClassName("menu");
  let signUp = document.getElementsByClassName("button");
  let signIn = document.getElementsByClassName("button-secondary");
  let errorElement = document.getElementById("error");
  if (errorElement) username.parentNode.removeChild(errorElement);
  signUl[0].removeChild(signUp[0]);
  signUl[0].removeChild(signIn[0]);
  signUl[0].insertAdjacentHTML(
    "beforeend",
    `
      <li class="size-18 login">
        <div class="login">
          <p>User:&nbsp;</p>
          <p> ${user.username}</p>
        </div>
        
        <a id="sign-out" class="sign-out" href="#">Sign Out</a>
      </li>
  `
  );

  setToLocalStorage(localkeys.logedUser, user, true);
}

//preload user on navigation between pages
function checkLogedUser() {
  const storageUser = JSON.parse(localStorage.getItem(localkeys.logedUser));

  if (storageUser) setUpLogedUser(storageUser);
}

//log out user
function logoutUser() {
  let signUl = document.getElementsByClassName("menu");
  let login = document.getElementsByClassName("login");
  signUl[0].removeChild(login[0]);
  signUl[0].insertAdjacentHTML(
    "beforeend",
    `
    <li class="button"><a href="signin.html">Sign In</a></li>
    <li class="button-secondary">
      <a href="signup.html">Sign Up</a>
    </li>
  `
  );
  localStorage.removeItem(localkeys.logedUser);
}

class Cart {
  products = [];

  addProduct(product) {
    this.products.push(product);
  }

  revomePoduct(product) {
    const prod = this.products.find((x) => x.id === product.id);

    if (prod === undefined) return;

    this.products.shift(product);
  }

  getProducts() {
    return this.products;
  }

  getTotalProductsPrice() {
    let totalPrice = 0.0;
    for (const product of this.products) {
      totalPrice += product.price;
    }

    return totalPrice;
  }

  showCartItems() {
    if (this.products.length === 0) return;

    const result = [];
    this.products.reduce((res, value) => {
      if (!res[value.id]) {
        res[value.id] = {
          id: value.id,
          name: value.name,
          description: value.description,
          price: value.price,
          imgSrc: value.imgSrc,
        };
        result.push(res[value.id]);
      }
      res[value.id].price += value.price;
      return res;
    }, {});

    return result;
  }

  clearProducts() {
    this.products = [];
  }
}

//add product list to cart and retain it in localstorage
function addProduct(productId) {
  const cart = setUpCartObject();
  const stockProducts = JSON.parse(localStorage.getItem(localkeys.productStock));

  if (stockProducts) {
    const product = stockProducts.find((x) => x.id === productId);

    if (product) {
      cart.addProduct(product);
      setToLocalStorage(localkeys.cartProducts, cart.getProducts(), true);
    }
  }
}

//typificate Cart object
function setUpCartObject() {
  const cart = new Cart();
  const storageProducts = JSON.parse(localStorage.getItem(localkeys.cartProducts));

  if (storageProducts) {
    for (const p of storageProducts) {
      cart.addProduct(p);
    }
  }

  return cart;
}

//show products items in cart
function showCart() {
  const cartListElment = document.getElementById("cart-items");

  if (cartListElment) {
    const cartProductElements = cartListElment.getElementsByClassName("cart-flex");

    if (cartProductElements || cartProductElements.length > 0) {
      for (const e of cartProductElements) {
        cartListElment.removeChild(e);
      }
    }

    const cart = setUpCartObject();

    if (cart) {
      const cartProductSplat = cart.showCartItems();

      for (const product of cartProductSplat) {
        const count = cart.getProducts().filter((x) => x.id === product.id).length;
        cartListElment.insertAdjacentHTML(
          "beforeend",
          `
          <div class="cart-flex">
            <div class="cart-product-image"><img class="product-img" src="${product.imgSrc}" alt="${product.name}" /></div>
            <div class="cart-product-description"><h3>${product.name}</h3></div>
            <div class="cart-product-price">${product.price}</div>
            <div class="cart-counter">
              <div class="btn-cart">+</div>
              <div class="count">${count}</div>
              <div class="btn-cart">-</div>
            </div>
            <button class="btn-remove">Remove item</button>
        </div>
  `
        );
      }
    }
  }
}

//bind click evento to add to cart in product lista
function productAddBind() {
  const divElement = document.getElementById("product-list");

  if (divElement) {
    for (const button of divElement.getElementsByClassName("btn")) {
      button.addEventListener("click", function (e) {
        addProduct(parseInt(button.id));
      });
    }
  }
}

const loginBtn = document.getElementById("login");
const registr = document.getElementById("register");

loginBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  loginUser();
});

registr?.addEventListener("click", function (e) {
  e.preventDefault();
  registerUser();
});

loadProductsInHome();
loadProducts();
loadRegisteredUsers();
checkLogedUser();
productAddBind();
showCart();

// function calculateDispatchPrice(zipCode) {
//   let dipatchPrice = 0.0;
//   switch (true) {
//     case zipCode < 1000:
//       dipatchPrice = 100.0;
//       break;

//     case zipCode >= 1000 && zipCode <= 2000:
//       dipatchPrice = 200.0;
//       break;

//     case zipCode > 2000:
//       dipatchPrice = 300.0;
//       break;

//     default:
//       break;
//   }

//   return dipatchPrice;
// }

// function getDiscount(cart) {
//   let discount = 0.0;
//   const products = cart.getProducts();

//   for (const product of products) {
//     if (product.price > 1000) discount += 50.25;

//     if (product.price > 10000) discount += 99.99;
//   }

//   return discount;
// }

// function checkOut(cart, zipCode) {
//   const products = cart.getProducts();
//   const productPrice = cart.getTotalProductsPrice();
//   const dispatchCost = calculateDispatchPrice(zipCode);
//   const discount = getDiscount(cart);
//   const totalToPay = productPrice + dispatchCost - discount;

//   let productsName = "";
//   cart.showCartItems().forEach((element, index) => {
//     if (index < products.length - 1) productsName += element.name + ", ";
//     else productsName += element.name;
//   });

//   console.log(cart.showCartItems());

//   alert(
//     `Estimado ${firstname} ${lastname}. Total a pagar ${totalToPay} con estos productos: ${productsName}`
//   );
// }
