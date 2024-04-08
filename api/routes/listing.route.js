import express from 'express';
import { createListing } from '../controllers/listnig.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken,createListing);

export default router;