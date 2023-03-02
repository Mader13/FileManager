import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImgComponent } from './popup-img.component';

describe('PopupImgComponent', () => {
  let component: PopupImgComponent;
  let fixture: ComponentFixture<PopupImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
