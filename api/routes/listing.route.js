import express from 'express';
import { createListing, deleteListing, updateListing} from '../controllers/listnig.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
//ajouter un listing
router.post('/create', verifyToken,createListing);
//supprimer un listing
router.delete('/delete/:id', verifyToken,deleteListing);
//mise a jour
router.post('/update/:id', verifyToken,updateListing);


export default router;