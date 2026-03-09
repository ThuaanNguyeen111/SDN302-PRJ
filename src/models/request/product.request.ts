export interface CreateProductReqBody {
  name: string
  description?: string
  category?: string
  price: number
  stock: number
  image_url?: string
  brand?: string
  age_range?: string
}

export interface UpdateProductReqBody {
  name?: string
  description?: string
  category?: string
  price?: number
  stock_quantity?: number
  image_url?: string
  brand?: string
  age_range?: string
  allow_preorder?: boolean
}
