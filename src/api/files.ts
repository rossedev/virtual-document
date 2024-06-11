import type { FileData } from '@/types/files'
import axios from 'axios'

const setFiles = async (formData: any) => {
  return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/files`, formData)
}

export const getFiles = async (params: any) => {
  return await axios.get(`${import.meta.env.VITE_BACKEND_URL}/files`, { params })
}

export const deleteFile = async (fileId: string) => {
  return await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/files/${fileId}`)
}

export const editFile = async (updatedFile: any) => {
  return await axios.put(`${import.meta.env.VITE_BACKEND_URL}/files/${updatedFile.id}`, updatedFile)
}

export const createFile = async (newFile: FileData) => {
  try {
    const response = await setFiles(newFile)
    return response
  } catch (error) {
    throw new Error(`There was an error in saving the data ${error}`)
  }
}
