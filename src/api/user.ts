import axios from 'axios'

type TUsersProps = {
  email: string
  password?: string
}

type TCompleteUsersProps = {
  name: string
  email: string
  password: string
}

const getUsers = async (params: TUsersProps) => {
  return await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
    params
  })
}

export const getAllUsers = async () => {
  return await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`)
}

const setUsers = async (params: TUsersProps) => {
  return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, {
    ...params
  })
}

export async function logInUsers(params: TUsersProps) {
  try {
    const response = await getUsers(params)

    if (!!response.data && !response?.data?.[0]) {
      throw new Error('There was an error in obtaining the data')
    }
    const uniqueUser = response.data[0]
    const hasSamePassoword = uniqueUser.password === params.password

    if (!hasSamePassoword) {
      throw new Error('The password is incorrect, try again')
    }

    return uniqueUser
  } catch (error) {
    throw new Error(`Error in catch ${error}`)
  }
}

export async function saveUser(params: TCompleteUsersProps) {
  try {
    const existUser = await getUsers({ email: params.email })

    if (existUser.data && existUser.data.length > 0) {
      throw new Error('Email is already registered')
    }

    const response = await setUsers(params)

    if (response.status !== 201) {
      throw new Error('There was an error in obtaining the data')
    }

    return response.data
  } catch (error) {
    throw new Error(`Error in catch ${error}`)
  }
}
