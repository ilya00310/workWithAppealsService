import { Appeal } from "../schemas/appeal.type";
import { CreateAppeal } from "../schemas/createAppeal.dto.type";
import { PrismaClient, ProcessingWorkProcess } from '@prisma/client'
import createError from 'http-errors'
import { UpdateAppeal } from "../schemas/updateAppeal.type";

const prisma = new PrismaClient()

export enum ConditionUpdateProcess {
    start,
    canceled, 
    completion
}

export const createAppeal = async (data: CreateAppeal): Promise<Appeal> => {
    try {
    const newAppeal: Appeal = await prisma.appeal.create({
    data
})
return newAppeal
    }catch{
        throw createError(500, 'Appeal wasn\'t added in the database')            
    }
}

const getCurrentProcess = async (id: string): Promise<ProcessingWorkProcess> => {
const currentAppeal = await prisma.appeal.findFirst({
    where: { id }
})
if (!currentAppeal) throw createError(404, 'Appeal with current id don\'t found')
    return currentAppeal.processingWork
}

const updateDbForChangeProcess = async (id:string,condition: ConditionUpdateProcess, message?:string): Promise<Appeal> => {
    const typeCurrentProcess =  condition === ConditionUpdateProcess.start  ? ProcessingWorkProcess.atWork : ProcessingWorkProcess.canceled
    const updateAppeal = await prisma.appeal.update({
        where: { id },
        data: {
            processingWork: typeCurrentProcess, 
            feedbackMessage: message || null,        
        }
    })
    if (!updateAppeal) throw createError(404, 'Appeal with current id don\'t found')
        return updateAppeal
    }

export const updateWorkAppeal = async (id: string, condition: ConditionUpdateProcess, feedbackMessage?: string): Promise<Appeal> => {
    const currentProcess: ProcessingWorkProcess = await getCurrentProcess(id)
    if (currentProcess === ProcessingWorkProcess.completed) {
        throw createError(409, 'The problem has already been solved')
    }
    return await updateDbForChangeProcess(id, condition, feedbackMessage)
}
