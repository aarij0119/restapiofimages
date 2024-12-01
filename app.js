const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs')


app.set("view engine", 'ejs');

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(10, function (err, bytes) {
            if(err) return cb(err)
                console.log(bytes)
            const fn = bytes.toString("hex") + path.extname(file.originalname)
            console.log(fn)
            cb(null, fn)
        })
    }
})
const upload = multer({ storage: storage })


app.get('/', (req, res) => {
    res.render('index')
});

app.post('/uploads', upload.single("image") ,(req, res) => {
    console.log(req.file)
    res.send("done")
});

app.get('/images',(req,res) => {
    fs.readdir('./public/images/uploads',(err,files) => {
        if(err){
            return res.send("unable to read files")
        }
        const imageurl = files.map(file => `http://localhost:3000/images/uploads/${file}`)
        res.json(imageurl);
    })
})

app.listen(3000)