import express, { Request, Response} from 'express';
import { ConditionUpdateProcess, createAppeal,updateWorkAppeal } from '../services/appeal.service'
import { createAppealDto } from '../schemas/createAppeal.dto.type'
import { Appeal } from '../schemas/appeal.type';
import asyncHandler from 'express-async-handler';
import { updateAppealDto } from '../schemas/updateAppeal.type';
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
    const { id }= req.params;
    const condition : ConditionUpdateProcess = ConditionUpdateProcess.start;
    const updateAppeal: Appeal = await updateWorkAppeal(id, condition);
    res.status(200).json(updateAppeal)
})
)

router.route(`/appeals/:id/canceled`).patch(asyncHandler(async(req: Request,res: Response) => {
    const id: string = req.params.id;
    const condition : ConditionUpdateProcess = ConditionUpdateProcess.canceled;
    const result = updateAppealDto.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({error: result.error.errors})
        return
    }
    const updateAppeal: Appeal = await updateWorkAppeal(id, condition,result.data.feedbackMessage);
    res.status(200).json(updateAppeal)
})
)

router.route('/appeals/:id/completed').patch(asyncHandler(async(req:Request, res:Response) => {
    const id: string = req.params.id;
    const condition: ConditionUpdateProcess = ConditionUpdateProcess.completion;
    const result = updateAppealDto.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({error: result.error.errors})
        return
    }
    const updateAppeal: Appeal = await updateWorkAppeal(id, condition,result.data.feedbackMessage);
    res.status(200).json(updateAppeal)
}))