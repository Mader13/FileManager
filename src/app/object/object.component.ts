import { Component, Input, OnInit } from '@angular/core';
import { IObject } from 'src/app/interfaces/IObject';
import { MatDialog } from '@angular/material/dialog';

import { S3ServiceService } from 'src/app/services/s3-service.service';
import { IBucket } from '../interfaces/IBucket';
import { PopupImgComponent } from '../components/popup-img/popup-img.component';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss'],
})
export class ObjectComponent implements OnInit {
  @Input()
  key: string | undefined;
  @Input()
  etag: string | undefined;
  @Input()
  lastModified: Date | undefined;
  @Input()
  owner: AWS.S3.Owner | undefined;
  @Input()
  size: number | undefined;
  @Input()
  bucket: string;
  @Input()
  prefix: string;
  @Input()
  currentBucket: string;
  Component: any;

  constructor(
    private s3ServiceService: S3ServiceService,
    private dialogRef: MatDialog
  ) {}

  openDialog(bucketName: string, key: string | undefined) {
    this.dialogRef.open(PopupImgComponent, {
      data: {
        url: this.s3ServiceService.getPresidnedURL(bucketName, key),
        name: this.getCorrectObjectName(key!),
      },
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

  isThisFolder(key: string | undefined): boolean {
    if (key?.endsWith('~') || key?.endsWith('/')) {
      return true;
    } else return false;
  }

  getCorrectObjectName(key: string): String {
    if (this.prefix != undefined) {
      key = key.substring(key.lastIndexOf('/') + 1);
      return key;
    } else return key;
  }

  async downloadFile(bucketName: string, key: string) {
    const url = await this.s3ServiceService.getPresidnedURL(bucketName, key);
    window.open(url, '_blank');
    return url;
  }
  getCorrectObjectSize(size: number): String {
    if (size < 1000) {
      const sizeStr = size.toFixed(3) + 'byte';
      return sizeStr;
    } else if (size < 1000 * 1000) {
      size = size / 1000;
      const sizeStr = size.toFixed(3) + 'Kb';
      return sizeStr;
    } else if (size < 1000 * 1000 * 1000) {
      size = size / 1000 / 1000;
      const sizeStr = size.toFixed(3) + 'Mb';
      return sizeStr;
    } else if (size < 1000 * 1000 * 1000 * 1000) {
      size = size / 1000 / 1000 / 1000;
      const sizeStr = size.toFixed(3) + 'Gb';
      return sizeStr;
    } else {
      return 'Null';
    }
  }
  ngOnInit(): void {}
}
