import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-popup-img',
  templateUrl: './popup-img.component.html',
  styleUrls: ['./popup-img.component.scss'],
})
export class PopupImgComponent implements OnInit {
  url: Promise<string>;
  name: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    console.log(data.url);
    this.url = data.url;
    this.name = data.name;
  }

  async downloadFile() {
    const url = await this.url;
    window.open(url, 'download');
  }

  ngOnInit(): void {}
}
