import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => response.json({ message: 'Digo' }));

export default routes;
