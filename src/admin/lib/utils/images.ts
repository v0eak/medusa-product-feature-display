import { FormImage } from "../../types/shared";

const splitImages = (
  images: FormImage[]
): { uploadImages: FormImage[]; existingImages: FormImage[] } => {
  const uploadImages: FormImage[] = [];
  const existingImages: FormImage[] = [];

  images.forEach((image) => {
    if (image.nativeFile) {
      uploadImages.push(image);
    } else {
      existingImages.push(image);
    }
  });

  return { uploadImages, existingImages };
};

const createImages = async (createImage, images) => {
  const createdImages = [];

  for (const item of images) {
    try {
      const createdImage = await createImage(item.url);
      createdImages.push(createdImage);
    } catch (error) {
      console.error("Error creating image:", error);
      // Optionally, handle the error, e.g., by continuing with the next image
    }
  }

  return createdImages;
};

export const prepareImages = async (createImage, images: FormImage[], uploads: any) => {
  const { uploadImages, existingImages } = splitImages(images);

  let uploadedImgs: FormImage[] = [];
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile);
    const { uploads: uploaded } = await uploads.create(files);
    const createdImages = await createImages(createImage, uploaded)
    uploadedImgs = createdImages;
  }

  return [...existingImages, ...uploadedImgs];
};