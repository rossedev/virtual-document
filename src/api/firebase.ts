import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'

export const uploadFilesToFirebase = async (file: any) => {
  const storageRefs = storageRef(storage, 'files/' + file?.name)
  await uploadBytes(storageRefs, file)
  const downloadURL = await getDownloadURL(storageRefs)
  const imageUrl = downloadURL.toString()
  return imageUrl
}
