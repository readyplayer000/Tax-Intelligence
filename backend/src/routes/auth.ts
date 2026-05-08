import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  // Mock login
  res.json({
    token: 'mock_jwt_token',
    user: { id: 'user_123', name: 'Rohith', email: 'rohith@example.com' }
  });
});

export default router;
