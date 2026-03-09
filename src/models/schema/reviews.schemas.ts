import { ObjectId } from 'mongodb'

interface ReviewType {
  _id?: ObjectId
  product_id: ObjectId
  user_id: ObjectId
  rating: number
  comment: string
  created_at?: Date
}

export default class Review {
  _id: ObjectId
  product_id: ObjectId
  user_id: ObjectId
  rating: number
  comment: string
  created_at: Date

  constructor(review: ReviewType) {
    this._id = review._id || new ObjectId()
    this.product_id = review.product_id
    this.user_id = review.user_id
    this.rating = review.rating
    this.comment = review.comment
    this.created_at = review.created_at || new Date()
  }
}
