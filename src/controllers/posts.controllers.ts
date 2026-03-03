import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POST_MESSAGES } from '~/constants/post.message'
import { CreatePostReqBody, UpdatePostReqBody } from '~/models/request/post.request'
import { TokenPayload } from '~/models/request/user.requests'
import postService from '~/services/posts.services'

//!------------------------------------------------------------------------------------------------|
/**
 * GET /api/posts
 * Lấy danh sách bài viết sức khỏe (Guest có thể xem)
 */
export const getAllPostsController = async (req: Request, res: Response) => {
  const result = await postService.getAllPosts()
  return res.json({
    message: POST_MESSAGES.GET_POSTS_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * GET /api/posts/:id
 * Xem chi tiết bài viết + danh sách sản phẩm gợi ý đính kèm
 */
export const getPostByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await postService.getPostById(id)
  return res.json({
    message: POST_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * POST /api/posts
 * (Staff) Đăng bài viết mới
 */
export const createPostController = async (req: Request<ParamsDictionary, any, CreatePostReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await postService.createPost(user_id, req.body)
  return res.json({
    message: POST_MESSAGES.CREATE_POST_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * PUT /api/posts/:id
 * (Staff) Chỉnh sửa bài viết
 */
export const updatePostController = async (req: Request<ParamsDictionary, any, UpdatePostReqBody>, res: Response) => {
  const { id } = req.params
  const result = await postService.updatePost(id, req.body)
  return res.json({
    message: POST_MESSAGES.UPDATE_POST_SUCCESS,
    result
  })
}
