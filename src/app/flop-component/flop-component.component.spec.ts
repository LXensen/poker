import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlopComponentComponent } from './flop-component.component';

describe('FlopComponentComponent', () => {
  let component: FlopComponentComponent;
  let fixture: ComponentFixture<FlopComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlopComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlopComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
