import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthPort } from '@shared';
import { App } from './app';
import { MockAuthService } from './core/data/mock';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: AuthPort,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();
  });

  it('debe crear el componente raíz App', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
