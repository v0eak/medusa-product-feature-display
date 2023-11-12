import { DropdownMenu, IconButton } from "@medusajs/ui"
import { EllipsisHorizontal, PencilSquare, Trash, DotsSix } from "@medusajs/icons"

export default function FDButton ({editFeatureDisplay, deleteConfirmation, fd}) {
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