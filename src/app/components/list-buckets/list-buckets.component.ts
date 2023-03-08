import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { IObject } from 'src/app/interfaces/IObject';

import { S3ServiceService } from 'src/app/services/s3-service.service';
import { IBucket } from './../../interfaces/IBucket';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-buckets',
  templateUrl: './list-buckets.component.html',
  styleUrls: ['./list-buckets.component.scss'],
  providers: [S3ServiceService],
})
export class ListBucketsComponent implements OnInit {
  public imageUrl: string;
  currentPrefix: string;
  @Input() buckets!: Array<IBucket>;

  @Output() chosenBucketEvent = new EventEmitter<string>();
  public currentBucket = '';

  // buckets: { name: string | undefined; creationDate: Date | undefined }[] = [];
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

  choseBucket(bucketName: string) {
    this.currentBucket = bucketName;
    this.currentPrefix = '';
    this.s3ServiceService.changeBucket(this.currentBucket);
    this.chosenBucketEvent.emit(this.currentBucket);
  }

  getObjects(bucketName: string, prefix: string, delimiter: string) {
    this.currentBucket = bucketName;
    this.currentPrefix = prefix;
    this.s3ServiceService
      .transformObjects(bucketName, prefix, delimiter)
      .subscribe((objects: IObject[]) => {
        console.log('Objects', objects);
        this.objects = objects;
        this.objects.forEach((object) => {});
      });
  }

  isThisImage(key: string | undefined): boolean {
    if (
      key?.includes('.png') ||
      key?.includes('.jpg') ||
      key?.includes('.jpeg')
    ) {
      return true;
    } else return false;
  }

  isThisFile(key: string | undefined): boolean {
    if (
      key?.includes('.png') ||
      key?.includes('.jpg') ||
      key?.includes('.jpeg')
    ) {
      return true;
    } else return false;
  }
  isThisFolder(key: string | undefined): boolean {
    if (key?.endsWith('~') || key?.endsWith('/')) {
      return true;
    } else return false;
  }

  ngOnChanges() {
    // this.s3ServiceService.transformBuckets().subscribe((buckets: IBucket[]) => {
    //   console.log('Buckets', buckets);
    //   this.buckets = buckets;
    // });
  }
  ngOnInit() {
    this.s3ServiceService.currentBucket.subscribe(
      (currentBucket) => (this.currentBucket = currentBucket)
    );

    // this.s3ServiceService.transformBuckets().subscribe((buckets: IBucket[]) => {
    //   console.log('Buckets', buckets);
    //   this.buckets = buckets;
    // });
  }
}
