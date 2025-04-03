import z from 'zod'

export const updateAppealDto = z.object({
feedbackMessage: z.string(),
})
