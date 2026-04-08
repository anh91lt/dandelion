const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM product_image");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Product Image NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO product_image (product_id, imageUrl, alt, position, created_at) VALUES (?, ?, ?, ?, ?)",
        [
          newData.product_id,
          newData.imageUrl,
          newData.alt,
          newData.position,
          newData.created_at,
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
      console.log(">>>Product Image NEW DATA: ", newData);
      await pool.query(
        "UPDATE product_image SET product_id=?, imageUrl=?, alt=?, position=?, created_at=? WHERE id=?",
        [
          newData.product_id,
          newData.imageUrl,
          newData.alt,
          newData.position,
          newData.created_at,
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
      console.log(">>>Product Image DELETE ID: ", id);
      await pool.query("DELETE FROM product_image WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
