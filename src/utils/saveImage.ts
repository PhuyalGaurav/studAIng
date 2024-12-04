import axios from 'axios';

export default async function saveImage(formData : FormData) : Promise<string> {
  try {
    const uploadResponse = await axios.post(`/api/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!uploadResponse) {
      throw new Error('Failed to save image');
    }

    const iamgeName = uploadResponse.data.imageName

    const imageUrlResponse = await axios.get(`/api/image/${iamgeName}`);
    console.log(imageUrlResponse.data.imageUrl)

    const imageUrl = imageUrlResponse.data.imageUrl

    return imageUrl;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}