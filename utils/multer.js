const path = require("path");
const multer = require("fastify-multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const today = new Date();
    const formattedDate = `${today.getDate()}_${
      today.getMonth() + 1
    }_${today.getFullYear()}__${today.getHours()}_${today.getMinutes()}_${today.getSeconds()}`;
    // Fayl nomini yaratish uchun vaqt formatidan foydalanilyapti
    cb(null, formattedDate + "___" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB fayl o'lchami cheklovi
});

let fieldsUpload = (key) => upload.single(key);

const uploadFile = async (req) => {
  console.log(req.file);
};

module.exports = {
  fieldsUpload,
  uploadFile,
  multer,
};
