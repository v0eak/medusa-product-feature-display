import { DropdownMenu, IconButton, usePrompt } from "@medusajs/ui"
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"

import { deleteFeatureDisplay } from "../../lib/data"

export default function FDButton ({editFeatureDisplay, getFeatureDisplays, fd, notify}) {
    const dialog = usePrompt()

    const deleteConfirmation = async (fd) => {
        const confirmed = await dialog({
            title: `Delete Feature Display ${fd.title}`,
            description: "Are you sure? This cannot be undone."
        })

        if (confirmed) {
            try {
                await deleteFeatureDisplay(fd)
                notify.success("Success", `Deleted Feature Display ${fd.title}`)
            } catch (error) {
                notify.error("Error", `Failed to delete Feature Display ${error}`)
            }
            getFeatureDisplays()
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <IconButton>
                    <EllipsisHorizontal />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => editFeatureDisplay(fd)} className="gap-x-2">
                    <PencilSquare className="text-ui-fg-subtle" />
                    Edit
                </DropdownMenu.Item>

                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={() => deleteConfirmation(fd)} className="gap-x-2">
                    <Trash className="text-ui-fg-subtle" />
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    )
}