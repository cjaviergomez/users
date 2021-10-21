import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTarjetaComponent } from './user-tarjeta.component';

describe('UserTarjetaComponent', () => {
  let component: UserTarjetaComponent;
  let fixture: ComponentFixture<UserTarjetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTarjetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
