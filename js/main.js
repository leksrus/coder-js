const localkeys = {
  productStock: "stock-products",
  registerUsers: "registered-users",
  logedUser: "loged-user",
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
  constructor(id, username, firstname) {
    this.id = id;
    this.username = username;
    this.firstname = firstname;
  }
}

function preloadProducts() {
  const products = [];
  products.push(new Product(1, "Cpu Intel I5", "Some text..", 190.99, "/images/products/cpu-intel-i5.jpg"));
  products.push(new Product(2, "Keyboard HyperX", "Some text..", 19.99, "/images/products/mouse-redrgon-m711.jpg"));
  products.push(new Product(3, "Memory HyperX", "Some text..", 250.99, "/images/products/memory-hyperx.jpg"));
  products.push(new Product(4, "Mouse Redragon M610", "Some text..", 25.99, "/images/products/mouse-redrgon-m610.jpg"));
  products.push(new Product(5, "Keyboard Redragon K551", "Some text..", 27.99, "/images/products/keyboard-redragon-k551.jfif"));
  products.push(new Product(6, "MSI RTX 3080TI", "Some text..", 550.99, "/images/products/msi-rtx-3080ti.jpg"));
  products.push(new Product(7, "SSD Firecuda", "Some text..", 240.99, "/images/products/ssd-firecuda.jpg"));
  products.push(new Product(8, "Cpu Intel I5", "Some text..", 190.99, "/images/products/cpu-intel-i5.jpg"));
  products.push(new Product(9, "Keyboard HyperX", "Some text..", 19.99, "/images/products/mouse-redrgon-m711.jpg"));
  products.push(new Product(10, "Memory HyperX", "Some text..", 250.99, "/images/products/memory-hyperx.jpg"));
  products.push(new Product(11, "Mouse Redragon M610", "Some text..", 25.99, "/images/products/mouse-redrgon-m610.jpg"));
  products.push(new Product(12, "Keyboard Redragon K551", "Some text..", 27.99, "/images/products/keyboard-redragon-k551.jfif"));
  products.push(new Product(13, "MSI RTX 3080TI", "Some text..", 550.99, "/images/products/msi-rtx-3080ti.jpg"));
  products.push(new Product(14, "SSD Firecuda", "Some text..", 240.99, "/images/products/ssd-firecuda.jpg"));

  return products;
}

function loadRegisteredUsers() {
  const users = [];
  users.push(new User(1, "Leksus", "Aleksey"));
  users.push(new User(2, "Admin", "Admin"));

  setToLocalStorage(localkeys.registerUsers, users);
}

function loadProducts() {
  let productElement = document.getElementById("product-list");

  if (productElement) {
    const products = preloadProducts();
    setToLocalStorage(localkeys.productStock, products);
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

function loadProductsInHome() {
  let productElement = document.getElementById("product-list-home");

  if (productElement) {
    const products = preloadProducts();
    setToLocalStorage(localkeys.productStock, products);
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

function setToLocalStorage(key, item) {
  const storageItem = JSON.parse(localStorage.getItem(key));

  if (!storageItem) localStorage.setItem(key, JSON.stringify(item));
}

function loginUser() {
  const username = document.getElementById("uname");
  registerUsers = JSON.parse(localStorage.getItem(localkeys.registerUsers));

  if (username && registerUsers) {
    const user = registerUsers.find((x) => x.username === username.value);

    if (user) {
      setUpLogedUser(user);
      const logoutBtn = document.getElementById("sign-out");
      logoutBtn.addEventListener("click", logoutUser);

      return;
    }
  }
  username.parentNode.insertAdjacentHTML(
    "beforeend",
    `
    <label id="error" style="color: red;">User or password is incorrect</label>
    `
  );
}

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

  setToLocalStorage(localkeys.logedUser, user);
}

function checkLogedUser() {
  const storageUser = JSON.parse(localStorage.getItem(localkeys.logedUser));

  if (storageUser) setUpLogedUser(storageUser);
}

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
        res[value.id] = { id: value.id, name: value.name, price: value.price };
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

const cart = new Cart();
localStorage.setItem("products", JSON.stringify(cart.getProducts()));

function addProduct(elem) {
  const productItem = elem.parentNode.parentNode;
  const price = productItem.getElementsByClassName("price")[0].innerHTML;
  const name = productItem.getElementsByTagName("h3")[0].innerHTML;

  const product = new Product(productItem.id, name, parseFloat(price.replace("$", "")));
  const products = JSON.parse(localStorage.getItem("products"));
  cart.clearProducts();

  for (const p of products) {
    cart.addProduct(p);
  }

  cart.addProduct(product);
  localStorage.setItem("products", JSON.stringify(cart.getProducts()));
}

function showCart() {
  const main = document.getElementsByClassName("product-flex");
  main[0].innerHTML = JSON.stringify(cart.showCartItems());
}

const loginBtn = document.getElementById("login");
const cartBtn = document.getElementsByClassName("cart");

loginBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  loginUser();
});

loadProductsInHome();
loadProducts();
loadRegisteredUsers();
checkLogedUser();

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
