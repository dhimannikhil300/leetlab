import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello guys')
})

app.listen(process.env.PORT, () => {
    console.log("server is runing on 8080");
})