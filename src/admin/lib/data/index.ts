import { useAdminCustomPost, useAdminCustomDelete, useAdminCustomQuery } from "medusa-react"

let notify;

export const initializeNotify = (notifyFunction) => {
  notify = notifyFunction;
};

export const useReorderFeatureDisplays = () => {
    const { mutate: mutateReorderFeatureDisplay } = useAdminCustomPost(
        `/feature-display/re-order`,
        ["feature-displays"]
    )
    
    const reorderFeatureDisplays = async (fds) => {
        // ${BACKEND_URL}/feature-display/re-order
        return mutateReorderFeatureDisplay(
            { feature_displays: fds },
            {
                onSuccess: (data: any) => {
                    // Handle successful responses
                    notify.success("Success", "Successfully reordered Feature Displays!")
                    return data.feature_displays
                },
                onError: (error) => {
                    // Handle non-successful responses (e.g., 404, 500, etc.)
                    notify.error("Error", `Failed to reorder Feature Displays ${error}`)
                    throw new Error('Failed to reorder Feature Displays.')
                },
            }
        )
    }

    return reorderFeatureDisplays
}

export const useReorderImages = () => {
    const { mutate: mutateReorderImages} = useAdminCustomPost(
        `/images`,
        ["image"]
    )
    
    const reorderImages = async (fdID, images) => {
        // ${BACKEND_URL}/feature-display/re-order/${fdID}
        return mutateReorderImages(
            { images },
            {
                onSuccess: (data) => {
                    // Handle successful responses
                    notify.success("Success", "Successfully reordered Feature Display Images!")
                    //const { image } = data.json()
                    return// image
                },
                onError: (error) => {
                    // Handle non-successful responses (e.g., 404, 500, etc.)
                    notify.error("Error", `Failed to reorder Images ${error}`)
                    throw new Error('Failed to reorder Images.')
                },
            }
        )
    }

    return reorderImages
}

export const useCreateImage = () => {
    const { mutate: mutateCreateImage } = useAdminCustomPost(
        `/images`,
        ["image"]
    );
    
    const createImage = (imageURL) => {
        return new Promise((resolve, reject) => {
            mutateCreateImage(
                { url: imageURL },
                {
                    onSuccess: (data: any) => {
                        notify.success("Success", "Successfully created Image!");
                        resolve(data.image); // Resolve the promise with the image data
                    },
                    onError: (error) => {
                        notify.error("Error", `Failed to create Image ${error}`);
                        reject(new Error('Failed to create Image.')); // Reject the promise on error
                    },
                }
            );
        });
    };

    return createImage;
};


export const useCreateFeatureDisplay = () => {
    const { mutate: mutateCreateFeatureDisplay } = useAdminCustomPost(
        `/feature-display`,
        ["feature_display"]
    )
    
    const createFeatureDisplay = async (product, title, description, images, metadata, fds?) => {
        // ${BACKEND_URL}/feature-display
        let highestOrder = 0
        if (fds) {
            highestOrder = Math.max(...fds.map(fd => fd.order));
            highestOrder++
        }
    
        return mutateCreateFeatureDisplay(
            {
                title,
                description,
                product: product.id,
                images,
                order: highestOrder,
                metadata
            },
            {
                onSuccess: (data: any) => {
                    // Handle successful responses
                    notify.success("Success", "Successfully created Feature Display!")
                    return data.feature_display
                },
                onError: (error) => {
                    // Handle non-successful responses (e.g., 404, 500, etc.)
                    notify.error("Error", `Failed to create Feature Display ${error}`)
                    throw new Error('Failed to create Feature Display.')
                },
            }
        )
    }

    return createFeatureDisplay
}