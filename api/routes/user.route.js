import express from "express";
import { deletUser, updateUser, getUserListing, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//mise a jour des donnees
router.post('/update/:id', verifyToken, updateUser)
//supprimer un compte perso
router.delete('/delete/:id', verifyToken, deletUser)
//acceder a nos publications
router.get('/listings/:id',verifyToken, getUserListing)

router.get('/:id',verifyToken, getUser)



export default router;