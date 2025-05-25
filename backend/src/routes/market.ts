import { Router } from 'express';

const router = Router();

router.get('/quotes', (req, res) => {
  res.json({ success: true, message: 'Market quotes endpoint' });
});

router.get('/quote/:symbol', (req, res) => {
  res.json({ success: true, message: 'Single quote endpoint' });
});

export default router;