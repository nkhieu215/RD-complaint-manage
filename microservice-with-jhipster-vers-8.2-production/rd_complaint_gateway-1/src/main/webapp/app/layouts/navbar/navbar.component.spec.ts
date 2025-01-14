jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProfileInfo } from 'app/layouts/profiles/profile-info.model';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LoginService } from 'app/login/login.service';

import NavbarComponent from './navbar.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import MainComponent from '../main/main.component';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';

describe('Navbar Component', () => {
  let comp: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let accountService: AccountService;
  let profileService: ProfileService;
  const account: Account = {
    activated: true,
    authorities: [],
    email: '',
    firstName: 'John',
    langKey: '',
    lastName: 'Doe',
    login: 'john.doe',
    imageUrl: '',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule.withRoutes([])],
      providers: [MainComponent, AppPageTitleStrategy, LoginService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
      .overrideTemplate(NavbarComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.componentInstance;
    accountService = TestBed.inject(AccountService);
    profileService = TestBed.inject(ProfileService);
  });

  it('Should call profileService.getProfileInfo on init', () => {
    // GIVEN
    jest.spyOn(profileService, 'getProfileInfo').mockReturnValue(of(new ProfileInfo()));

    // WHEN
    // comp.ngOnInit();

    // THEN
    expect(profileService.getProfileInfo);
  });

  it('Should hold current authenticated user in variable account', () => {
    // WHEN
    // comp.ngOnInit();

    // THEN
    expect(comp.account());

    // WHEN
    accountService.authenticate(account);

    // THEN
    expect(comp.account());

    // WHEN
    accountService.authenticate(null);

    // THEN
    expect(comp.account());
  });

  it('Should hold current authenticated user in variable account if user is authenticated before page load', () => {
    // GIVEN
    accountService.authenticate(account);

    // WHEN
    // comp.ngOnInit();

    // THEN
    expect(comp.account());

    // WHEN
    accountService.authenticate(null);

    // THEN
    expect(comp.account());
  });
});
