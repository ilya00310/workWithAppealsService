import express, { Request, Response } from 'express';

export const router = express.Router()

router.route('/appeals').get((req: Request,res: Response) => {
    res.status(200).json({success: true})
})