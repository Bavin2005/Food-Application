import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async (event) => {
  let toastId = null;

  const image = await getImage(event);
  if (!image) return null;

  const formData = new FormData();
  formData.append('image', image, image.name);

  try {
    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: ({ loaded, total }) => {
        const progress = Math.round((loaded / total) * 100);
        if (toastId) {
          toast.update(toastId, { render: `Uploading... ${progress}%`, progress });
        } else {
          toastId = toast.success('Uploading...', { progress });
        }
      },
    });

    toast.dismiss(toastId);
    return response.data.imageUrl;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Upload failed! ' + (error.response?.data?.error || 'Server error'));
    return null;
  }
};

const getImage = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) {
    toast.warning('No file selected!');
    return null;
  }

  const file = files[0];

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    toast.error('Only JPG and PNG formats are allowed!');
    return null;
  }

  return file;
};
