import { Router } from 'express';
import CardRouter from './cards';
import CompanyRouter from './company';
import TransferRouter from './transfer';
import UserRouter from './users';
import WalletRouter from './wallet';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/cards', CardRouter);
router.use('/companies', CompanyRouter);
router.use('/transfers', TransferRouter);
router.use('/users', UserRouter);
router.use('/wallets', WalletRouter);

// Export the base-router
export default router;
