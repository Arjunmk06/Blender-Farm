import router from 'express';   

const healthRouter = router.Router();

healthRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default healthRouter;        