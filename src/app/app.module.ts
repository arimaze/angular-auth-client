import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints, OidcConfigService } from 'angular-auth-oidc-client';
import { ConfigService } from './services/config.service';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { AuthorizationGuard } from './services/authorization.guard';
import { AuthInterceptor } from './services/auth.Interceptor';
import localeFr from '@angular/common/locales/fr';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export function loadConfig(configService: ConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => configService.loadConfig('http://localhost:4200/assets/config.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule.forRoot()
  ],
  providers: [
    OidcConfigService,
    ConfigService,
    AuthorizationGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      multi: true,
      deps: [ConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private configService: ConfigService,
  ) {
    registerLocaleData(localeFr);

    this.configService.onConfigurationLoaded.subscribe(() => this.configService.setupSSO(this.oidcSecurityService));
    console.log('APP STARTING');
  }
}
