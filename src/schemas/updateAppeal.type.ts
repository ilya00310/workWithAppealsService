import z from 'zod'

export const updateAppealDto = z.object({
feedbackMessage: z.string(),
})


export type UpdateAppeal = z.infer<typeof updateAppealDto>