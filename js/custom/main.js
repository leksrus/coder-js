//local storage key variables
const localkeys = {
  productStock: "stock-products",
  registerUsers: "registered-users",
  logedUser: "loged-user",
  cartProducts: "cart-products",
};

//set variables in localstorage
function setToLocalStorage(key, item, override) {
  const storageItem = JSON.parse(localStorage.getItem(key));

  if (override || !storageItem) localStorage.setItem(key, JSON.stringify(item));
}

//load all products
function loadAllProducts(productsSection, isForAddCart) {
  getAllProducts().then((dbProducts) => {
    setToLocalStorage(localkeys.productStock, dbProducts, true);
    productsSection.empty();
    loadProductHtml(dbProducts, productsSection, isForAddCart);
  });
}

//load fitered products
function loadProductsWithCategoryFilter(category, productsSection) {
  filterProductsByCategory(category).then((dbProducts) => {
    loadProductHtml(dbProducts, productsSection, true);
  });
}

function loadProductsWithNameFilter(name, productsSection) {
  filterProductsByName(name).then((dbProducts) => {
    loadProductHtml(dbProducts, productsSection, true);
  });
}

function loadProductsWithIdListAndOrderBy(productIdList, orderCriteria, productsSection) {
  getProductsWithIdListAndOrderByCriteria(productIdList, orderCriteria).then((dbProducts) => {
    loadProductHtml(dbProducts, productsSection, true);
  });
}

//adding html in products view
function loadProductHtml(products, productsSection, isForAddCart) {
  productsSection.empty();
  for (const product of products) {
    if (isForAddCart) {
      productsSection.append(
        `
            <div class="col-12 col-md-4 col-lg-3">
              <div class="card text-dark bg-light mb-5 transition">
                <img class="card-img-top image-min-height-315" src="..${product.imgSrc}" alt="${product.name}" />
                <div class="card-body font-varela">
                  <h5 class="card-title text-center"><b>${product.name}</b></h5>
                  <p class="card-text text-center cart-product-price">${product.price}</p>
                  <p class="card-text">${product.description}</p>
                  <button id="${product.id}" class="btn-custom">Add to Cart</button>
                </div>
              </div>
            </div>
            `
      );
      productsSection.find(`#${product.id}`).click(() => {
        addProductToCart(parseInt(this.event.target.id));
      });
    } else {
      productsSection.append(
        `
        <div class="col-12 col-md-4 col-lg-3">
          <div class="card text-dark bg-light mb-5 transition">
            <img class="card-img-top image-min-height-315" src="./${product.imgSrc}" alt="${product.name}" />
            <div class="card-body font-varela">
              <h5 class="card-title text-center"><b>${product.name}</b></h5>
              <p class="card-text text-center cart-product-price">${product.price}</p>
              <p class="card-text">${product.description}</p>
            </div>
          </div>
        </div>
        `
      );
    }
  }
}

//load product view with products or apply filter
function loadSectionProduct(filterType, filter, orderByCriteria) {
  const productsSection = $("#product-list-section > .row");
  setDolarPrice();

  if (productsSection.length > 0) {
    productsSection.empty();
    productsSection.append(
      `
      <div class="row justify-content-md-center">
        <img class="spinner" src="../images/spinner.gif" alt="" />
      </div>
      `
    );

    switch (filterType) {
      case "category":
        loadProductsWithCategoryFilter(filter, productsSection);
        break;

      case "name":
        loadProductsWithNameFilter(filter, productsSection);
        break;

      case "id":
        loadProductsWithIdListAndOrderBy(filter, orderByCriteria, productsSection);
        break;

      default:
        loadAllProducts(productsSection, true);
        break;
    }
  }
}

//load home view with products
function loadSectionHome() {
  const productsSection = $("#product-home-section > .row");

  if (productsSection.length > 0) {
    productsSection.empty();
    productsSection.append(
      `
      <div class="row justify-content-md-center">
        <img class="spinner" src="./images/spinner.gif" alt="" />
      </div>
      `
    );
    loadAllProducts(productsSection, false);
  }
}

