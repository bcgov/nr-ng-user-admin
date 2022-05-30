import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcSubmitComponent } from './kc-submit.component';

describe('KcSubmitComponent', () => {
  let component: KcSubmitComponent;
  let fixture: ComponentFixture<KcSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KcSubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
