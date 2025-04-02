import z from 'zod'

export const createAppealDto = z.object({
title: z.string(),
message: z.string(),
})

export type CreateAppeal = z.infer<typeof createAppealDto>