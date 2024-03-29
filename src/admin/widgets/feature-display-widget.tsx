import type { 
    WidgetConfig, 
    ProductDetailsWidgetProps,
} from "@medusajs/admin"
import React, { useEffect, useRef, useState } from 'react';
import { useAdminProducts } from "medusa-react"
import { Container, Heading, Button, useToggleState } from '@medusajs/ui'
import { DotsSix } from "@medusajs/icons"
import { FeatureDisplay } from "../../models/feature-display";
import { initializeNotify, useReorderFeatureDisplays } from "../lib/data"
import FDButton from "../components/organisms/fd-button";
import Modal from "../components/organisms/modal";
  
const ProductWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
    const [featureDisplays, setFeatureDisplays] = useState(product.feature_displays);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const [state, openEdit, closeEdit, toggle] = useToggleState()
    const [entityToEdit, setEntityToEdit] = useState<FeatureDisplay>(null)

    const { refetch } = useAdminProducts({
        id: product.id,
    })

    const reorderFeatureDisplays = useReorderFeatureDisplays()

    const handleDragStart = (index) => {
        dragItem.current = index;
    };

    const handleDragEnter = (index) => {
        dragOverItem.current = index;
    };

    const handleDrop = () => {
        const copyListItems = [...featureDisplays];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);

        dragItem.current = null;
        dragOverItem.current = null;
        setFeatureDisplays(copyListItems);
    };

    const editFeatureDisplay = async (fd?) => {
        if (!fd) {
            setEntityToEdit(null)
        } else {
            setEntityToEdit(fd)
        }
        openEdit()
    }

    useEffect(() => {
        initializeNotify(notify)
    }, [])

    useEffect(() => {
        setFeatureDisplays(product.feature_displays)
    }, [product])

    return (
        <Container>
            <Heading level="h1" className="font-semibold pb-2">
                <span>Feature Displays</span>
            </Heading>
            <style>
                {`
                    .fade-out-text {
                        position: relative;
                        overflow: hidden;
                      }
                      
                      .fade-out-text::before {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 100%;
                        height: 1.5em; /* Height of the fade effect */
                        background: linear-gradient(to right, transparent, white 100%);
                        pointer-events: none; /* Allows text selection behind the fade */
                    }

                      .grabbable {
                            cursor: grab;
                            cursor: -moz-grab;
                            cursor: -webkit-grab;
                        }
                        
                        .grabbable:active {
                            cursor: grabbing;
                            cursor: -moz-grabbing;
                            cursor: -webkit-grabbing;
                        }
                `}
            </style>

            <Modal featureDisplays={featureDisplays} product={product} entityToEdit={entityToEdit} state={state} closeEdit={closeEdit} notify={notify} getFeatureDisplays={refetch} />

            <div className="flex flex-col gap-y-4 pb-4">
                {featureDisplays?.map((fd, index) => (
                    <div key={fd.id} onDragOver={(e) => e.preventDefault()} className={`w-full flex items-center justify-between pb-4 ${index + 1 !== featureDisplays.length && 'border-b border-b-gray-200'}`}>
                        <div className="flex items-stretch">
                            <div
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragEnter={() => handleDragEnter(index)}
                                onDrop={handleDrop}
                                className="pl-2 pr-4 flex items-center justify-center grabbable"
                            >
                                <DotsSix />
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <span className="font-bold">{fd.title}</span>
                                <span className="fade-out-text">{fd.description.length > 160 ? `${fd.description.substring(0, 160)}...` : fd.description}</span>
                                <div className="flex gap-x-1.5 overflow-scroll">
                                    {fd.images.map((image) => (
                                        image.url?.endsWith('.webm') ? (
                                            <video key={image.id} autoPlay loop muted typeof="video/mp4" src={image.url} className="h-24" />
                                        ) : (
                                            <img key={image.id} src={image.url} alt="Image" className="h-24" />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-3">
                            <FDButton editFeatureDisplay={editFeatureDisplay} getFeatureDisplays={refetch} fd={fd} notify={notify} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <Button onClick={() => editFeatureDisplay()} type="button" variant="secondary" className="px-2.5 py-1">Create Feature Display</Button>
                <Button onClick={() => reorderFeatureDisplays(featureDisplays)} type="button" className="px-2.5 py-1">Save changes</Button>
            </div>
        </Container>
    )
}
  
export const config: WidgetConfig = {
    zone: "product.details.after",
}

export default ProductWidget