//user visalization in nav bar
function setUpLogedUser(user) {
  const userSection = $("#user-section");
  const userDropdown = $("#user-section > .dropdown");

  if (userSection.length > 0 && userDropdown.length == 0) {
    $("#user-section > a.btn.btn-outline-primary, #user-section > a.btn.btn-outline-success").remove();

    userSection.append(
      `
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <b>Username:</b> ${user.userName}
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

//preload user on navigation between pages an check if user already loged
function checkIsUserLogedIn() {
  const storageUser = JSON.parse(localStorage.getItem(localkeys.logedUser));

  if (storageUser) {
    setUpLogedUser(storageUser);

    return true;
  }

  return false;
}

//add product list to cart and retain it in localstorage
function addProductToCart(productId) {
  const cart = setUpCartObject();
  const stockProducts = JSON.parse(localStorage.getItem(localkeys.productStock));

  if (stockProducts) {
    const product = stockProducts.find((x) => x.id === productId);

    if (product) {
      cart.addProduct(product);
      setToLocalStorage(localkeys.cartProducts, cart.getProducts(), true);
      showItemsCuantity();
      const cartAlertElement = $("#cart-alert");
      cartAlertElement.fadeIn(1000, () => {
        cartAlertElement.fadeOut("slow");
      });
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
    $("#checkout-btn").click((e) => {
      e.preventDefault();
      checkOut();
    });

    $("#finish-order").click((e) => {
      e.preventDefault();
      closeOrder();
    });

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
                    <p class="card-text">${product.description}</p>
                    <p id="price-${product.id}"  class="card-text cart-product-price">$${product.price}</p>
                    <div class="d-flex align-items-center justify-content-center">
                      <div id="plus-${product.id}" class="btn-cart">+</div>
                      <div class="count">${count}</div>
                      <div id="minus-${product.id}" class="btn-cart">-</div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-2 col-lg-2">
                  <div class="card-body">
                    <div class="d-flex align-items-end flex-column">
                      <div class="p-2 flex-grow-1">
                        <a id="remove-${product.id}" class="btn btn-outline-danger col-12" href="#" role="button">Remove</a>
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

        //bind event cart
        bindCartEvents(product, cartElment);
      }
    }
  }
}

//bind event to remove item from cart
function bindCartEvents(product, cartElment) {
  cartElment.find(`#remove-${product.id}`).click(() => {
    $("#cart-list").find(`#${this.event.target.id}`).closest(".row.align-items-start").remove();
    removeProductFromCart(parseInt(this.event.target.id));
  });

  //bind event to add item from cart by plus button
  cartElment.find(`#plus-${product.id}`).click(() => {
    const productId = parseInt(this.event.target.id.split("-")[1]);
    const prodCount = parseInt(productCount(productId));
    $(`#${this.event.target.id}`)
      .next(".count")
      .text(`${prodCount + 1}`);
    addProductToCart(productId);
    $(`#price-${productId}`).text("$" + productProductPrice(productId));
  });

  //bind event to remove item from cart by minus button
  cartElment.find(`#minus-${product.id}`).click(() => {
    const productId = parseInt(this.event.target.id.split("-")[1]);
    const prodCount = parseInt(productCount(productId));
    $(`#${this.event.target.id}`)
      .prev(".count")
      .text(`${prodCount - 1}`);
    removeProductFromCart(productId);
    $(`#price-${productId}`).text("$" + productProductPrice(productId));
    if (prodCount - 1 === 0) $("#cart-list").find(`#${productId}`).closest(".row.align-items-start").remove();
  });
}

// get product cout by specific Id
function productCount(productId) {
  const cart = setUpCartObject();

  return cart.getProducts().filter((x) => x.id === productId).length;
}

//get product price
function productProductPrice(productId) {
  const cart = setUpCartObject();

  return cart.showCartItems()?.find((x) => x.id == productId)?.price;
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

// checkout logic to show modal
function checkOut() {
  const cart = setUpCartObject();

  if (cart.getProducts().length > 0) {
    const cartModalElement = $("#cart-modal");
    cartModalElement.empty();
    cartModalElement.append(`
        <table class="table table-sm table-striped">
          <thead class="table-dark">
            <tr>
              <th scope="col">#</th>
              <th class="text-center" scope="col">Name</th>
              <th class="text-center" scope="col">Quantity</th>
              <th class="text-center" scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
      </table>
    `);

    let indexTable = 0;
    for (const product of cart.showCartItems()) {
      indexTable += 1;
      const count = productCount(product.id);
      cartModalElement.find("tbody").append(`
        <tr>
          <th scope="row">${indexTable}</th>
          <td>${product.name}</td>
          <td class="text-center">${count}</td>
          <td class="text-end">${product.price}</td>
        </tr>
      `);
    }

    const total = cart.getTotalProductsPrice();
    const discount = getDiscount(cart);
    const totalToPay = total - discount;

    cartModalElement.find("tbody").append(`
      <tr>
        <th scope="row"></th>
        <td class="text-end" colspan="2"><b>Total:</b></td>
        <td class="text-end"><b>$${total}</b></td>
      </tr>
      <tr>
        <th scope="row"></th>
        <td class="text-end" colspan="2"><b>Discount:</b></td>
        <td class="text-end"><b>-$${discount}</b></td>
      </tr>
      <tr>
        <th scope="row"></th>
        <td class="text-end" colspan="2"><b>Total to pay:</b></td>
        <td class="text-end"><b>$${totalToPay}</b></td>
      </tr>
  `);
  }
}

//get dolar price and setup information
function setDolarPrice() {
  const spanElement = $("#dolar-price");

  if (spanElement.length > 0) {
    $.get("https://www.dolarsi.com/api/api.php?type=valoresprincipales", (data, status) => {
      if (status == "success") {
        const dolarBlueData = data.find((x) => x.casa.nombre === "Dolar Blue");
        spanElement.text(`Price: 1$ dolar - ${dolarBlueData.casa.venta}$ peso`);
      } else {
        console.log(`error: ${status}`);
      }
    });
  }
}

// checkout logic to close order
function closeOrder() {
  const finishOrderElement = $("#finish-order");

  if (!checkIsUserLogedIn()) $(location).prop("href", "/pages/signin.html");

  if (finishOrderElement.length > 0) {
    const cart = setUpCartObject();
    //some dummy post for simulate register order
    $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(cart.getProducts()), function (res, state) {
      if (state == "success") {
        $("#checkout").modal("toggle");
        clearCartOrder();
        const cartModalElement = $("#cart-modal");
        cartModalElement.empty();
      }
    });
  }
}

