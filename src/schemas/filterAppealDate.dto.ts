import z from 'zod'

export const filterDateAppealDto = z.object({
date: z.string().optional(),
startDate: z.string().optional(),
endDate: z.string().optional(),
})

export type ConditionCurrentFilter = {
    gte?: Date,
    lte?: Date,
    lt?: Date,
}
export type FilterDateAppeal = z.infer<typeof filterDateAppealDto>