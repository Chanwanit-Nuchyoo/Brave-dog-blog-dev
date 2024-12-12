import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes } from '@nestjs/swagger';

const defaultOption = {
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },
};

export function UseFileUpload(
  fieldName: string,
  options: MulterOptions = defaultOption,
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, options)),
    ApiConsumes('multipart/form-data'),
  );
}
