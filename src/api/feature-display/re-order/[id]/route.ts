import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"

export const POST = async (
    req: MedusaRequest, 
    res: MedusaResponse
) => {
    res.json({
        images: "REORDER IMAGES",
    })
}