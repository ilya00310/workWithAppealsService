import z from 'zod'

export const createAppealDto = z.object({
title: z.string(),
message: z.string(),
})

export type CreateAppealDto = z.infer<typeof createAppealDto>