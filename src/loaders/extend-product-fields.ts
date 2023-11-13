export default async function () {
    const storeProductImports = (await import(
        "@medusajs/medusa/dist/api/routes/store/products/index"
    )) as any

    const adminProductImports = (await import(
        '@medusajs/medusa/dist/api/routes/admin/products/index'
    )) as any;

    // Extend feature_displays relation and fields
        // store
    storeProductImports.allowedStoreProductsRelations = [
        ...storeProductImports.allowedStoreProductsRelations,
        "feature_displays",
    ]
    storeProductImports.defaultStoreProductsRelations = [
        ...storeProductImports.defaultStoreProductsRelations,
        "feature_displays",
    ]
        // admin
    adminProductImports.allowedAdminProductsRelations = [
        ...adminProductImports.allowedAdminProductsRelations,
        "feature_displays",
    ]
    adminProductImports.defaultAdminProductsRelations = [
        ...adminProductImports.defaultAdminProductsRelations,
        "feature_displays",
    ]
}