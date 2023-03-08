import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpClient } from '@angular/common/http';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListBucketsComponent } from './components/list-buckets/list-buckets.component';
import { S3ServiceService } from './services/s3-service.service';
import { ListObjectsComponent } from './components/list-objects/list-objects.component';
import { ImageComponent } from './image/image.component';
import { ObjectComponent } from './object/object.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupImgComponent } from './components/popup-img/popup-img.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ListBucketsComponent,
    ListObjectsComponent,
    ImageComponent,
    ObjectComponent,
    PopupImgComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
