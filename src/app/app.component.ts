import { Component } from '@angular/core';
import { S3ServiceService } from './services/s3-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IBucket } from './interfaces/IBucket';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [S3ServiceService],
})
export class AppComponent {
  auth: boolean = false;
  buckets: Array<IBucket>;
  public currentBucket: string;

  constructor(
    private s3Service: S3ServiceService,
    private toastr: ToastrService
  ) {}

  receiveBucketName($event: string) {
    this.currentBucket = $event;
  }
  isBucketChanged(bucket: string | undefined): boolean {
    if (bucket != '') {
      return true;
    } else return false;
  }
  authForm: FormGroup = new FormGroup({
    accessKey: new FormControl('', Validators.required),
    secretAccessKey: new FormControl('', Validators.required),
    endpoint: new FormControl(''),
    region: new FormControl('', Validators.required),
  });

  submitCredentials() {
    this.s3Service.accessKeyId = this.authForm.get('accessKey')?.value;
    this.s3Service.secretAccessKey =
      this.authForm.get('secretAccessKey')?.value;
    this.s3Service.endpoint = this.authForm.get('endpoint')?.value;
    this.s3Service.region = this.authForm.get('region')?.value;

    this.authorizeAttempt();
  }

  authorizeAttempt() {
    this.s3Service.transformBuckets().subscribe({
      next: (buckets: IBucket[]) => {
        this.buckets = buckets;
      },
      error: (error) => {
        this.toastr.error(
          'No received buckets, check your credentials or AWS S3 configuration'
        );
      },
      complete: () => {
        this.toastr.success('Authorization success');
        this.auth = true;
      },
    });
  }
  ngOnInit() {}
}
