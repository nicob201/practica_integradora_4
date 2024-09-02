import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import multer from "multer";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuracion de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../documents`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const generateResetToken = () => crypto.randomBytes(32).toString("hex");

export const uploader = multer({ storage });

export default __dirname;