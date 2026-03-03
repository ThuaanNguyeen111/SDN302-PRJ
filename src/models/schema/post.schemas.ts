import { ObjectId } from 'mongodb'

interface PostType {
  _id?: ObjectId
  title: string
  content: string
  thumbnail?: string
  author_id: ObjectId // Staff who created the post
  suggested_products?: ObjectId[] // Array of product IDs
  tags?: string[]
  status?: number // 0: draft, 1: published
  created_at?: Date
  updated_at?: Date
}

export enum PostStatus {
  Draft = 0,
  Published = 1
}

export default class Post {
  _id: ObjectId
  title: string
  content: string
  thumbnail: string
  author_id: ObjectId
  suggested_products: ObjectId[]
  tags: string[]
  status: number
  created_at: Date
  updated_at: Date

  constructor(post: PostType) {
    const now = new Date()
    this._id = post._id || new ObjectId()
    this.title = post.title
    this.content = post.content
    this.thumbnail = post.thumbnail || ''
    this.author_id = post.author_id
    this.suggested_products = post.suggested_products || []
    this.tags = post.tags || []
    this.status = post.status ?? PostStatus.Published
    this.created_at = post.created_at || now
    this.updated_at = post.updated_at || now
  }
}
