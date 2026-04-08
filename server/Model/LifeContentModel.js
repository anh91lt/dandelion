const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM life_content");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Life Content NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO life_content (life_id, content, position) VALUES (?, ?, ?)",
        [newData.life_id, newData.content, newData.position]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Life Content NEW DATA: ", newData);
      await pool.query(
        "UPDATE life_content SET life_id=?, content=?, position=? WHERE id=?",
        [newData.life_id, newData.content, newData.position, newData.id]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Life Content DELETE ID: ", id);
      await pool.query("DELETE FROM life_content WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
