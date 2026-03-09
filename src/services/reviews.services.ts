import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'
import Review from '~/models/schema/reviews.schemas'

class ReviewsService {
  async createReview(user_id: string, product_id: string, payload: { rating: number; comment: string }) {
    const newReview = new Review({
      user_id: new ObjectId(user_id),
      product_id: new ObjectId(product_id),
      rating: payload.rating,
      comment: payload.comment
    })

    const result = await DatabaseService.reviews.insertOne(newReview)
    return { ...newReview, _id: result.insertedId }
  }

  async getProductReviews(product_id: string) {
    const reviews = await DatabaseService.reviews
      .aggregate([
        { $match: { product_id: new ObjectId(product_id) } },
        {
          $lookup: {
            from: 'users', // Liên kết với collection users
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        { $unwind: '$user_info' }, // Biến mảng thành object
        {
          $project: {
            rating: 1,
            comment: 1,
            created_at: 1,
            'user_info.name': 1,
            'user_info.avatar': 1
          }
        },
        { $sort: { created_at: -1 } } // Mới nhất lên đầu
      ])
      .toArray()

    return reviews
  }
}

const reviewsService = new ReviewsService()
export default reviewsService
