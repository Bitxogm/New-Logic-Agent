import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🚀 Backend funcionando con TypeScript!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});