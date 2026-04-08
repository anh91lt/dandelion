const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM life_image");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Life Image NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO life_image (life_id, imageUrl, alt, position) VALUES (?, ?, ?, ?)",
        [newData.life_id, newData.imageUrl, newData.alt, newData.position]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Life Image NEW DATA: ", newData);
      await pool.query(
        "UPDATE life_image SET life_id=?, imageUrl=?, alt=?, position=? WHERE id=?",
        [
          newData.life_id,
          newData.imageUrl,
          newData.alt,
          newData.position,
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
      console.log(">>>Life Image DELETE ID: ", id);
      await pool.query("DELETE FROM life_image WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
