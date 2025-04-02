import express, { Request, Response} from 'express';
import asyncHandler from 'express-async-handler';
import { createAppeal } from '../services/appeal.service'
import { createAppealDto } from '../schemas/createAppeal.dto.type'

export const router = express.Router()

router.route('/appeals').post(asyncHandler(async(req: Request,res: Response) => {
    const result = createAppealDto.safeParse(req.body);
    if(!result.success){
        res.status(400).json({error: result.error.errors})
        return
    }
    await createAppeal(result.data);
    res.status(201).json({success: true})
    return
})
)

