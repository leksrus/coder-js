class Product {
  constructor(id, name, description, price, imgSrc) {
    this.id = parseInt(id);
    this.name = name;
    this.desctiption = description;
    this.price = parseFloat(price);
    this.imgSrc = imgSrc;
  }
}
