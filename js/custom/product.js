class Product {
  constructor(id, name, description, price, imgSrc, category) {
    this.id = parseInt(id);
    this.name = name;
    this.description = description;
    this.price = parseFloat(price);
    this.imgSrc = imgSrc;
    this.category = category;
  }
}
