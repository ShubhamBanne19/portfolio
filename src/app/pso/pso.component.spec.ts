import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PSOComponent } from './pso.component';

describe('PSOComponent', () => {
  let component: PSOComponent;
  let fixture: ComponentFixture<PSOComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PSOComponent]
    });
    fixture = TestBed.createComponent(PSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
