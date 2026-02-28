import formidable, { File as FormidableFile } from 'formidable'
import fs from 'fs'
import path from 'path'
import { IncomingMessage } from 'http'
import { Request } from 'express'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

//nếu không có đường dẫn 'server/uploads' thì tạo ra
//mình sẽ lưu tạm file nhận đc của clinent vào uploads/temp
export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true //cho phép tạo folder nested vào nhau
    }) //mkdirSync: giúp tạo thư mục
  }
}
export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR, //lưu ở đâu //lưu ở đâu
    maxFiles: 1, //tối đa bao nhiêu
    keepExtensions: true, //có lấy đuôi mở rộng không .png, .jpg
    maxFileSize: 300 * 1024, //tối đa bao nhiêu byte, 300kb
    //xài option filter để kiểm tra file có phải là image không
    filter: function ({ name, originalFilename, mimetype }) {
      //name: name|key truyền vào của <input name = bla bla>
      //originalFilename: tên file gốc
      //mimetype: kiểu file vd: image/png
      console.log(name, originalFilename, mimetype) //log để xem, nhớ comment

      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      //mimetype? nếu là string thì check, k thì thôi
      //ép Boolean , nếu k thì valid sẽ là boolean | undefined

      //nếu sai valid thì dùng form.emit để gữi lỗi
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
        //as any vì bug này formidable chưa fix, khi nào hết thì bỏ as any
      }
      //nếu đúng thì return valid
      return valid
    }
  })
  //form.parse về thành promise
  //files là object có dạng giống hình test code cuối cùng

  return new Promise<FormidableFile>((resolve, reject) => {
    form.parse(req as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err)
      const imageFiles = files.image
      if (!imageFiles) {
        return reject(new Error('Image is empty'))
      }

      const file = imageFiles[0]
      resolve(file)
    })
  })
}

//viết thêm hàm khi nhận filename : abv.png thì chỉ lấy abv để sau này ta gán thêm đuôi .jpeg
export const getNameFromFullname = (filename: string) => {
  const nameArr = filename.split('.')
  nameArr.pop() //xóa phần tử cuối cùng, tức là xóa đuôi .png
  return nameArr.join('') //nối lại thành chuỗi
}
