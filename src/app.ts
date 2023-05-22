import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

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

router.get('/', async (req, res) => {
    res.json("Hello world!")
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});