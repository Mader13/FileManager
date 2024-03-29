const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.static(__dirname + "/dist/s3filemanager"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/s3filemanager/index.html"));
});
app.listen(process.env.PORT || 8080);
