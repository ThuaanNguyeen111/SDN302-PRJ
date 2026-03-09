import { Request, Response } from 'express'
import reviewsService from '~/services/reviews.services'

export const createReviewController = async (req: Request, res: Response) => {
  // Lấy user_id từ payload token do accessTokenValidator đính kèm vào req
  const user_id = (req as any).decoded_authorization.user_id
  const { productId } = req.params
  const { rating, comment } = req.body

  const result = await reviewsService.createReview(user_id, productId, { rating, comment })

  return res.json({
    message: 'Create review successfully',
    result
  })
}

export const getProductReviewsController = async (req: Request, res: Response) => {
  const { productId } = req.params
  const result = await reviewsService.getProductReviews(productId)

  return res.json({
    message: 'Get product reviews successfully',
    result
  })
}
