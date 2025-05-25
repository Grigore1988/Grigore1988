import { Router } from 'express';

const router = Router();

router.get('/summary', (req, res) => {
  res.json({ success: true, message: 'Portfolio summary endpoint' });
});

router.get('/positions', (req, res) => {
  res.json({ success: true, message: 'Portfolio positions endpoint' });
});

export default router;