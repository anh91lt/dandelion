const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM life");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Life NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO life (title, created_at, author) VALUES (?, ?, ?)",
        [newData.title, newData.created_at, newData.author]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Life NEW DATA: ", newData);
      await pool.query(
        "UPDATE life SET title=?, created_at=?, author=? WHERE id=?",
        [newData.title, newData.created_at, newData.author, newData.id]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Life DELETE ID: ", id);
      await pool.query("DELETE FROM life WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
