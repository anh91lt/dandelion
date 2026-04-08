const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM detail_category");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Detail Category NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO detail_category (name, cate_productId) VALUES (?, ?)",
        [newData.name, newData.cate_productId]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Detail Category NEW DATA: ", newData);
      await pool.query(
        "UPDATE detail_category SET name=?, cate_productId=? WHERE id=?",
        [newData.name, newData.cate_productId, newData.id]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Detail Category DELETE ID: ", id);
      await pool.query("DELETE FROM detail_category WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
