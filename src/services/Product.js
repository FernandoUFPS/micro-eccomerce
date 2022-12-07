const GET_PRODUCT_BY_ID = "SELECT * FROM `tbl_products` WHERE id = ?;";
const getConnection = require("../database");

const ProductService = {
  getProductById: async (productId) => {
    let con = null;
    let product = undefined;
    try {
      con = await getConnection();
      const [products] = await con.query(GET_PRODUCT_BY_ID, [productId]);
      if (products.length !== 0) {
        product = products[0];
      }
    } catch (error) {
      throw error;
    }
    return product;
  },
  validateStock: (product, amount) => {
    return product.stock >= Number(amount);
  },
  returnIsOffSale: (isOffSale) => {
    let offSale = -1;
    if (isOffSale) {
      offSale = 1;
    } else {
      offSale = 0;
    }
    return isOffSale;
  },
};

module.exports = ProductService;
