const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const evulate = require("./utils/dmn-evalutor");

const app = express();

app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(morgan("dev"));

let xml = ``;

app.post("/xml", (req, res) => {
  if (req.body.file) {
    console.log(req.body);
    xml = req.body.file;
    return res.json({xml});
  }
  return res.status(500).json({
    error: "No file uploaded",
  });
});

app.post("/evalute", async (req, res) => {
  // evulate
  const data = await evulate(xml, req.body.id, req.body.params);

  res.json(data);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
