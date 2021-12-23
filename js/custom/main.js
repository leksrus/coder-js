//local storage key variables
const localkeys = {
  productStock: "stock-products",
  registerUsers: "registered-users",
  logedUser: "loged-user",
  cartProducts: "cart-products",
};

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

//set variables in localstorage
function setToLocalStorage(key, item, override) {
  const storageItem = JSON.parse(localStorage.getItem(key));

  if (override || !storageItem) localStorage.setItem(key, JSON.stringify(item));
}

//load productos for products page
function loadProducts() {
  const productsSection = $("#product-list-section > .row");

  if (productsSection.length > 0) {
    const products = preloadProducts("..");
    setToLocalStorage(localkeys.productStock, products, true);
    productsSection.empty();

    for (const product of products) {
      productsSection.append(
        `
      <div class="col-12 col-md-4 col-lg-3">
        <div class="card text-dark bg-light mb-5 transition">
          <img class="card-img-top image-min-height-315" src="${product.imgSrc}" alt="${product.name}" />
          <div class="card-body font-varela">
            <h5 class="card-title text-center"><b>${product.name}</b></h5>
            <p class="card-text text-center cart-product-price">${product.price}</p>
            <p class="card-text">${product.desctiption}</p>
            <button id="${product.id}" class="btn-custom">Add to Cart</button>
          </div>
        </div>
      </div>
      `
      );
      productsSection.find(`#${product.id}`).click(() => {
        addProduct(parseInt(this.event.target.id));
      });
    }
  }
}

//load productos in home
function loadProductsInHome() {
  const productsSection = $("#product-home-section > .row");

  if (productsSection.length > 0) {
    const products = preloadProducts(".");
    setToLocalStorage(localkeys.productStock, products, true);
    productsSection.empty();

    for (const product of products) {
      productsSection.append(
        `
      <div class="col-12 col-md-4 col-lg-3">
        <div class="card text-dark bg-light mb-5 transition">
          <img class="card-img-top image-min-height-315" src="${product.imgSrc}" alt="${product.name}" />
          <div class="card-body font-varela">
            <h5 class="card-title text-center"><b>${product.name}</b></h5>
            <p class="card-text text-center cart-product-price">${product.price}</p>
            <p class="card-text">${product.desctiption}</p>
          </div>
        </div>
      </div>
      `
      );
    }
  }
}

//user visalization in nav bar
function setUpLogedUser(user) {
  const userSection = $("#user-section");

  if (userSection.length > 0) {
    $("#user-section > a.btn.btn-outline-primary, #user-section > a.btn.btn-outline-success").remove();

    userSection.append(
      `
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <b>Username:</b> ${user.username}
        </button>
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
          <li><a id="sign-out" class="dropdown-item" href="#">Sign out</a></li>
        </ul>
    </div>
    `
    );
    setToLocalStorage(localkeys.logedUser, user, true);
  }
}

//preload user on navigation between pages
function checkLogedUser() {
  const storageUser = JSON.parse(localStorage.getItem(localkeys.logedUser));

  if (storageUser) setUpLogedUser(storageUser);
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
      showItemsCuantity();
    }
  }
}

//load cart items quantity
function showItemsCuantity() {
  const cartItemsCountElement = $("#card-items-count");

  if (cartItemsCountElement.length > 0) {
    const cart = setUpCartObject();
    cartItemsCountElement.text(`${cart.showCartItems()?.length || 0}`);
  }
}

// show my cart
function showCart() {
  const cartElment = $("#cart-list");

  if (cartElment.length > 0) {
    const cartItemElements = $("#cart-list > .align-items-start");
    cartItemElements.remove();
    const hrElement = $("#cart-list > hr").first().next();
    const cart = setUpCartObject();

    if (cart && cart.getProducts().length > 0) {
      const cartProductSplat = cart.showCartItems();

      for (const product of cartProductSplat) {
        const count = cart.getProducts().filter((x) => x.id === product.id).length;
        hrElement.before(
          `
          <div class="row align-items-start">
          <div class="col-12">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-3 col-md-3 col-lg-3">
                  <img class="img-fluid rounded-start cart-image-min-height-150" src="${product.imgSrc}" alt="${product.name}"  />
                </div>
                <div class="col-9 col-md-7 col-lg-7">
                  <div class="card-body font-varela">
                    <h5 class="card-title"><b>${product.name}</b></h5>
                    <p class="card-text">Some text Some text Some texts Some text Some text Some text.</p>
                    <p class="card-text cart-product-price">${product.price}</p>
                    <div class="d-flex align-items-center justify-content-center">
                      <div class="btn-cart">+</div>
                      <div class="count">${count}</div>
                      <div class="btn-cart">-</div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-2 col-lg-2">
                  <div class="card-body">
                    <div class="d-flex align-items-end flex-column">
                      <div class="p-2 flex-grow-1">
                        <a id="${product.id}" class="btn btn-outline-danger col-12" href="#" role="button">Remove</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          `
        );

        //bind event to remove item from cart
        cartElment.find(`#${product.id}`).click(() => {
          $("#cart-list").find(`#${this.event.target.id}`).closest(".row.align-items-start").remove();
          removeProductFromCart(parseInt(this.event.target.id));
        });
      }
    }
  }
}

