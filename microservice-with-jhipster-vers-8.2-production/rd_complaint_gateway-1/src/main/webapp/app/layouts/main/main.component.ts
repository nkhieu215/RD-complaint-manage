import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';

@Component({
  selector: 'jhi-main',
  standalone: true,
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, FooterComponent, PageRibbonComponent],
})
export default class MainComponent implements OnInit {
  private router = inject(Router);
  private appPageTitleStrategy = inject(AppPageTitleStrategy);
  private accountService = inject(AccountService);

  constructor() { }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
  }

  closeNav(): void {
    document.getElementById('main')!.style.marginLeft = '50px';
  }

  closeNav2(): void {
    document.getElementById('main')!.style.marginLeft = '50px';
  }

  openNav(): void {
    document.getElementById('main')!.style.marginLeft = '250px';
    // document.getElementById('main')!.style.width = '87vw';

  }
}
