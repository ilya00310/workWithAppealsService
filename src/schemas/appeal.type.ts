import { ProcessingWorkProcess } from "@prisma/client"

export type Appeal = { 
id : string, 
title: string,
message: string,
lastFeedbackMessage: string | null,
processingWork: ProcessingWorkProcess,
createdAt: Date
}