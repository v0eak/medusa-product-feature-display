const BACKEND_URL = process.env.MEDUSA_ADMIN_BACKEND_URL;

export const reorderFeatureDisplays = async (fds) => {
    const response = await fetch(`${BACKEND_URL}/feature-display/re-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            feature_displays: fds,
      }),
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to reorder Feature Displays.')
    }

    return await response.json();
}

export const reorderImages = async (fdID, images) => {
    const response = await fetch(`${BACKEND_URL}/feature-display/re-order/${fdID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            images,
      }),
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to reorder Feature Displays.')
    }

    const { feature_display } = await response.json();

    return feature_display;
}

export const createImage = async (imageURL) => {
    const response = await fetch(`${BACKEND_URL}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: imageURL
      }),
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to create Image.')
    }

    const { image } = await response.json();

    return image;
}

export const createFeatureDisplay = async (product, title, description, images, metadata, fds?) => {
    let highestOrder = 0
    if (fds) {
        highestOrder = Math.max(...fds.map(fd => fd.order));
        highestOrder++
    }

    const response = await fetch(`${BACKEND_URL}/feature-display`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description,
            product: product.id,
            images,
            order: highestOrder,
            metadata
      }),
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to create Feature Display.')
    }

    const { feature_display } = await response.json();

    return feature_display;
}

export const deleteFeatureDisplay = async (fd) => {
    const response = await fetch(`${BACKEND_URL}/feature-display/${fd.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to fetch')
    }

    const { feature_display } = await response.json();

    return feature_display
}

export const retrieveFeatureDisplays = async (productID) => {
    const response = await fetch(`${BACKEND_URL}/admin/products/${productID}?expand=feature_displays`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to fetch')
    }

    const { product } = await response.json();

    return product.feature_displays
}

export const updateFeatureDisplay = async (fd, title, description, images, metadata) => {
    const response = await fetch(`${BACKEND_URL}/feature-display/${fd.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description,
            images,
            metadata
      }),
    })

    if (!response.ok) {
        // Handle non-successful responses (e.g., 404, 500, etc.)
        throw new Error('Failed to fetch')
    }

    const { feature_display } = await response.json();

    return feature_display;
}