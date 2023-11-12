export default async function () {
    const storeProductImports = (await import(
        "@medusajs/medusa/dist/api/routes/store/products/index"
    )) as any

    const adminProductImports = (await import(
        '@medusajs/medusa/dist/api/routes/admin/products/index'
    )) as any;

    // Extend images relation and fields
        // store
    storeProductImports.allowedStoreProductsRelations = [
        ...storeProductImports.allowedStoreProductsRelations,
        "images",
    ]
    storeProductImports.defaultStoreProductsRelations = [
        ...storeProductImports.defaultStoreProductsRelations,
        "images",
    ]
        // admin
    adminProductImports.allowedAdminProductsRelations = [
        ...adminProductImports.allowedAdminProductsRelations,
        "images",
    ]
    adminProductImports.defaultAdminProductsRelations = [
        ...adminProductImports.defaultAdminProductsRelations,
        "images",
    ]
}