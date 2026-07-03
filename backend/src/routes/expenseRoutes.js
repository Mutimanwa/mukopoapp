import express from 'express';
import { createExpense, getMyExpenses, getExpenses, updateExpenseStatus } from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createExpense)
    .get(protect, authorize('Admin', 'Finance', 'Manager'), getExpenses);

router.route('/myexpenses')
    .get(protect, getMyExpenses);

router.route('/:id/status')
    .put(protect, authorize('Admin', 'Finance', 'Manager'), updateExpenseStatus);

export default router;
