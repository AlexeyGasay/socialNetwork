const { Router } = require("express");

const fs = require("fs");

const db = require("../db");

const router = Router();

const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");


const fileStorage = multer.diskStorage({
  // Destination to store image     
  destination: './uploads/postFiles',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});

const fileUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 10000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    console.log(req);

    if (!file.originalname.match(/\.(png|jpg|jpeg|svg|mp4|mp3)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})

router.post('/uploadPostImage', fileUpload.single('image'), async (req, res, next) => {
  console.log(req.file);

  const image = await db.query(`INSERT INTO photo_to_post (image) values ('${req.file.filename}') RETURNING *;`)

  res.send({ file: req.file.filename, image: image.rows[0] })
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/deletePostFiles', (req, res) => {

  let folderPath = 'uploads/postFiles/';

  let filesToDelete = req.body.files; // Array

  try {

    // Проход по массиву пришедших имен файлов и удлание их в папке uploads 
    for (let i = 0; i < filesToDelete.length; i++) {

      const element = filesToDelete[i];

      let file = folderPath + element;

      fs.unlink(file, err => {
        if ( err ) res.status(400).json(err.message)

        res.status(200).json("success deleted")
      })
    }


  } catch (e) {
    console.log(e);
  }
})

router.post('/uploadPostFiles', authMiddleware, fileUpload.array('file', 5, { lol: "lol" }), async (req, res) => {

  try {

    console.log(req.body.post_id);
    let post_id = req.body.post_id;

    async function addPathFile(path) {
      let file = await db.query('INSERT INTO file_to_post (post_id, file_path) values ($1, $2)',
        [post_id, path]
      )
    }

    req.files.map((item) => {
      console.log(item.filename)
      addPathFile(item.filename)
    })

    res.send(req.files)

  } catch (e) {
    console.log(e);
  }
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})


module.exports = router;
