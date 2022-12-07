const { OK_SALE, BAD_REQUEST } = require("../constantes");
const getConnection = require("../database");
const {
  getProductById,
  validateStock,
  returnIsOffSale,
} = require("../services/Product");
const { saveSale, getAllSales } = require("../services/Sale");

const GET_SALES = "SELECT * FROM `tbl_shopping` WHERE uid = ?;";
const UPDATE_OFF_SALE =
  "UPDATE `tbl_products` SET `isOffSale` = ?, `percent` = ? WHERE `tbl_products`.`id` = ?;";

const sendResponse = (status, body, headers) => ({
  status,
  body,
  headers,
});

const EccomerceController = {
  buyProduct: async (req, res) => {
    try {
      const { uid, productId, amount } = req.body;
      const product = await getProductById(productId);
      if (!product || !validateStock(product, amount)) {
        return res.json(
          sendResponse(400, { message: BAD_REQUEST }, req.headers)
        );
      }
      await saveSale({ uid, product, amount });
    } catch (error) {
      console.error(error);
      return res.json(
        sendResponse(500, { message: error.message }, req.headers)
      );
    }
    return res.json(sendResponse(200, { message: OK_SALE }, req.headers));
  },
  buyProducts: async (req, res) => {
    try {
      const { uid, products } = req.body;
      let promises = [];
      products.forEach(async (e) => {
        const { productId, amount } = e;
        const product = await getProductById(productId);
        if (product && validateStock(product, amount)) {
          promises.push(await saveSale({ uid, product, amount }));
        }
      });
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
      return res.json(
        sendResponse(500, { message: error.message }, req.headers)
      );
    }
    return res.json(sendResponse(200, { message: OK_SALE }, req.headers));
  },
  getSales: async (req, res) => {
    try {
      const con = await getConnection();
      const { uid } = req.params;
      const [sales] = await con.query(GET_SALES, [uid]);
      return res.json(sendResponse(200, sales, req.headers));
    } catch (error) {
      console.error(error);
      return res.json(
        sendResponse(500, { message: error.message }, req.headers)
      );
    }
  },
  updateOffSale: async (req, res) => {
    try {
      const con = await getConnection();
      const { productId, percent, isOffSale } = req.body;
      let offSale = returnIsOffSale(isOffSale);
      const [sales] = await con.query(UPDATE_OFF_SALE, [
        offSale,
        percent,
        productId,
      ]);
      return res.json(sendResponse(200, sales, req.headers));
    } catch (error) {
      console.error(error);
      return res.json(
        sendResponse(500, { message: error.message }, req.headers)
      );
    }
  },
  getReport: async (req, res) => {
    try {
      const sales = await getAllSales();
      let report = { sales: [] };
      let totalSales = 0;
      let totalIVA = 0;
      await Promise.all(
        sales.map(async (sale) => {
          const saleIVA = sale.total * 0.19;
          totalSales += sale.total;
          totalIVA += saleIVA;
          const product = await getProductById(sale.productId);
          let productName = product ? product.name : "Producto no existente";
          report.sales.push({
            name: productName,
            amount: sale.amount,
            total: sale.total,
            saleIVA,
          });
        })
      );
      report.total = totalSales;
      report.totalIVA = totalIVA;
      return res.json(sendResponse(200, report, req.headers));
    } catch (error) {
      console.error(error);
      return res.json(
        sendResponse(500, { message: error.message }, req.headers)
      );
    }
  },
};

module.exports = EccomerceController;
