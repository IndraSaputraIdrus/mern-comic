const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (_, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

const database = mysql.createPool({
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get("/", (_, res) => {
  res.send("welcome");
});

app.get("/mangas", async (_, res) => {
  const query = "SELECT * FROM manga";
  try {
    const [data] = await database.query(query);
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

app.post("/mangas", upload.single("cover_img"), async (req, res) => {
  try {
    const query =
      "INSERT INTO manga (`title`, `author`, `published_year`, `description`, `cover_img`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.author,
      parseInt(req.body.published_year),
      req.body.description,
      req.file.filename,
    ];

    const data = await database.query(query, [values]);
    res.json({ message: "success", data });
  } catch (error) {
    res.json(error);
  }
});

app.delete("/manga/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) res.status(500).json({ message: "failed, id not found" });

  try {
    const query = `DELETE FROM manga WHERE id = ?`;
    const data = await database.query(query, [id]);
    if (data[0].affectedRows < 1)
      throw `Data dengan id = ${id}, tidak ditemukan`;

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server running on port ${port}`);
});
