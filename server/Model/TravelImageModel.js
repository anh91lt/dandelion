const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM travel_image");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Travel Image NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO travel_image (travel_id, imageUrl, alt, position) VALUES (?, ?, ?, ?)",
        [newData.travel_id, newData.imageUrl, newData.alt, newData.position]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Travel Image NEW DATA: ", newData);
      await pool.query(
        "UPDATE travel_image SET travel_id=?, imageUrl=?, alt=?, position=? WHERE id=?",
        [
          newData.travel_id,
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
      console.log(">>>Travel Image DELETE ID: ", id);
      await pool.query("DELETE FROM travel_image WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
