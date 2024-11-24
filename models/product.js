const products = [];

class Product {
  constructor(productName) {
    this.id = `${Date.now()}-${Math.random()}`;
    this.productName = productName;
  }
}

module.exports = { Product, products };
