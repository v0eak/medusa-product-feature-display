import { Lifetime } from "awilix" 
import { TransactionBaseService } from "@medusajs/medusa"
import ImageRepository from "@medusajs/medusa/dist/repositories/image"
import ProductRepository from "@medusajs/medusa/dist/repositories/product"
import { Repository, In } from "typeorm"
import { FeatureDisplay } from "../models/feature-display"

class FeatureDisplayService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly imageRepository_: typeof ImageRepository
    protected readonly productRepository_: typeof ProductRepository
    protected readonly featureDisplayRepository_: Repository<FeatureDisplay>

    constructor(container) {
        super(container);

        this.productRepository_ = container.productRepository
        this.imageRepository_ = container.imageRepository
        this.featureDisplayRepository_ = container.manager.getRepository("FeatureDisplay")
    }

    async createFeatureDisplay(data) {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_)
            const productRepo = manager.withRepository(this.productRepository_)
            const imageRepo = manager.withRepository(this.imageRepository_)
        
            const product = await productRepo.findOne({
                where: { id: data.product }
            });
            if (!product) {
                throw new Error("Product not found")
            }
            const images = await imageRepo.findBy({
                id: In(data.images || [])
            });

            if (images.length !== 0 && images.length !== data.images?.length) {
                // If not, it means one or more IDs were not found. Handle this case appropriately.
              
                // Create a set of found image IDs for easy lookup
                const foundImageIds = new Set(images.map(image => image.id));
              
                // Find which IDs were not found by filtering the original array
                const notFoundImageIds = data.images.filter(id => !foundImageIds.has(id));
              
                // Throw an error or handle the case as needed
                throw new Error(`Images with IDs [${notFoundImageIds.join(', ')}] not found.`);
            }
          
            const featureDisplay = new FeatureDisplay();
            featureDisplay.title = data.title;
            featureDisplay.description = data.description;
            featureDisplay.product = product;
            featureDisplay.images = images;
            featureDisplay.order = data.order;
            featureDisplay.metadata = data.metadata
            await featureDisplayRepo.save(featureDisplay);
          
            return featureDisplay;
        })
    }

    async deleteFeatureDisplay(id) {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_)
            featureDisplayRepo.delete(id)
        })
    }

    async updateFeatureDisplay(id, data) {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_)
            const imageRepo = manager.withRepository(this.imageRepository_)
            
            const featureDisplay = await featureDisplayRepo.findOne({
                where: { id: id },
                relations: ["images"]
            })
            if (!featureDisplay) {
                throw new Error("FeatureDisplay not found")
            }

            featureDisplay.title = data.title;
            featureDisplay.description = data.description;
            const images = await imageRepo.findBy({
                id: In(data.images)
            });

            if (images.length !== data.images.length) {
                // If not, it means one or more IDs were not found. Handle this case appropriately.
              
                // Create a set of found image IDs for easy lookup
                const foundImageIds = new Set(images.map(image => image.id));
              
                // Find which IDs were not found by filtering the original array
                const notFoundImageIds = data.images.filter(id => !foundImageIds.has(id));
              
                // Throw an error or handle the case as needed
                throw new Error(`Images with IDs [${notFoundImageIds.join(', ')}] not found.`);
            }

            featureDisplay.images = images
            featureDisplay.metadata = data.metadata;

            await featureDisplayRepo.save(featureDisplay);

            return featureDisplay
        })
    }

    async retrieveFeatureDisplays() {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_)

            const featureDisplays = await featureDisplayRepo.find({
                relations: ["images"]
            })

            featureDisplays.sort((a, b) => a.order - b.order);

            return featureDisplays
        })
    }

    async retrieveFeatureDisplayById(id) {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_)

            const featureDisplay = await featureDisplayRepo.findOne({
                where: { id: id },
                relations: ["images"]
            })
            if (!featureDisplay) {
                throw new Error("FeatureDisplay not found")
            }

            return featureDisplay
        })
    }

    async retrieveFeatureDisplayImages(id) {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_);
        
            // Retrieve the feature display with its images
            const featureDisplay = await featureDisplayRepo.findOne({ 
                where: { id: id },
                relations: ["images"]
            });
      
            if (!featureDisplay) {
              throw new Error("FeatureDisplay not found");
            }
      
            // Return only the images
            return featureDisplay.images;
        });
    }

    async reorderFeatureDisplays(data) {
        return this.atomicPhase_(async (manager) => {
            const featureDisplayRepo = manager.withRepository(this.featureDisplayRepository_);

            for (let i = 0; i < data.feature_displays.length; i++) {
                const fd = await this.retrieveFeatureDisplayById(data.feature_displays[i].id)

                fd.order = i;

                await featureDisplayRepo.save(fd);
            }

            return;
        })
    }
}

export default FeatureDisplayService