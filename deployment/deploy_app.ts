import dotenv from 'dotenv';
import { Client } from "basic-ftp"

dotenv.config();

const FTP_HOST = process.env.FTP_HOST
const WEBSITE_ADMIN_USER = process.env.WEBSITE_ADMIN_USER
const WEBSITE_ADMIN_PW = process.env.WEBSITE_ADMIN_PW

const SRC_BASE_PATH = "../app/build/client/"

async function upload_weddingsite() {
    const client = new Client()
    try {
        await client.access({
            host: FTP_HOST,
            user: WEBSITE_ADMIN_USER,
            password: WEBSITE_ADMIN_PW,
            secure: false // set to true if using FTPS
        })

        console.log("ensuring directories");
        for (const directory_name of ["assets", "translations", "fonts"]){
            await client.ensureDir("/"+directory_name);
            await client.cd("/");
        }

        for (const file_name of ["index.html", ".htaccess"]){
            console.log("Uploading file " + file_name)

            await client.remove(file_name, true)
            await client.uploadFrom(SRC_BASE_PATH + file_name, "/"+ file_name)
        }

        for (const directory_name of ["assets", "translations", "fonts"]){
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