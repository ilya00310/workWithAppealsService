import { ProcessingWorkProcess } from "@prisma/client"

export type Appeal = { 
id : string, 
title: string,
message: string,
feedbackMessage: string | null,
processingWork: ProcessingWorkProcess,
createdAt: Date
}