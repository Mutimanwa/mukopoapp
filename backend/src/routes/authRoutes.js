import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('Admin', 'Manager', 'Finance'), getUsers);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect, authorize('Admin'), updateUser)
    .delete(protect, authorize('Admin'), deleteUser);

export default router;