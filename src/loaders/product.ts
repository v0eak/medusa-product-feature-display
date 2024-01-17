export default async function () {
    const adminProductImports = (await import(
      '@medusajs/medusa/dist/api/routes/admin/products/index'
    )) as any;
  
    const storeProductImports = (await import(
      '@medusajs/medusa/dist/api/routes/store/products/index'
    )) as any;
  
    adminProductImports.defaultAdminProductRelations = [
      ...adminProductImports.defaultAdminProductRelations,
      'feature_displays',
    ];
  
    storeProductImports.defaultStoreProductsRelations = [
      ...storeProductImports.defaultStoreProductsRelations,
      'feature_displays',
    ]
  
    storeProductImports.allowedStoreProductsRelations = [
      ...storeProductImports.allowedStoreProductsRelations,
      'feature_displays',
    ]
  
    adminProductImports.defaultAdminProductRelations = [
      ...adminProductImports.defaultAdminProductRelations,
      'feature_displays',
    ];
  
    storeProductImports.defaultStoreProductsRelations = [
      ...storeProductImports.defaultStoreProductsRelations,
      'feature_displays',
    ]
  
    storeProductImports.allowedStoreProductsRelations = [
      ...storeProductImports.allowedStoreProductsRelations,
      'feature_displays',
    ]
  }
  