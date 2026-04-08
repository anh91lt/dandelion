const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM product");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Product NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO product (image, name, description, price, unit, amount, unit_amount, ingredient, uses, tutorial, note, preserve, manufacturer, link, detail_categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newData.image,
          newData.name,
          newData.description,
          newData.price,
          newData.unit,
          newData.amount,
          newData.unit_amount,
          newData.ingredient,
          newData.uses,
          newData.tutorial,
          newData.note,
          newData.preserve,
          newData.manufacturer,
          newData.link,
          newData.detail_categoryId,
        ]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Product NEW DATA: ", newData);
      await pool.query(
        "UPDATE product SET image=?, name=?, description=?, price=?, unit=?, amount=?, unit_amount=?, ingredient=?, uses=?, tutorial=?, note=?, preserve=?, manufacturer=?, link=?, detail_categoryId=? WHERE id=?",
        [
          newData.image,
          newData.name,
          newData.description,
          newData.price,
          newData.unit,
          newData.amount,
          newData.unit_amount,
          newData.ingredient,
          newData.uses,
          newData.tutorial,
          newData.note,
          newData.preserve,
          newData.manufacturer,
          newData.link,
          newData.detail_categoryId,
          newData.id,
        ]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Product DELETE ID: ", id);
      await pool.query("DELETE FROM product WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
