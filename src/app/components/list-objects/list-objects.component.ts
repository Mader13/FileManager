import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delimiter } from 'path';
import { S3ServiceService } from 'src/app/services/s3-service.service';
import { IObject } from './../../interfaces/IObject';

@Component({
  selector: 'app-list-objects',
  templateUrl: './list-objects.component.html',
  styleUrls: ['./list-objects.component.scss'],
})
export class ListObjectsComponent implements OnInit {
  @Input() public bucketName!: string;
  @Input() prefix!: string;

  delimiter: string;
  objects: {
    checkSumAlgorithm: string[] | undefined;
    etag: string | undefined;
    key: string | undefined;
    lastModified: Date | undefined;
    owner: AWS.S3.Owner | undefined;
    size: number | undefined;
    storageClass: string | undefined;
  }[] = [];

  constructor(
    private s3ServiceService: S3ServiceService,
    private toastr: ToastrService
  ) {}

  getObjectsFromBucket(bucketName: string | undefined, delimiter: string) {
    this.prefix = '';
    this.s3ServiceService
      .transformObjects(bucketName, this.prefix, delimiter)
      .subscribe((objects: IObject[]) => {
        console.log('Objects ', objects);
        this.objects = objects;
      });
  }

  getObjectsFromFolder(bucketName: string, prefix: string, delimiter: string) {
    this.prefix = prefix;
    console.log(this.prefix);
    this.s3ServiceService
      .transformObjects(bucketName, prefix, delimiter)
      .subscribe((objects: IObject[]) => {
        console.log('Objects from folder ', objects);
        this.objects = objects;
      });
  }

  returnToPreviousFolder(
    bucketName: string,
    prefix: string,
    delimiter: string
  ) {
    let size = prefix.length;
    let delimiters = [];

    for (let i = 0; i < prefix.length; i++) {
      if (prefix[i] === '/') delimiters.push(i);
    }
    console.log(delimiters, 'Слэши');
    let previousFolder = delimiters[delimiters.length - 1];

    prefix = prefix.substring(0, previousFolder + 1);
    console.log(`${previousFolder}, 'Символ прошлой папки
    ${prefix}, Префикс`);
    if (previousFolder != undefined) {
      this.s3ServiceService
        .transformObjects(bucketName, prefix, delimiter)
        .subscribe((objects: IObject[]) => {
          console.log('Objects from folder ', objects);
          this.objects = objects;
        });
      this.prefix = prefix.substring(0, prefix.length - 1);
    } else {
      this.prefix = '';
      this.getObjectsFromBucket(this.bucketName, delimiter);
    }
  }

  // isThisImage(key: string | undefined): boolean {
  //   if (
  //     key?.includes('.png') ||
  //     key?.includes('.jpg') ||
  //     key?.includes('.jpeg')
  //   ) {
  //     return true;
  //   } else return false;
  // }

  // isThisFile(key: string | undefined): boolean {
  //   if (
  //     key?.includes('.png') ||
  //     key?.includes('.jpg') ||
  //     key?.includes('.jpeg')
  //   ) {
  //     return true;
  //   } else return false;
  // }
  isThisFolder(key: string | undefined): boolean {
    if (key?.endsWith('~') || key?.endsWith('/')) {
      // ~ сделан уникальным символом, так как выбранный для тестирования провайдер хранилища не дает создавать объекты, заканчивающиеся на /
      return true;
    } else return false;
  }

  onFileSelect(e: any) {
    try {
      this.s3ServiceService.uploadFile(
        this.bucketName!,
        e.target.files[0],
        this.prefix
      );
      this.toastr.success('File uploaded successfully');
    } catch {
      this.toastr.error('Upload error. Try again');
    }
  }
  onSubmitSearch(query: any) {
    console.log(query);
    if (query.length == 0) {
      console.log('empty search');
    } else {
      console.log(query);
      this.s3ServiceService
        .transformObjects(this.bucketName, query, '')
        .subscribe((objects: IObject[]) => {
          console.log('Objects from search query ', objects);
          this.objects = objects;
        });
    }
  }
  onSubmitCreateFolder(query: any) {
    console.log(query);
    if (query.length == 0) {
      console.log('empty folder name');
    } else {
      console.log(query);
      this.s3ServiceService.createFolder(this.bucketName, query, this.prefix);
    }
  }
  async deleteObject(bucketName: string, key: string) {
    try {
      await this.s3ServiceService.deleteFile(bucketName, key);
      this.objects = this.objects.filter(function (obj) {
        return obj.key !== key;
      });
      this.toastr.success('File is deleted');
    } catch (err) {
      this.toastr.error('Delete error. Try again');
    }
  }

  ngOnChanges() {
    this.getObjectsFromBucket(this.bucketName, '/');
  }

  ngOnInit() {}
}
