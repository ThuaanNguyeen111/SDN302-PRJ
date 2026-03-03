import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'
import Post, { PostStatus } from '~/models/schema/post.schemas'
import { CreatePostReqBody, UpdatePostReqBody } from '~/models/request/post.request'
import { POST_MESSAGES } from '~/constants/post.message'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class PostService {
  //!------------------------------------------------------------------------------------------------|
  /**
   * Lấy danh sách bài viết sức khỏe (chỉ lấy bài đã published)
   * Guest có thể xem
   */
  async getAllPosts() {
    const posts = await DatabaseService.posts
      .aggregate([
        { $match: { status: PostStatus.Published } },
        {
          $lookup: {
            from: 'users',
            localField: 'author_id',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            thumbnail: 1,
            tags: 1,
            status: 1,
            suggested_products: 1,
            created_at: 1,
            updated_at: 1,
            'author._id': 1,
            'author.name': 1
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()

    return posts
  }

  //!------------------------------------------------------------------------------------------------|
  /**
   * Xem chi tiết bài viết + danh sách sản phẩm gợi ý đính kèm
   */
  async getPostById(post_id: string) {
    if (!ObjectId.isValid(post_id)) {
      throw new ErrorWithStatus({
        message: POST_MESSAGES.INVALID_POST_ID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await DatabaseService.posts
      .aggregate([
        { $match: { _id: new ObjectId(post_id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'author_id',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: process.env.DB_PRODUCTS_COLLECTION || 'products',
            localField: 'suggested_products',
            foreignField: '_id',
            as: 'suggested_products_detail'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            thumbnail: 1,
            tags: 1,
            status: 1,
            suggested_products: 1,
            suggested_products_detail: 1,
            created_at: 1,
            updated_at: 1,
            'author._id': 1,
            'author.name': 1
          }
        }
      ])
      .toArray()

    if (!result || result.length === 0) {
      throw new ErrorWithStatus({
        message: POST_MESSAGES.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result[0]
  }

  //!------------------------------------------------------------------------------------------------|
  /**
   * (Staff) Tạo bài viết mới
   */
  async createPost(author_id: string, payload: CreatePostReqBody) {
    const suggested_products = (payload.suggested_products || []).map((id) => new ObjectId(id))

    const post = new Post({
      title: payload.title,
      content: payload.content,
      thumbnail: payload.thumbnail,
      author_id: new ObjectId(author_id),
      suggested_products,
      tags: payload.tags || [],
      status: payload.status ?? PostStatus.Published
    })

    await DatabaseService.posts.insertOne(post)

    return post
  }

  //!------------------------------------------------------------------------------------------------|
  /**
   * (Staff) Chỉnh sửa bài viết
   */
  async updatePost(post_id: string, payload: UpdatePostReqBody) {
    if (!ObjectId.isValid(post_id)) {
      throw new ErrorWithStatus({
        message: POST_MESSAGES.INVALID_POST_ID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const updateFields: Record<string, unknown> = {}
    if (payload.title !== undefined) updateFields.title = payload.title
    if (payload.content !== undefined) updateFields.content = payload.content
    if (payload.thumbnail !== undefined) updateFields.thumbnail = payload.thumbnail
    if (payload.tags !== undefined) updateFields.tags = payload.tags
    if (payload.status !== undefined) updateFields.status = payload.status
    if (payload.suggested_products !== undefined) {
      updateFields.suggested_products = payload.suggested_products.map((id) => new ObjectId(id))
    }

    const result = await DatabaseService.posts.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      {
        $set: {
          ...updateFields,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: POST_MESSAGES.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }
}

const postService = new PostService()
export default postService
