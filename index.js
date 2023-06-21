
const connectToMongo = require('./db');

connectToMongo();
const express = require('express')

const app = express()
const port = 5000
const path = require("path")
const imgSchema = require('./Image');


app.set("view engine","ejs")
app.set("views",path.resolve("./EJS"))


app.use(express.json())



const multer  = require('multer')

app.use(express.urlencoded({extended: false}))

const storage = multer.diskStorage({
  destination: function(req,res,cd){
    return cd(null,'./uploads')
  },
  filename: function(req,file,cd){
    return cd(null,`${Date.now()}-${file.originalname}`)
  }
})

// const upload = multer({storage: storage})
const upload = multer({storage})

app.get('/',(req,res)=>{
  return res.render("home")
})

app.post('/upload',upload.single('image'),
  async(req, res) => {
    try {
      
        const name = req.file.filename
        const img = req.file.path
        let eachGame = await imgSchema.create({name,img})

        res.status(200).json({
            status: true,
            data: eachGame,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            status: false,
        })
    }
})

// download a file
app.get('/download/:id', async (req, res, nxt) => {
  try {
    const id = req.params.id
    const file = await imgSchema.findById(id)
    // console.log(__dirname+file.img)
    const filepath = path.join(__dirname,`/${file.img}`)
    res.download(filepath)
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
})


app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})
