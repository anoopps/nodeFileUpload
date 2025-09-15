import express from "express";
import db from "./db.js";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { error } from "console";

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 3000;


// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});


const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg or .jpeg files allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

//upload route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { filename, path: filepath } = req.file;

    db.query(
        "INSERT INTO uploads (filename, filepath) VALUES (?, ?)",
        [filename, filepath],
        (err, result) => {
            if (err) return res.status(500).json({ message: "DB Error", error: err });

            res.json({ message: "File uploaded successfully", fileId: result.insertId });
        }
    );
});


app.get("/files", (req, res) => {

    db.query("SELECT * from uploads", (err, result) => {
        if (err) {
            res.status(400).json({ error: "Listing failed" });
        }
        res.json(result);
    });

});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));