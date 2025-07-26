import dotenv from 'dotenv';
import { Client } from "basic-ftp"

dotenv.config();

const FTP_HOST = process.env.FTP_HOST
const FPD_USER = process.env.API_ADMIN_USER
const FDP_PW = process.env.API_ADMIN_PW

const SRC_BASE_PATH = "../api/"

async function upload_weddingsite() {
    const client = new Client()
    try {
        await client.access({
            host: FTP_HOST,
            user: FPD_USER,
            password: FDP_PW,
            secure: false // set to true if using FTPS
        })
        for (const file_name of ["app.php", "helper.php", ".htaccess", "secrets/.htaccess", "images/.htaccess"]){
            console.log("Uploading file " + file_name)

            await client.remove(file_name, true)
            await client.uploadFrom(SRC_BASE_PATH + file_name, "/"+ file_name)
        }

        for (const directory_name of ["controllers", "middleware", "repositories", "services"]){
            console.log("Uploading directory " + directory_name)

            await client.removeDir(directory_name)
            await client.uploadFromDir(SRC_BASE_PATH + directory_name, "/"+ directory_name)
        }

        console.log("Upload successful")
    } catch (err) {
        console.error("FTP upload failed:", err)
    }
    client.close()
}

upload_weddingsite()