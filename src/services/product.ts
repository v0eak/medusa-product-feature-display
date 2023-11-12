import { Lifetime } from "awilix" 
import { ProductService as MedusaProductService } from '@medusajs/medusa';
import FeatureDisplayService from "./feature-display";
import { FindProductConfig, ProductSelector } from "@medusajs/medusa/dist/types/product";

class ProductService extends MedusaProductService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly featureDisplayService: FeatureDisplayService;;

    constructor(container) {
        super(container);

        this.featureDisplayService = container.featureDisplayService;
    }

    async retrieve(productId: string, config: FindProductConfig = {}) {
        // Call the original retrieve method
        const product = await super.retrieve(productId, config);
        console.log("asd")

        // Add custom logic for feature_displays
        if (product.feature_displays && product.feature_displays.length > 0) {
            for (let fd of product.feature_displays) {
                fd.images = await this.featureDisplayService.retrieveFeatureDisplayImages(fd.id);
            }
            product.feature_displays.sort((a, b) => a.order - b.order);
        }

        return product;
    }

    async listAndCount(selector: ProductSelector, config: FindProductConfig = {}) {
        // Call the original retrieve method
        const products = await super.listAndCount(selector, config);
        
        for (let product of products[0]) {
            if (product.feature_displays && product.feature_displays.length > 0) {
                for (let fd of product.feature_displays) {
                    fd.images = await this.featureDisplayService.retrieveFeatureDisplayImages(fd.id);
                }
                product.feature_displays.sort((a, b) => a.order - b.order);
            }
        }

        return products;
    }
}

export default ProductService