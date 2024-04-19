import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings} from '../controllers/listnig.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
//ajouter un listing
router.post('/create', verifyToken,createListing);
//supprimer un listing
router.delete('/delete/:id', verifyToken,deleteListing);
//mise a jour
router.post('/update/:id', verifyToken,updateListing);

router.get('/get/:id', getListing)

router.get('/get', getListings);

export default router;