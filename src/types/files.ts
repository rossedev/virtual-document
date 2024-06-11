export interface FileData {
  id?: string
  idDocument: string
  firstName: string
  lastName: string
  fileName: string
  amountOfPages: number
  elementNumber: string
  file: any
  typeFile: string
  userId: string
  pin: boolean
}

export interface FilesState {
  files: FileData[]
}
