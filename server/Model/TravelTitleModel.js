const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM travel_title");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Travel Title NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO travel_title (travel_id, title, position) VALUES (?, ?, ?)",
        [newData.travel_id, newData.title, newData.position]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Travel Title NEW DATA: ", newData);
      await pool.query(
        "UPDATE travel_title SET travel_id=?, title=?, position=? WHERE id=?",
        [newData.travel_id, newData.title, newData.position, newData.id]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Travel Title DELETE ID: ", id);
      await pool.query("DELETE FROM travel_title WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
