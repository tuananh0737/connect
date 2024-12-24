import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeCodeQRComponent } from './de-code-qr.component';

describe('DeCodeQRComponent', () => {
  let component: DeCodeQRComponent;
  let fixture: ComponentFixture<DeCodeQRComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeCodeQRComponent]
    });
    fixture = TestBed.createComponent(DeCodeQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
