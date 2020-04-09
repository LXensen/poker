import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TexasHoldEmGameComponent } from './texas-hold-em-game.component';

describe('TexasHoldEmGameComponent', () => {
  let component: TexasHoldEmGameComponent;
  let fixture: ComponentFixture<TexasHoldEmGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TexasHoldEmGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TexasHoldEmGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