//remove items from cart
function removeProductFromCart(productId) {
  const cart = setUpCartObject();

  if (cart && cart.getProducts().length > 0) {
    const product = cart.getProduct(productId);

    if (product) {
      cart.revomePoduct(product);
      setToLocalStorage(localkeys.cartProducts, cart.getProducts(), true);
      showItemsCuantity();
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

$(() => {
  loadRegisteredUsers();
  loadProductsInHome();
  loadProducts();
  showItemsCuantity();
  showCart();
  checkLogedUser();

  //user login
  $("#signin").click((e) => {
    e.preventDefault();
    const userName = $("#uname").val();
    const pass = $("#password").val();
    const registerUsers = JSON.parse(localStorage.getItem(localkeys.registerUsers));

    if (userName && pass && registerUsers) {
      const user = registerUsers.find((x) => x.username === userName && x.password === pass);

      if (user) {
        setUpLogedUser(user);
        $(location).prop("href", "/");
        return;
      }
    }

    const message = $("#message");

    message?.remove();

    $("#password")
      .parent()
      .append(
        `
      <label id="message" class="form-label font-mukta" style="color: red;" >Error. Username or password is incorrect</label>
      `
      );
  });

  //register a user
  $("#signup").click((e) => {
    e.preventDefault();
    const firstName = $("#fname").val();
    const lastName = $("#lname").val();
    const userName = $("#uname").val();
    const password = $("#password").val();
    const repeatedPassword = $("#rpassword").val();
    const repeatedPasswordElement = $("#rpassword");
    const message = $("#message");
    message?.remove();

    if (firstName && lastName && userName && password && repeatedPassword) {
      if (password === repeatedPassword) {
        const users = JSON.parse(localStorage.getItem(localkeys.registerUsers));
        const isExist = users.some((x) => x.username === userName);

        if (isExist) {
          repeatedPasswordElement.parent().append(
            `
          <label id="message" class="form-label font-mukta" style="color: red;" >Error. Username already exist</label>
          `
          );

          return;
        }

        const lastUserId = Math.max(...users.map((u) => u.id));
        const user = new User(lastUserId + 1, userName, firstName, lastName, password);
        users.push(user);
        setToLocalStorage(localkeys.registerUsers, users, true);

        repeatedPasswordElement.parent().append(
          `
        <label id="message" class="form-label font-mukta" style="color: green;" >Register successful</label>
        `
        );

        return;
      }

      repeatedPasswordElement.parent().append(
        `
      <label id="message" class="form-label font-mukta" style="color: red;" >Error. Passwords does not match</label>
      `
      );

      return;
    }
    repeatedPasswordElement.parent().append(
      `
    <label id="message" class="form-label font-mukta" style="color: red;" >Ingresed data for register the user was incorrect</label>
    `
    );
  });

  $("#remove-all-item").click(() => {
    localStorage.removeItem(localkeys.cartProducts);
    const cartItemElements = $("#cart-list > .align-items-start");
    cartItemElements.remove();
  });

  //log out user event register
  $("#sign-out").click(() => {
    const userSection = $("#user-section");

    if (userSection.length > 0) {
      $("#user-section > div.dropdown").remove();
      userSection.append(
        `
            <a class="btn btn-outline-primary me-3" href="./pages/signin.html" role="button">Sing in</a>
            <a class="btn btn-outline-success me-3" href="./pages/signup.html" role="button">Sign up</a>
          `
      );
      localStorage.removeItem(localkeys.logedUser);
    }
  });
});

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
