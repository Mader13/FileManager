import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { S3ServiceService } from '../services/s3-service.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent implements OnInit {
  @Input()
  bucket: string;
  @Input()
  key: string; //

  url: Promise<string>;

  getUrl(bucketName: string, key: string | undefined) {
    this.url = this.s3ServiceService.getPresidnedURL(bucketName, key);
  }

  constructor(private s3ServiceService: S3ServiceService) {}

  ngOnInit(): void {
    this.getUrl(this.bucket, this.key);
  }
}