// get discount
function getDiscount(cart) {
  let discount = 0.0;
  let total = 0.0;
  const products = cart.getProducts();

  for (const product of products) total += product.price;

  if (total > 1000) discount += 50.25;

  if (total > 10000) discount += 99.99;

  return discount;
}

//clear all cart after complete order
function clearCartOrder() {
  localStorage.removeItem(localkeys.cartProducts);
  const cartItemElements = $("#cart-list > .align-items-start");
  cartItemElements.remove();
  showItemsCuantity();
}

//get products id in current page

function getProductIdList() {
  const productIdList = [];
  $("div > button.btn-custom").each((i, e) => {
    const productId = parseInt($(e).attr("id"));
    productIdList.push(productId);
  });

  return productIdList;
}

//initial load
$(() => {
  loadSectionHome();
  loadSectionProduct();
  showItemsCuantity();
  showCart();
  checkIsUserLogedIn();

  //user login
  $("#signin").click((e) => {
    e.preventDefault();
    const userName = $("#uname").val();
    const pass = $("#password").val();

    const user = new User(undefined, userName, undefined, undefined, pass);
    findUser(user).then((dbUser) => {
      if (dbUser) {
        setUpLogedUser(dbUser);
        $(location).prop("href", "/");
        return;
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
        //get users and do some checks
        getAllUsers().then((dbUsers) => {
          const dbUser = dbUsers.find((x) => x.userName === userName);

          if (dbUser) {
            repeatedPasswordElement.parent().append(
              `
          <label id="message" class="form-label font-mukta" style="color: red;" >Error. Username already exist</label>
          `
            );

            return;
          }
          const lastUserId = Math.max(...dbUsers.map((u) => u.id));
          const user = new User(lastUserId + 1, userName, firstName, lastName, password);

          createUser(user).then(() => {
            $("form")[0].reset();
            repeatedPasswordElement.parent().append(
              `
              <label id="message" class="form-label font-mukta" style="color: green;" >Register successful</label>
              `
            );
          });
          return;
        });

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
    clearCartOrder();
  });

  //log out user event register
  $("#sign-out").click(() => {
    const userSection = $("#user-section");

    if (userSection.length > 0) {
      $("#user-section > div.dropdown").remove();
      const pathname = window.location.pathname;
      const hrefpartialData = pathname.includes("/index.html") || pathname.includes("/") ? "./" : "../pages/";
      userSection.append(
        `
            <a class="btn btn-outline-primary me-3" href="./${hrefpartialData}signin.html" role="button">Sing in</a>
            <a class="btn btn-outline-success me-3" href="./${hrefpartialData}signup.html" role="button">Sign up</a>
          `
      );
      localStorage.removeItem(localkeys.logedUser);
    }
  });

  $("#cpu").click(() => {
    loadSectionProduct("category", "cpu");
  });

  $("#keyboard").click(() => {
    loadSectionProduct("category", "keyboard");
  });

  $("#mouse").click(() => {
    loadSectionProduct("category", "mouse");
  });

  $("#ssd").click(() => {
    loadSectionProduct("category", "ssd");
  });

  $("#gpu").click(() => {
    loadSectionProduct("category", "gpu");
  });

  $("#memory").click(() => {
    loadSectionProduct("category", "memory");
  });

  $("#psu").click(() => {
    loadSectionProduct("category", "psu");
  });

  $("#motherboard").click(() => {
    loadSectionProduct("category", "motherboard");
  });

  $("#monitor").click(() => {
    loadSectionProduct("category", "monitor");
  });

  $("#clear").click(() => {
    loadSectionProduct();
  });

  $("#button-search").click(() => {
    const inputCaption = $("#input-search").val();
    loadSectionProduct("name", inputCaption.toLowerCase().charAt(0).toUpperCase() + inputCaption.slice(1));
  });

  $("#order-low").click(() => {
    const productIdList = getProductIdList();
    loadSectionProduct("id", productIdList, "asc");
  });

  $("#order-hight").click(() => {
    const productIdList = getProductIdList();
    loadSectionProduct("id", productIdList, "desc");
  });
});
