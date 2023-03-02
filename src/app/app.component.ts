import { Component, Input } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { S3ServiceService } from './services/s3-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [S3ServiceService],
})
export class AppComponent {
  buckets: { name: string | undefined; creationDate: Date | undefined }[] = [];
  public currentBucket: string;
  title = 'S3 File Manager';
  constructor(private s3Service: S3ServiceService) {}

  receiveBucketName($event: string) {
    this.currentBucket = $event;
    console.log('Ивент ведра ' + this.currentBucket);
  }
  isBucketChanged(bucket: string | undefined): boolean {
    if (bucket != '') {
      return true;
    } else return false;
  }
  onFileSelect() {}

  ngOnInit() {}
}
