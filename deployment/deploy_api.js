"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const basic_ftp_1 = require("basic-ftp");
dotenv_1.default.config();
const FTP_HOST = process.env.FTP_HOST;
const FPD_USER = process.env.API_ADMIN_USER;
const FDP_PW = process.env.API_ADMIN_PW;
const SRC_BASE_PATH = "../api/";
function upload_weddingsite() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new basic_ftp_1.Client();
        try {
            yield client.access({
                host: FTP_HOST,
                user: FPD_USER,
                password: FDP_PW,
                secure: false // set to true if using FTPS
            });
            for (const file_name of ["app.php", "helper.php", ".htaccess"]) {
                console.log("Uploading file " + file_name);
                yield client.remove(file_name, true);
                yield client.uploadFrom(SRC_BASE_PATH + file_name, "/" + file_name);
            }
            for (const directory_name of ["controllers", "middleware", "repositories", "services"]) {
                console.log("Uploading directory " + directory_name);
                yield client.removeDir(directory_name);
                yield client.uploadFromDir(SRC_BASE_PATH + directory_name, "/" + directory_name);
            }
            console.log("Upload successful");
        }
        catch (err) {
            console.error("FTP upload failed:", err);
        }
        client.close();
    });
}
upload_weddingsite();
