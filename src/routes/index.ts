import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'La API se está ejecutando!' });
});

export default router;
