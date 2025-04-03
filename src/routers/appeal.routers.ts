import express, { Request, Response} from 'express';
import { cancellationAppealsAtWork, ConditionUpdateProcess, createAppeal,updateWorkAppeal, getFilterDateAppeals } from '../services/appeal.service'
import { createAppealDto } from '../schemas/createAppeal.dto.type'
import { Appeal } from '../schemas/appeal.type';
import asyncHandler from 'express-async-handler';
import { updateAppealDto } from '../schemas/updateAppeal.type';
import { filterDateAppealDto } from '../schemas/filterAppealDate.dto';
/**
 * @swagger
 * components:
 *  schemas:
 *      Appeal:
 *          type: object
 *          required:
 *              - title
 *              - message
 *          properties:
 *            id:
 *              type: string
 *              description: The auto-generated id of the appeal    
 *            title:
 *              type: string
 *              description: Appeal title
 *            message:
 *              type: string
 *              description: Appeal message
 *            feedbackMessage:
 *              type: string
 *              description: Feedback appeal message
 *              nullable: true
 *            processingWork:
 *              type: string
 *              enum: [new, atWork, completed, canceled]
 *              description: Current appeal processing work
 *            createdAt:
 *              type: string
 *              format: date-time
 *              description: Creation date
 *          example:
 *              id: d123f_ds
 *              title: registration
 *              message: Can't register
 *              feedbackMessage: null
 *              processingWork: new
 *              createdAt: 2025-04-03T17:03:25.297Z
 */

export const router = express.Router()


/**
 * @swagger
 * /appeals:
 *   post:
 *     summary: Create appeal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dark theme issue"
 *               message:
 *                 type: string
 *                 example: "Dark theme doesn't work properly"
 *     responses:
 *       201:
 *         description: Successfully created new appeal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 */
router.route('/appeals').post(asyncHandler(async(req: Request,res: Response) => {
    const result = createAppealDto.safeParse(req.body);
    if(!result.success){
        res.status(400).json({error: "Validation failed", details: result.error.flatten()})
        return
    }
    const newAppeal: Appeal = await createAppeal(result.data);
    res.status(201).json(newAppeal)
})
)


/**
 * @swagger
 * /appeals/{id}/start:
 *   patch:
 *     summary: Start appeal review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appeal's unique identifier
 *     responses:
 *       200:
 *         description: Appeal taken into work
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *             example:
 *               id: "d123f_ds"
 *               title: "registration"
 *               message: "Can't register"
 *               feedbackMessage: null
 *               processingWork: "atWork"
 *               createdAt: "2025-04-03T17:03:25.297Z"
*/
router.route(`/appeals/:id/start`).patch(asyncHandler(async(req: Request,res: Response) => {
    const { id }= req.params;
    const condition : ConditionUpdateProcess = ConditionUpdateProcess.start;
    const updateAppeal: Appeal = await updateWorkAppeal(id, condition);
    res.status(200).json(updateAppeal)
})
)


/**
 * @swagger
 * /appeals/{id}/cancellation:
 *   patch:
 *     summary: Cancel work on appeal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appeal's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedbackMessage
 *             properties:
 *               feedbackMessage:
 *                 type: string
 *                 example: "Feature canceled"
 *     responses:
 *       200:
 *         description: Work on the appeal has been stopped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *             example:
 *               id: "d123f_ds"
 *               title: "Dark theme"
 *               message: "Don't work "
 *               feedbackMessage: "Feature canceled"
 *               processingWork: "canceled"
 *               createdAt: "2022-04-03 11:10:54.096"
*/
router.route(`/appeals/:id/cancellation`).patch(asyncHandler(async(req: Request,res: Response) => {
    const id: string = req.params.id;
    const condition : ConditionUpdateProcess = ConditionUpdateProcess.cancellation;
    const result = updateAppealDto.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({error: "Validation failed", details: result.error.flatten()})
        return
    }
    const updateAppeal: Appeal = await updateWorkAppeal(id, condition,result.data.feedbackMessage);
    res.status(200).json(updateAppeal)
})
)


/**
 * @swagger
 * /appeals/{id}/completion:
 *   patch:
 *     summary: Complete work on appeal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appeal's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedbackMessage
 *             properties:
 *               feedbackMessage:
 *                 type: string
 *                 example: "Bag fixed"
 *     responses:
 *       200:
 *         description: Work on the appeal has been completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *             example:
 *               id: "d123f_ds"
 *               title: "Dark theme"
 *               message: "Don't work"
 *               feedbackMessage: "Dark theme work is correct"
 *               processingWork: "completed"
 *               createdAt: "2025-04-03T17:03:25.297Z"
*/
router.route('/appeals/:id/completion').patch(asyncHandler(async(req:Request, res:Response) => {
    const id: string = req.params.id;
    const condition: ConditionUpdateProcess = ConditionUpdateProcess.completion;
    const result = updateAppealDto.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({error: "Validation failed", details: result.error.flatten()})
        return
    }
    const updateAppeal: Appeal = await updateWorkAppeal(id, condition,result.data.feedbackMessage);
    res.status(200).json(updateAppeal)
}))


/**
 * @swagger
 * /appeals/cancellation:
 *   post:
 *     summary: Cancel all appeal in work
 *     responses:
 *       200:
 *         description: Success of cancellation of all
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
*/
router.route('/appeals/cancellation').post(asyncHandler(async(req:Request, res:Response) => {
    const result = updateAppealDto.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({error: "Validation failed", details: result.error.flatten()})
        return
    }
    await cancellationAppealsAtWork(result.data.feedbackMessage);
    res.status(200).json({success: true})
}))



/**
 * @swagger
 * /appeals/filter:
 *   get:
 *     summary: Get filtered appeals
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by a specific date
 *         example: "2022-01-01"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date to start filtering
 *         example: "2020-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date to end filtering
 *         example: "2020-09-04"
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered appeals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appeal'
 */
router.route('/appeals/filter').get(asyncHandler(async(req: Request, res: Response) => {
    const result = filterDateAppealDto.safeParse(req.query)
    if(!result.success) {
        res.status(400).json({error: "Validation failed", details: result.error.flatten()})
        return
    }
    const filterDateAppeals = await getFilterDateAppeals(result.data);
    res.status(200).json(filterDateAppeals)
}))