import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FilesMinioService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName = 'store';

  constructor(private configService: ConfigService<AllConfigType>) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getOrThrow('file.awsDefaultS3Url', {
        infer: true,
      }),
      useSSL: true,
      accessKey: this.configService.getOrThrow('file.accessKeyId', {
        infer: true,
      }),
      secretKey: this.configService.getOrThrow('file.secretAccessKey', {
        infer: true,
      }),
    });
  }

  async create(
    file: Express.Multer.File,
    path: string | null = null,
  ): Promise<any> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    let objectName = `${Date.now()}-${file.originalname}`;
    if (path) {
      objectName = `${path}/${Date.now()}-${file.originalname}`;
    }

    try {
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
      );
    } catch (error) {
      throw new Error(`Error uploading file to MinIO: ${error}`);
    }

    return objectName;

    return this.getPresignedUrl(objectName);
  }

  /**
   * getPresignedUrl
   *
   * @param objectName
   * @returns
   */
  async getPresignedUrl(objectName: string) {
    try {
      // 1 hours
      const expiryInSeconds = 3600;
      const url = await this.minioClient.presignedUrl(
        'GET',
        this.bucketName,
        objectName,
        expiryInSeconds,
      );
      return url;
    } catch (error) {
      throw new Error(`Error generating presigned URL: ${error}`);
    }
  }

  /**
   * getMutilsPresignedUrl
   *
   * @param objects
   * @returns string[]
   */
  async getMutilsPresignedUrl(objects: string[]) {
    const urls: string[] = [];

    for (const object of objects) {
      const url = await this.getPresignedUrl(object);
      urls.push(url);
    }

    return urls;
  }
}
