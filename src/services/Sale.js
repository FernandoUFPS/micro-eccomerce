const INSERT_SALE =
  "INSERT INTO `tbl_shopping` (`uid`, `product_id`, `amount`, `total`, `create_at`) VALUES (?, ?, ?, ?, current_timestamp());";
const UPDATE_STOCK =
  "UPDATE `tbl_products` SET `stock` = ? WHERE `tbl_products`.`id` = ?;";
const GET_SALES = "SELECT * FROM `tbl_shopping`;";

const getConnection = require("../database");

const SaleService = {
  saveSale: async ({ uid, product, amount }) => {
    let con = null;
    try {
      con = await getConnection();
      await con.beginTransaction();
      const currentPrice = SaleService.getActualPrice(product);
      const totalPrice = currentPrice * Number(amount);
      await con.query(INSERT_SALE, [uid, product.id, amount, totalPrice]);
      await con.query(UPDATE_STOCK, [
        product.stock - Number(amount),
        product.id,
      ]);
      con.commit();
    } catch (error) {
      if (con) await con.rollback();
      throw error;
    }
  },
  getAllSales: async () => {
    try {
      const con = await getConnection();
      const [sales] = await con.query(GET_SALES);
      console.log(sales);
      return sales;
    } catch (error) {
      throw error;
    }
  },
  getActualPrice: (product) => {
    const currentPrice = product.isOffSale
      ? product.price * ((100 - product.percent) / 100)
      : product.price;
    return currentPrice;
  },
};

module.exports = SaleService;
