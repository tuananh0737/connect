import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybookComponent } from './mybook.component';

describe('MybookComponent', () => {
  let component: MybookComponent;
  let fixture: ComponentFixture<MybookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MybookComponent]
    });
    fixture = TestBed.createComponent(MybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
