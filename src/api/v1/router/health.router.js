import router from 'express';   
import * as healthController from '../controller/health.controller.js'

const healthRouter = router.Router();

healthRouter.get('/health', healthController.healthCheck );

export default healthRouter;        