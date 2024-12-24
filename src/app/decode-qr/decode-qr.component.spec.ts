import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecodeQrComponent } from './decode-qr.component';

describe('DecodeQrComponent', () => {
  let component: DecodeQrComponent;
  let fixture: ComponentFixture<DecodeQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecodeQrComponent]
    });
    fixture = TestBed.createComponent(DecodeQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
