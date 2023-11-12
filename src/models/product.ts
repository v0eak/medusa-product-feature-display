// src/models/product.ts
import { Product as MedusaProduct } from "@medusajs/medusa"
import { Entity, OneToMany } from "typeorm"
import { FeatureDisplay } from "./feature-display"

@Entity()
    export class Product extends MedusaProduct {
        @OneToMany(() => FeatureDisplay, (feature_display) => feature_display.product)
        feature_displays: FeatureDisplay[]
}