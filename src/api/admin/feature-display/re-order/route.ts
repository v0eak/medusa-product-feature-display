import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import FeatureDisplayService from "../../../../services/feature-display"

export const POST = async (
    req: MedusaRequest, 
    res: MedusaResponse
) => {
    const featureDisplayService: FeatureDisplayService = req.scope.resolve("featureDisplayService")

    if (!req.body.feature_displays) {
        throw new Error("Missing Feature Displays in Body!")
    }

    const featureDisplays = await featureDisplayService.reorderFeatureDisplays(req.body)

    res.json({
        feature_displays: featureDisplays,
    })
}