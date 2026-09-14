import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('toggles and persists dark mode', () => {
    const service = TestBed.inject(ThemeService);
    const initial = service.dark();
    service.toggle();
    expect(service.dark()).toBe(!initial);
    expect(localStorage.getItem('rivet-theme')).toBe(service.dark() ? 'dark' : 'light');
  });
});
