import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestclientComponent } from './forestclient.component';

describe('ForestclientComponent', () => {
  let component: ForestclientComponent;
  let fixture: ComponentFixture<ForestclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForestclientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForestclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
