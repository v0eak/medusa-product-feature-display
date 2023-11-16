import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import FeatureDisplayService from "../../../services/feature-display";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const featureDisplayService: FeatureDisplayService = req.scope.resolve("featureDisplayService")
    const featureDisplays = await featureDisplayService.retrieveFeatureDisplays()

    res.json({
        feature_displays: featureDisplays,
    })
}

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const featureDisplayService: FeatureDisplayService = req.scope.resolve("featureDisplayService")

    if (!req.body.product) {
        throw new Error("Product ID is required!")
    }

    const featureDisplay = await featureDisplayService.createFeatureDisplay(req.body)

    res.json({
        feature_display: featureDisplay,
    })
}