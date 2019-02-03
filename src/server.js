import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is successfully running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
