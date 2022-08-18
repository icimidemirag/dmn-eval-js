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
  // evulate fonksiyonu dmn-evaluator kütüphanesini kullanır.
  // const data = await evulate(xml, req.body.id, req.body.params);
  /*giriş değişkenlerinin isimlerini kullanarak işlem gerçekleştiremiyoruz.
  örneğin input1 şeklinde giriş değişkenimiz olduğu durumda output1 şeklindeki outputumuza 
  (input1 + 2) gibi değişken adını kullanarak işlem yapamıyor, bu yüzden bu kütüphaneye kullanmıyoruz.
  zaten altta bulunan kütüphane bu kütüphanenin güncel hali sayılır ve 
  değişken adları kullanarak işlem yapmaya olanak sağlar*/

  // evul fonksiyonu stx-dmn-eval-js kütüphanesini kullanır.
  // const data = await eval(req.body.id, xml, req.body.params);
  /* Şayet bpmn.io sitesi üzerinde dmn kısmında, iki decision table arasındaki bağlantıyı ok çıkararak değil de
  ilk tabloyu oluşturduktan sonra sağ yanda çıkan decision table simgesine tıklayıp kendiliğinden bağlanmış
  tabloyu kullanırsanız bir tablodaki outputu sonraki tablonun inputu olarak kullanabilirsiniz.
  */

  fs.readFile(`${__dirname}/uploads/${req.body.file}`, async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    const xml = data.toString();
    const data2 = await eval(req.body.id, xml, req.body.params);
    res.json(data2);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
