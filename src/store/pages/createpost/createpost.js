import axiosRequest from '@/lib/axiosRequest'
export const api = 'https://instagram-api.softclub.tj/Post/add-post	'
export const addUser = async formdata => {
	try {
		const response = await axiosRequest.post(api, formdata)
		return response.data
	} catch (error) {
		console.error('Error adding user:', error)
		throw error
	}
}
