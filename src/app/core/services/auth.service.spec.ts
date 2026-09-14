import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());

  it('rejects an invalid demo login', () => {
    const service = TestBed.inject(AuthService);
    expect(service.login('a@b', '123')).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('persists a valid demo login and logs out', () => {
    const service = TestBed.inject(AuthService);
    expect(service.login('mina@rivet.test', 'demo123')).toBeTrue();
    expect(localStorage.getItem('rivet-auth')).toBe('1');
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('rivet-auth')).toBeNull();
  });
});
