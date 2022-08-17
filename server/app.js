const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const evulate = require("./utils/dmn-evalutor");
const fs = require("fs");
const eval = require("./utils/dmn-eval");

const app = express();

app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(morgan("dev"));

app.post("/xml", async (req, res) => {
  if (req.files) {
    console.log(req.files.file);
    const file = req.files.file;
    if (fs.existsSync(`${__dirname}/uploads/${file.name}`)) {
      fs.unlinkSync(`${__dirname}/uploads/${file.name}`);
    }
    file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(`File uploaded!`);
    });
  }
});

app.post("/evalute", async (req, res) => {
  // evulate
  // const data = await evulate(xml, req.body.id, req.body.params);
  // eval
  // const data2 = await eval(req.body.id, xml, req.body.params);

  fs.readFile(`${__dirname}/uploads/${req.body.file}`, async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    const xml = data.toString();
    const data2 = await eval(req.body.id, xml, req.body.params); // başka bi rule'un outputunu input olarak alamıyor
    const data3 = await evulate(xml, req.body.id, req.body.params);
    res.json(data3);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
