// src/models/feature-display.ts
import { Column, Entity, BeforeInsert, ManyToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm"
import { Product as MedusaProduct, Image as MedusaImage, BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity()
export class FeatureDisplay extends BaseEntity {
    @Column()
        id: string

    @Column({ nullable: true })
        title: string | null

    @Column({ nullable: true })
        description: string | null

    @ManyToMany(() => MedusaImage, { cascade: ['insert'] })
        @JoinTable({
            name: "feature_display_images",
            joinColumn: { name: "feature_display_id", referencedColumnName: "id" },
            inverseJoinColumn: { name: "image_id", referencedColumnName: "id" },
        })
        images: MedusaImage[]

    @Column()
        order: number

    @Column({ type: 'jsonb', nullable: true })
        metadata: object | null

    @ManyToOne(() => MedusaProduct, (product) => product.feature_displays)
        @JoinColumn({ name: "product_id" })
        product: MedusaProduct

    @BeforeInsert()
        private beforeInsert(): void {
        this.id = generateEntityId(this.id, "pfd")
    }
}