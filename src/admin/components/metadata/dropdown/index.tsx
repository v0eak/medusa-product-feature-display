import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button } from "@medusajs/ui"
import { Trash, ArrowDownMini, ArrowUpMini, EllipsisVertical } from "@medusajs/icons"
import clsx from "clsx"
import { useEffect, useState } from "react"

export default function Dropdown ({
    metadata,
    setMetadata,
    index,
    notify,
    setOpenDropdownIndex
  }) {
    const itemClasses = "px-base py-[6px] outline-none flex items-center gap-x-xsmall hover:bg-grey-5 focus:bg-grey-10 transition-colors cursor-pointer"
    const [isDisabled, setIsDisabled] = useState(true);

    const onInsertAbove = (index) => {
        if (metadata !== null) {
            const newMetadata = [...metadata];
            newMetadata.splice(index, 0, { key: '', value: '' });
            setMetadata(newMetadata)
            notify.success("success", "Insert Above!")
        } else {
            setMetadata([{ key: '', value: '' }, { key: '', value: '' }]);
            setOpenDropdownIndex(null)
        }
      };
    
      const onInsertBelow = (index) => {
        if (metadata !== null) {
            const newMetadata = [...metadata];
            newMetadata.splice(index + 1, 0, { key: '', value: '' });
            setMetadata(newMetadata)
            notify.success("success", "Insert Below!")
        } else {
            setMetadata([{ key: '', value: '' }, { key: '', value: '' }]);
            setOpenDropdownIndex(null)
        }
      }
    
      const onDelete = (index) => {
        if (isDisabled) {
            return notify.error("Error", "Can't Delete this Row! At least one Row has to present.")
        }
        if (metadata.length === 1) {
            setMetadata(null)
            setOpenDropdownIndex(null)
        } else {
            const newMetadata = [...metadata];
            newMetadata.splice(index, 1)
            setMetadata(newMetadata);
        }
        notify.success("success", "Delete!")
      }

      useEffect(() => {
        if (metadata !== null) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
      }, [metadata])

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu.Root onOpenChange={isOpen => setOpenDropdownIndex(isOpen ? index : null)}>
                <DropdownMenu.Trigger asChild>
                    <Button type="button" variant="secondary" className="border-0 px-1.5 py-0.5">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenu.Trigger>
                
                <DropdownMenu.Content asChild sideOffset={8} className="visible z-50">
                    <div className="bg-grey-0 shadow-dropdown border-grey-20 rounded-rounded overflow-hidden border">
                        <DropdownMenu.Item onClick={() => onInsertAbove(index)} className={itemClasses}>
                            <ArrowUpMini className="h-5" />
                            <span>Insert above</span>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item onClick={() => onInsertBelow(index)} className={itemClasses}>
                            <ArrowDownMini className="h-5" />
                            <span>Insert below</span>
                        </DropdownMenu.Item>
                        
                        <DropdownMenu.DropdownMenuSeparator className="bg-grey-20 h-px w-full" />

                        <DropdownMenu.Item onClick={() => onDelete(index)} disabled={isDisabled} className={clsx(
                            {
                            "text-grey-40": isDisabled,
                            "text-rose-50": !isDisabled,
                            },
                            itemClasses
                        )}>
                            <Trash className="h-5" />
                            <span>Delete</span>
                        </DropdownMenu.Item>
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    )
}