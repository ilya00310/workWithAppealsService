import { CreateAppealDto } from "../schemas/createAppeal.dto.type";
import { PrismaClient, ProcessingWorkProcess } from '@prisma/client'
import createError from 'http-errors'

const prisma = new PrismaClient()

export const createAppeal = async (data: CreateAppealDto) => {
    try {
    await prisma.appeal.create({
    data
})
    }catch{
        throw createError(500, 'Appeal wasn\'t added in the database')            
    }
}