class Cart {
  constructor() {
    this.products = [];
  }

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

  getProduct(id) {
    return this.products.find((x) => x.id === parseInt(id));
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
          price: 0,
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
