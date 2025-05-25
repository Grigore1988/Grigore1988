import { Router } from 'express';

const router = Router();

router.post('/orders/place', (req, res) => {
  res.json({ success: true, message: 'Place order endpoint' });
});

router.get('/orders', (req, res) => {
  res.json({ success: true, message: 'Get orders endpoint' });
});

export default router;