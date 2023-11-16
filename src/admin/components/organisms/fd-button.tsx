import { useAdminCustomDelete } from "medusa-react"
import { DropdownMenu, IconButton, usePrompt } from "@medusajs/ui"
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"

export default function FDButton ({editFeatureDisplay, getFeatureDisplays, fd, notify}) {
    const dialog = usePrompt()
    const { mutate: mutateDeleteFeatureDisplay } = useAdminCustomDelete(
        `/feature-display/${fd.id}`,
        ["feature_display"]
    )

    const deleteFeatureDisplay = async () => {
        // ${BACKEND_URL}/feature-display/${fd.id}
        return mutateDeleteFeatureDisplay(
            undefined,
            {
                onSuccess: (data: any) => {
                    // Handle successful responses
                    notify.success("Success", "Successfully deleted Feature Display!")
                    return data.feature_display
                },
                onError: (error) => {
                    // Handle non-successful responses (e.g., 404, 500, etc.)
                    notify.error("Error", `Failed to delete Feature Display ${error}`)
                    throw new Error('Failed to delete Feature Display.')
                },
            }
        )
    }

    const deleteConfirmation = async (fd) => {
        const confirmed = await dialog({
            title: `Delete Feature Display ${fd.title}`,
            description: "Are you sure? This cannot be undone."
        })

        if (confirmed) {
            await deleteFeatureDisplay()
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