import { Lifetime } from "awilix" 
import { TransactionBaseService } from "@medusajs/medusa"
import ImageRepository from "@medusajs/medusa/dist/repositories/image"
import { Image } from "@medusajs/medusa/dist/models/image"

class ImageService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly imageRepository_: typeof ImageRepository

    constructor(container) {
        super(container);

        this.imageRepository_ = container.imageRepository
    }

    async createImage(data) {
        return this.atomicPhase_(async (manager) => {
            const imageRepo = manager.withRepository(this.imageRepository_)

            const image = new Image();
            image.url = data.url;

            await imageRepo.save(image);
            return image;
        })
    }
}

export default ImageService