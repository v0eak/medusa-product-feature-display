import { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useMedusa, useAdminCustomPost } from "medusa-react"
import { FocusModal, Button, Heading } from "@medusajs/ui"

import { useCreateFeatureDisplay, useCreateImage } from '../../lib/data'
import MediaForm, { MediaFormType, ImageType } from '../forms/product/media-form'

import { nestedForm } from '../../lib/utils/nested-form'
import { prepareImages } from '../../lib/utils/images'
import { FeatureDisplay } from '../../../models/feature-display'
import { FormImage } from '../../types/shared'
import Metadata from '../metadata'

type MediaFormWrapper = {
    media: MediaFormType
}

export default function Modal ({featureDisplays, product, entityToEdit, state, closeEdit, notify, getFeatureDisplays}) {
    const [metadata, setMetadata] = useState(null);
    const { client } = useMedusa();
    const titleRef = useRef(null)
    const descriptionRef = useRef(null)
    const form = useForm<MediaFormWrapper>({
        defaultValues: {}
    })

    const createFeatureDisplay = useCreateFeatureDisplay()
    const createImage = useCreateImage()
    const { mutate: mutateUpdateFeatureDisplay } = useAdminCustomPost(
        `/feature-display/${entityToEdit?.id}`,
        ["feature_display"]
    )

    const updateFeatureDisplay = async (title, description, images, metadata) => {
        // ${BACKEND_URL}/feature-display/${fd.id}
        return mutateUpdateFeatureDisplay(
            {
                title,
                description,
                images,
                metadata
            },
            {
                onSuccess: (data: any) => {
                    // Handle successful responses
                    notify.success("Success", "Successfully updated Feature Display!")
                    return data.feature_display
                },
                onError: (error) => {
                    // Handle non-successful responses (e.g., 404, 500, etc.)
                    notify.error("Error", `Failed to update Feature Display ${error}`)
                    throw new Error('Failed to update Feature Display.')
                },
            }
        )
    }

    const {
        formState: { isDirty },
        handleSubmit,
        reset
    } = form

    const onReset = async () => {
        closeEdit()
        reset(getDefaultValues(entityToEdit))
    }

    useEffect(() => {
        reset(getDefaultValues(entityToEdit))
    }, [entityToEdit, form]);

    const commitdata = handleSubmit(async (data: any) => {
        let preppedImages: FormImage[] = [];
        let metadataHasEmptyKeyOrValue = false;

        if (metadata !== null) {
            const isEmpty = str => typeof str === 'string' && str.trim() === "";
            metadataHasEmptyKeyOrValue = metadata.some(
                ({ key, value }) => isEmpty(key) || isEmpty(value)
            );
        }
        if (metadataHasEmptyKeyOrValue) {
            return notify.warn("Warning", "A key or value in the metadata is empty. Please delete the empty entry or populate it.");
        }

        const metadataObj = metadata !== null ? 
            metadata.reduce((acc, { key, value }) => { acc[key] = value; return acc }, {}) 
            : null

        try {
            preppedImages = await prepareImages(
                createImage,
                data.media.images,
                client.admin.uploads
            );
        } catch (error) {
            let errorMessage = 'Something went wrong while trying to upload images.';
            const response = (error as any).response as Response;
      
            if (response.status === 500) {
              errorMessage = `${errorMessage} You might not have a file service configured. Please contact your administrator.`;
            }
      
            notify.error('Error', errorMessage);
            return;
        }
        console.log(preppedImages)
        const imageIds = preppedImages.map((image) => image.id);

        if (!entityToEdit) {
            if (featureDisplays?.length !== 0 ) {
                await createFeatureDisplay(product, titleRef.current.value, descriptionRef.current.value, imageIds, metadataObj, featureDisplays)
            } else {
                await createFeatureDisplay(product, titleRef.current.value, descriptionRef.current.value, imageIds, metadataObj)
            }
        } else {
            await updateFeatureDisplay(titleRef.current.value, descriptionRef.current.value, imageIds, metadataObj)
        }

        await getFeatureDisplays()
        onReset()
    })

    return (
        <FocusModal
            open={state}
            onOpenChange={(modalOpened) => {
                if (!modalOpened) {
                    onReset()
                }
            }}
        >
            <FocusModal.Content className="overflow-y-scroll">
                <FocusModal.Header>
                    <Button onClick={() => {commitdata()}} type="button">Save</Button>
                </FocusModal.Header>
                <FocusModal.Body>
                    <div className="p-10">
                        <Heading className="pb-6">{entityToEdit ? `Edit ${entityToEdit.title}` : 'Create new Feature Display'}</Heading>
                        <div className="flex flex-col gap-y-3 pb-6">
                            <span>Edit Title</span>
                            <input
                                ref={titleRef}
                                placeholder='Type your title here...'
                                defaultValue={entityToEdit?.title}
                                className="relative min-w-full h-10 p-4 text-gray-600 dark:text-gray-200 text-sm outline-none whitespace-pre-wrap word border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-y-3 pb-12">
                            <span>Edit Description</span>
                            <textarea
                                ref={descriptionRef}
                                placeholder='Type your description here...'
                                defaultValue={entityToEdit?.description}
                                className="relative min-w-full min-h-[5rem] p-4 text-gray-600 dark:text-gray-200 text-sm outline-none whitespace-pre-wrap word border border-gray-200 rounded-lg"
                            />
                        </div>
                        <MediaForm form={nestedForm(form, "media")} />
                        <div className="flex flex-col gap-y-3 pt-6">
                            <span>Edit Metadata</span>
                            <Metadata fd={entityToEdit} notify={notify} metadata={metadata} setMetadata={setMetadata} />
                        </div>
                    </div>
                </FocusModal.Body>
            </FocusModal.Content>
        </FocusModal>
    )
}

const getDefaultValues = (
    feature_display: FeatureDisplay
): MediaFormWrapper => {
    return {
      media: {
        images:
          feature_display?.images.map((image) => ({
            id: image.id,
            url: image.url,
            selected: false,
          })) || [],
      },
    }
}