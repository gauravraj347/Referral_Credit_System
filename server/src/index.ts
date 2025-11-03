import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { CONFIG } from './config';
import routes from './routes/index';

async function start() {
	await mongoose.connect(CONFIG.mongoUri);

	const app = express();
	app.use(cors());
	app.use(express.json());

	app.get('/', (_req, res) => {
		res.json({ status: 'ok' });
	});

	app.use('/api', routes);

	app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	});

	app.listen(CONFIG.port, () => {
		console.log(`Server listening on http://localhost:${CONFIG.port}`);
	});
}

start().catch((err) => {
	console.error('Failed to start server', err);
});


