import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Env } from '@config/env.config';
import { connectDatabase } from '@config/db.config';
import { errorHandler } from '@middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`/`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Healthy server',
  });
});

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  console.log(
    `🚀 Server running at http://localhost:${Env.PORT} (in ${Env.NODE_ENV})`
  );
  await connectDatabase();
});
