import { FormImage } from "../../types/shared";
import { createImage } from "../data";

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

const createImages = async (images) => {
  return await Promise.all(
    images.map(item => createImage(item.url))
  )
}

export const prepareImages = async (images: FormImage[], uploads: any) => {
  const { uploadImages, existingImages } = splitImages(images);

  let uploadedImgs: FormImage[] = [];
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile);
    const { uploads: uploaded } = await uploads.create(files);
    const createdImages = await createImages(uploaded)
    uploadedImgs = createdImages;
  }

  return [...existingImages, ...uploadedImgs];
};