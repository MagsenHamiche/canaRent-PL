import express from "express";
import { deletUser, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test',test);
//mise a jour des donnees
router.post('/update/:id', verifyToken, updateUser)
//supprimer un compte perso
router.delete('/delete/:id', verifyToken, deletUser)


export default router;