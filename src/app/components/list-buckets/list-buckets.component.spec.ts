import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBucketsComponent } from './list-buckets.component';

describe('ListBucketsComponent', () => {
  let component: ListBucketsComponent;
  let fixture: ComponentFixture<ListBucketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBucketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBucketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
