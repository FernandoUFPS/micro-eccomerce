const mysql = require("mysql2/promise");

const CREATE_TABLE_SHOPPING =
  "CREATE TABLE IF NOT EXISTS `almacen`.`tbl_shopping` (`uid` VARCHAR(50) NOT NULL , `product_id` BIGINT(20) NOT NULL , `shoppin_id` BIGINT(20) NOT NULL AUTO_INCREMENT , `amount` INT NOT NULL , `total` DOUBLE NOT NULL , PRIMARY KEY (`shoppingId`)) ENGINE = InnoDB;";
let connection = null;

async function getConnection(params) {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "almacen",
      });
      await connection.query(CREATE_TABLE_SHOPPING);
      console.log("Connection has been created");
    }
    return connection;
  } catch (error) {
    console.log(error);
  }
}

module.exports = getConnection;
