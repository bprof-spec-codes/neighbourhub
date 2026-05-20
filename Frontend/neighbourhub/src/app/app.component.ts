import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'neighbourhub';

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(saved);
  }
}
