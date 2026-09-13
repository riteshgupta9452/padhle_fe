import { Router } from 'express';
import { requireUser } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { favoriteInput, historyInput } from '../validators/schemas.js';
import { userController } from '../controllers/user.controller.js';
const r = Router(); r.use(requireUser);
r.get('/favorites', userController.favorites); r.post('/favorites', validate(favoriteInput), userController.addFavorite); r.delete('/favorites/:id', userController.deleteFavorite);
r.get('/history', userController.history); r.post('/history', validate(historyInput), userController.saveHistory); r.post('/videos/:id/view', userController.view);
export default r;
