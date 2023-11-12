import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import ImageService from "../../services/image"
  
export const POST = async (
    req: MedusaRequest, 
    res: MedusaResponse
) => {
    const imageService: ImageService = req.scope.resolve("imageService")

    if (!req.body.url) {
        throw new Error("Missing URL Key in Body!")
    }

    const image = await imageService.createImage(req.body)

    res.json({
        image: image,
    })
}