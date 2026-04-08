const { pool } = require("../connect");
module.exports = function () {
  this.getAll = async function (result) {
    try {
      const [rows] = await pool.query("SELECT * FROM travel_content");
      result(null, rows);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.create = async function (newData, result) {
    try {
      console.log(">>>Travel Content NEW DATA: ", newData);
      await pool.query(
        "INSERT INTO travel_content (travel_id, content, position) VALUES (?, ?, ?)",
        [newData.travel_id, newData.content, newData.position]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.update = async function (newData, result) {
    try {
      console.log(">>>Travel Content NEW DATA: ", newData);
      await pool.query(
        "UPDATE travel_content SET travel_id=?, content=?, position=? WHERE id=?",
        [newData.travel_id, newData.content, newData.position, newData.id]
      );
      result(null, newData);
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };

  this.delete = async function (id, result) {
    try {
      console.log(">>>Travel Content DELETE ID: ", id);
      await pool.query("DELETE FROM travel_content WHERE id=?", [id]);
      result(null, { id });
    } catch (err) {
      console.log(err);
      result(err, null);
    }
  };
};
