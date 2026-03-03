export interface CreatePostReqBody {
  title: string
  content: string
  thumbnail?: string
  suggested_products?: string[] // Array of product ID strings
  tags?: string[]
  status?: number
}

export interface UpdatePostReqBody {
  title?: string
  content?: string
  thumbnail?: string
  suggested_products?: string[]
  tags?: string[]
  status?: number
}
