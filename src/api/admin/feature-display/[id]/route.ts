import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import FeatureDisplayService from "../../../../services/feature-display"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const id = req.params.id
    const featureDisplayService: FeatureDisplayService = req.scope.resolve("featureDisplayService")
    const featureDisplay = await featureDisplayService.retrieveFeatureDisplayById(id)

    res.json({
        feature_display: featureDisplay,
    })
}
  
export const POST = async (
    req: MedusaRequest, 
    res: MedusaResponse
) => {
    const id = req.params.id
    const featureDisplayService: FeatureDisplayService = req.scope.resolve("featureDisplayService")

    if (!req.body.title && !req.body.description && !req.body.images && !req.body.metadata) {
        throw new Error("Missing required Keys in Body!")
    }

    const featureDisplay = await featureDisplayService.updateFeatureDisplay(id, req.body)

    res.json({
        feature_display: featureDisplay,
    })
}

export const DELETE = async (
    req: MedusaRequest, 
    res: MedusaResponse
) => {
    const id = req.params.id
    const featureDisplayService: FeatureDisplayService = req.scope.resolve("featureDisplayService")
    const featureDisplay = await featureDisplayService.deleteFeatureDisplay(id)

    res.json({
        feature_display: featureDisplay,
    })
}