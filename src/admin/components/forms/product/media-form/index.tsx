import clsx from "clsx"
import { useMemo } from "react"
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useWatch,
} from "react-hook-form"
import { FormImage } from "../../../../types/shared"
import { NestedForm } from "../../../../lib/utils/nested-form"
import FileUploadField from "../../../atoms/file-upload-field"
import { Button } from "@medusajs/ui"
import { CheckCircleSolid, DotsSix } from "@medusajs/icons"


export type ImageType = { selected: boolean } & FormImage

export type MediaFormType = {
  images: ImageType[]
}

type Props = {
  form: NestedForm<MediaFormType>
}

const MediaForm = ({ form }: Props) => {
  const { control, path, setValue } = form

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: path("images"),
  })

  const handleFilesChosen = (files: File[]) => {
    if (files.length) {
      const toAppend = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        nativeFile: file,
        selected: false,
      }))

      append(toAppend)
    }
  }

  const images = useWatch({
    control,
    name: path("images"),
    defaultValue: [],
  })

  const selected = useMemo(() => {
    const selected: number[] = []

    images.forEach((i, index) => {
      if (i.selected) {
        selected.push(index)
      }
    })

    return selected
  }, [images])

  const handleRemove = () => {
    remove(selected)
  }

  const handleDeselect = () => {
    selected.forEach((i) => {
      setValue(path(`images.${i}.selected`), false)
    })
  }

  return (
    <div>
      <div>
        <div>
          <FileUploadField
            onFileChosen={handleFilesChosen}
            placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
            multiple
            filetypes={["image/gif", "image/jpeg", "image/png", "image/webp", "video/webm"]}
            className="py-large"
          />
        </div>
      </div>
      {fields.length > 0 && (
        <div className="mt-large">
          <div className="mb-small flex items-center justify-between">
            <h2>Edit Images</h2>
            <ModalActions
              number={selected.length}
              onDeselect={handleDeselect}
              onRemove={handleRemove}
            />
          </div>
          <div className="gap-y-2xsmall grid grid-cols-8 gap-x-1.5 pt-4">
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex flex-col items-center group">
                    <div
                        draggable
                        className="pt-2 pb-4 w-full flex items-center justify-center grabbable"
                    >
                        <DotsSix className="rotate-90" />
                    </div>
                    <Image
                      key={field.id}
                      image={field}
                      index={index}
                      remove={remove}
                      form={form}
                    />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

type ImageProps = {
  image: FieldArrayWithId<MediaFormType, "images", "id">
  index: number
  remove: (index: number) => void
  form: NestedForm<MediaFormType>
}

const Image = ({ image, index, form, remove }: ImageProps) => {
  const { control, path } = form



  return (
    <Controller
      name={path(`images.${index}.selected`)}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="relative">
            <button
              className={clsx(
                "px-base py-xsmall hover:bg-grey-5 rounded-rounded group flex items-center justify-between",
                {
                  "bg-grey-5": value,
                }
              )}
              type="button"
              onClick={() => onChange(!value)}
            >
              <div className="flex flex-col items-center justify-center gap-y-1">
                <div className="flex h-36 w-auto items-center justify-center">
                  {
                    image.url?.endsWith('.webm') ? (
                        <video autoPlay loop muted typeof="video/mp4" src={image.url} className="rounded-rounded max-h-36" />
                    ) : (
                        <img key={image.id} src={image.url} alt={image.name || "Uploaded image"} className="rounded-rounded max-h-36" />
                    )
                  }
                </div>
                <div className="inter-small-regular flex flex-col text-left">
                  <p>{image.name}</p>
                  <p className="text-grey-50">
                    {image.size ? `${(image.size / 1024).toFixed(2)} KB` : ""}
                  </p>
                </div>
              </div>
              <div className="gap-x-base flex items-center">
                <span
                  className={clsx("hidden", {
                    "!text-violet-60 !block": value,
                  })}
                >
                  <CheckCircleSolid className="h-6 w-6" />
                </span>
              </div>
            </button>

          </div>
        )
      }}
    />
  )
}

type ModalActionsProps = {
  number: number
  onRemove: () => void
  onDeselect: () => void
}

const ModalActions = ({ number, onRemove, onDeselect }: ModalActionsProps) => {
  return (
    <div className="flex h-10 items-center overflow-y-hidden pr-1">
      <div
        className={clsx(
          "gap-x-small flex items-center transition-all duration-200",
          {
            "translate-y-[-42px]": !number,
            "translate-y-[0px]": number,
          }
        )}
      >
        <span>{number} selected</span>
        <div className="bg-grey-20 h-5 w-px" />
        <div className="gap-x-xsmall flex items-center">
          <Button
            variant="secondary"
            type="button"
            onClick={onDeselect}
          >
            Deselect
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={onRemove}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MediaForm
