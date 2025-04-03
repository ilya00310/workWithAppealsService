import { Appeal } from "../schemas/appeal.type";
import { CreateAppeal } from "../schemas/createAppeal.dto.type";
import { PrismaClient, ProcessingWorkProcess } from '@prisma/client'
import createError from 'http-errors'
import { ConditionCurrentFilter, FilterDateAppeal } from "../schemas/filterAppealDate.dto";

const prisma = new PrismaClient()

export enum ConditionUpdateProcess {
    start,
    cancellation, 
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

const getTypeCurrentProcess = (condition: ConditionUpdateProcess): ProcessingWorkProcess => {
    if (condition === ConditionUpdateProcess.start){
        return ProcessingWorkProcess.atWork
    } 
    if (condition === ConditionUpdateProcess.completion){
        return ProcessingWorkProcess.completed
    }
        return ProcessingWorkProcess.canceled
}

const updateDbForChangeProcess = async (id:string,condition: ConditionUpdateProcess, message?:string): Promise<Appeal> => {
    const typeCurrentProcess =  getTypeCurrentProcess(condition)
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
    if (currentProcess === ProcessingWorkProcess.completed && condition !== ConditionUpdateProcess.completion) {
        throw createError(409, 'The problem has already been solved')
    }
    if(currentProcess === ProcessingWorkProcess.new && condition !== ConditionUpdateProcess.start){
        throw createError(409, 'The appeal is not in working')
    }
    return await updateDbForChangeProcess(id, condition, feedbackMessage)
}

export const cancellationAppealsAtWork= async(feedbackMessage: string) => {
    await prisma.appeal.updateMany({
        where: {
            processingWork: ProcessingWorkProcess.atWork
        },
        data: {
            processingWork: ProcessingWorkProcess.canceled,
            feedbackMessage
        }
    })
}

const getConditionCurrentFilter = (dataFilter: FilterDateAppeal): ConditionCurrentFilter => {
    const { date, startDate, endDate } = dataFilter;
    if (date) {
        const currentDay = new Date(date)
        const nextDay   = new Date(currentDay)
        nextDay.setDate(currentDay.getDate() + 1);
        return {gte: currentDay, lt: nextDay}
    }
    const filter: ConditionCurrentFilter = {}
    if(startDate) filter.gte = new Date(startDate)
    if(endDate) filter.lte = new Date(endDate)
    return filter
}

export const  getFilterDateAppeals = async (dataFilter: FilterDateAppeal): Promise<Appeal[]> => {
const conditionCurrentFilter = getConditionCurrentFilter(dataFilter);
const appeals =  await prisma.appeal.findMany({
    where: {
        createdAt: conditionCurrentFilter
    }
});
return appeals
}