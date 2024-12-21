import multer from "multer";

const getName = (file) => {
  if (!file) {
    return null;
  }
  
  const name = `${Date.now()}-${file.originalname}`
  return name;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, getName(file));
  }
})

const upload = multer({ storage: storage })

export { upload }