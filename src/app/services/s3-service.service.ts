import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as AWS from 'aws-sdk';
import * as RXJS from 'rxjs';
import { map } from 'rxjs/operators';

import {
  PutObjectCommand,
  CreateBucketCommand,
  ListObjectsCommand,
  ListBucketsCommand,
  GetBucketPolicyCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBucket } from '../interfaces/IBucket';
import { IObject } from '../interfaces/IObject';
import * as e from 'cors';

@Injectable({
  providedIn: 'root',
})
export class S3ServiceService {
  private sourceBucket = new BehaviorSubject<string>('');
  private sourcePrefix = new BehaviorSubject<string>('');
  currentBucket = this.sourceBucket.asObservable();
  buckets: { name: string | undefined; creationDate: Date | undefined }[] = [];
  objects: {
    checkSumAlgorithm: string[] | undefined;
    etag: string | undefined;
    key: string | undefined;
    lastModified: Date | undefined;
    owner: AWS.S3.Owner | undefined;
    size: number | undefined;
    storageClass: string | undefined;
  }[] = [];

  constructor(private http: HttpClient) {}

  changeBucket(bucket: string) {
    this.sourceBucket.next(bucket);
  }

  createInstanceS3() {
    const endpoint = 'https://s3.storage.selcloud.ru';
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: '245747_Minti',
        secretAccessKey: 'Selectel_not_great1',
      },
      endpoint,
      s3ForcePathStyle: true,
      region: 'ru-1',
      signatureVersion: 'v4',
      apiVersion: 'latest',
    });
    return s3;
  }

  async showObjectsS3(bucketName: string, prefix: string, delimiter: string) {
    const s3 = this.createInstanceS3();
    const objects = await s3
      .listObjectsV2({
        Bucket: bucketName,
        Delimiter: delimiter,
        Prefix: prefix,
      })
      .promise();
    const { Contents = [] } = objects;

    this.objects = Contents.map((object) => {
      return {
        checkSumAlgorithm: object.ChecksumAlgorithm,
        etag: object.ETag,
        key: object.Key,
        lastModified: object.LastModified,
        owner: object.Owner,
        size: object.Size,
        storageClass: object.StorageClass,
      };
    });

    return this.objects;
  }

  async getPresidnedURL(
    bucketName: string | undefined,
    key: string | undefined
  ) {
    const s3 = this.createInstanceS3();
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60,
    };
    const presidnedUrl = await s3.getSignedUrlPromise('getObject', params);
    return presidnedUrl;
  }

  transformObjects(
    bucketName: string | undefined,
    prefix: string | undefined,
    delimiter: string | undefined
  ): Observable<IObject[]> {
    return RXJS.from(this.showObjectsS3(bucketName!, prefix!, delimiter!)).pipe(
      map((objects: IObject[]) => {
        return objects
          .map((object) => ({
            checkSumAlgorithm: object.checkSumAlgorithm,
            etag: object.etag,
            key: object.key,
            lastModified: object.lastModified,
            owner: object.owner,
            size: object.size,
            storageClass: object.storageClass,
          }))
          .filter((object) => object.key != prefix);
      })
    );
  }

  async getBuckets() {
    const s3 = this.createInstanceS3();
    const buckets = await s3.listBuckets().promise();
    const { Buckets = [] } = buckets;
    this.buckets = Buckets.map((bucket) => {
      return { name: bucket.Name, creationDate: bucket.CreationDate };
    });

    return this.buckets;
  }

  transformBuckets(): Observable<IBucket[]> {
    return RXJS.from(this.getBuckets()).pipe(
      map((buckets: IBucket[]) => {
        return buckets.map((bucket) => ({
          name: bucket.name,
          creationDate: bucket.creationDate,
        }));
      })
    );
  }
  fileUploading: boolean;
  async uploadFile(bucket: string, file: File, prefix: string) {
    let key: string;
    if (prefix == undefined) {
      key = file.name;
    } else {
      key = prefix + '/' + file.name;
    }

    const s3 = this.createInstanceS3();
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'private',
      ContentType: file.type,
    };

    // try {
    //   const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    //   console.log(uploadURL);
    //   this.http.put(uploadURL, file).subscribe({
    //     next: (res) => {
    //       console.log('SUCCESS', res);
    //     },
    //     error: (err) => {
    //       console.log('FAILED', err);
    //     },
    //     complete: () => {
    //       console.log('DONE');
    //     },
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
    //return this.http.put<any>(uploadURL, body, httpOptions)
  }
  async deleteFile(bucket: string, key: string) {
    const s3 = this.createInstanceS3();
    const params = {
      Bucket: bucket,
      Key: key,
    };
    try {
      await s3.headObject(params).promise; //поиск объекта по ключу в бакете
      try {
        await s3.deleteObject(params).promise(); //удаление объекта
      } catch (err) {
        console.log('ERROR, file not deleted\n' + JSON.stringify(err));
      }
    } catch (err) {
      console.log('ERROR, file not found\n' + JSON.stringify(err));
    }
  }
}
// async showObjectsS3inFolder(
//   bucketName: string,
//   prefix: string,
//   delimiter: string
// ) {
//   const s3 = this.createInstanceS3();
//   const objects = await s3
//     .listObjectsV2({
//       Bucket: bucketName,
//       Delimiter: delimiter,
//       Prefix: prefix,
//     })
//     .promise();

//   const { Contents = [] } = objects;
//   this.objects = Contents.map((object) => {
//     return {
//       checkSumAlgorithm: object.ChecksumAlgorithm,
//       etag: object.ETag,
//       key: object.Key,
//       lastModified: object.LastModified,
//       owner: object.Owner,
//       size: object.Size,
//       storageClass: object.StorageClass,
//     };
//   });

//   return this.objects;
// }

// transformObjectsInFolder(
//   bucketName: string | undefined,
//   prefix: string | undefined,
//   delimiter: string | undefined
// ): Observable<IObject[]> {
//   return RXJS.from(
//     this.showObjectsS3inFolder(bucketName!, prefix!, delimiter!)
//   ).pipe(
//     map((objects: IObject[]) => {
//       return objects.map((object) => ({
//         checkSumAlgorithm: object.checkSumAlgorithm,
//         etag: object.etag,
//         key: object.key,
//         lastModified: object.lastModified,
//         owner: object.owner,
//         size: object.size,
//         storageClass: object.storageClass,
//       }));
//     })
//   );
// }

// s3.upload(
//   {
//     Key: prefix + '/' + fileName,
//     Bucket: bucket,
//     Body: file,
//     ACL: 'private',
//     ContentType: file.type,
//   },
//   (err, data) => {
//     this.fileUploading = false;
//     if (err) {
//       console.log(err, 'there was an error uploading your file');
//     } else {
//       console.log(data.Key + ' uploaded successfully');
//     }
//     return true;
//   }
// );
