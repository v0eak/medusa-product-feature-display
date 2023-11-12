import { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useMedusa } from "medusa-react"
import { FocusModal, Button, Heading } from "@medusajs/ui"

import { createFeatureDisplay, updateFeatureDisplay } from '../../lib/data'
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

    const {
        formState: { isDirty },
        handleSubmit,
    } = form

    useEffect(() => {
        form.reset(entityToEdit ? getDefaultValues(entityToEdit) : {})
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
        const imageIds = preppedImages.map((image) => image.id);

        try {
            if (!entityToEdit) {
                if (featureDisplays.length !== 0 ) {
                    await createFeatureDisplay(product, titleRef.current.value, descriptionRef.current.value, imageIds, metadataObj, featureDisplays)
                } else {
                    await createFeatureDisplay(product, titleRef.current.value, descriptionRef.current.value, imageIds, metadataObj)
                }
                notify.success("Success", "Successfully created Feature Display!")
            } else {
                await updateFeatureDisplay(entityToEdit, titleRef.current.value, descriptionRef.current.value, imageIds, metadataObj)
                notify.success("Success", "Successfully updated Feature Display!")
            }
        } catch (error) {
            notify.error("Error", `Failed to create / update Feature Display ${error}`)
        }

        await getFeatureDisplays()

        closeEdit()
        form.reset(entityToEdit ? getDefaultValues(entityToEdit) : {})
    })

    return (
        <FocusModal
            open={state}
            onOpenChange={(modalOpened) => {
                if (!modalOpened) {
                    closeEdit()
                    form.reset(entityToEdit ? getDefaultValues(entityToEdit) : {})
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