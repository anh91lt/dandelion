const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM travel");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Travel NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO travel (title, created_at, author) VALUES (?, ?, ?)",
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
      console.log(">>>Travel NEW DATA: ", newData);
      await pool.query(
        "UPDATE travel SET title=?, created_at=?, author=? WHERE id=?",
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
      console.log(">>>Travel DELETE ID: ", id);
      await pool.query("DELETE FROM travel WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
