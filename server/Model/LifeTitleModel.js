const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM life_title");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Life Title NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO life_title (life_id, title, position) VALUES (?, ?, ?)",
        [newData.life_id, newData.title, newData.position]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Life Title NEW DATA: ", newData);
      await pool.query(
        "UPDATE life_title SET life_id=?, title=?, position=? WHERE id=?",
        [newData.life_id, newData.title, newData.position, newData.id]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Life Title DELETE ID: ", id);
      await pool.query("DELETE FROM life_title WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
