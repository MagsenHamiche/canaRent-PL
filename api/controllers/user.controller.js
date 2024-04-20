
import bcryptjs from 'bcryptjs'
import Listing from '../models/listing.model.js'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'


export const updateUser = async (req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "you can only update your own account!"))
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true})

        const {password, ...rest} = updateUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deletUser = async (req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'Vous pouvez supprimer que votre compte'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('Utilisateur supprimer');
        
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('Utilisateur deconnecter');
    } catch (error) {
        next(error);
    }
};

export const getUserListing = async (req, res, next)=>{
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings)
        } catch (error) {
            next(error);
        }
    }else{
        return next(errorHandler(401, 'Vous pouvez voir seulement vos publications'));
    }
};

export const getUser = async (req, res, next)=>{
    try {
        const user = await User.findById(req.params.id);

        if(!user) return next(errorHandler(404, 'Utilisateur introuvable'));

        const { password: pass, ...rest } = user._doc;

        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
};