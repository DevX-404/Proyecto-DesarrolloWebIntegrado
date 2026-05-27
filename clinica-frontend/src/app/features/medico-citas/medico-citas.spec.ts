import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoCitas } from './medico-citas';

describe('MedicoCitas', () => {
  let component: MedicoCitas;
  let fixture: ComponentFixture<MedicoCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoCitas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoCitas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
