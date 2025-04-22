import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      }
));
app.use(express.json());

app.post('/g', ()=> {
    console.log('sjojo')
})



app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});