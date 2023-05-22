import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";

dotenv.config();

if (!process.env.PORT) {
    console.log('Missing port environment variable');
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string);

const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router();

router.get('/video', async (req, res) => {
    const relativeVideoPath = path.join(__dirname, '../coffee.mp4');
    const absolutePath = path.resolve(relativeVideoPath);
    
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const videoSize = fs.statSync(absolutePath).size;

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const responseHeaders = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, responseHeaders);

    const videoStream = fs.createReadStream(absolutePath, { start, end });
    console.log(videoStream);
    videoStream.pipe(res);
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});