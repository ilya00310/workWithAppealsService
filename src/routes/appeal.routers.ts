import express, { Request, Response} from 'express';
import { createAppeal,startWorkAppeal } from '../services/appeal.service'
import { createAppealDto } from '../schemas/createAppeal.dto.type'
import { Appeal } from '../schemas/appeal.type';
import asyncHandler from 'express-async-handler';
export const router = express.Router()

router.route('/appeals').post(asyncHandler(async(req: Request,res: Response) => {
    const result = createAppealDto.safeParse(req.body);
    if(!result.success){
        res.status(400).json({error: result.error.errors})
        return
    }
    const newAppeal: Appeal = await createAppeal(result.data);
    res.status(201).json(newAppeal)
})
)

router.route(`/appeals/:id/start`).patch(asyncHandler(async(req: Request,res: Response) => {
    const id: string = req.params.id;
    const updateAppeal: Appeal = await startWorkAppeal(id);
    res.status(200).json(updateAppeal)
})
)