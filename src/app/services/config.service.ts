// File Name = config.service.ts
import { Injectable, EventEmitter, Output, Injector } from '@angular/core';
import { AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onConfigurationLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  config: any;
  wellKnownEndpoints: any;

  constructor() { }

  async loadConfig(configUrl: string) {
    try {
      const response = await fetch(configUrl);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      this.config = await response.json();
      await this.loadSSOConfig(this.config.SSOAddress);
    } catch (err) {
      console.error(`ConfigService 'loadConfig' threw an error on calling ${configUrl}`, err);
      this.onConfigurationLoaded.emit(false);
    }
  }

  async loadSSOConfig(stsServer: string) {
    try {
      const response = await fetch(`${stsServer}/.well-known/openid-configuration`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      this.wellKnownEndpoints = await response.json();
      this.onConfigurationLoaded.emit(true);
    } catch (err) {
      console.error(`ConfigService 'loadSSOConfig' threw an error on calling ${stsServer}`, err);
      this.onConfigurationLoaded.emit(false);
    }
  }

  setupSSO(oidcSecurityService: OidcSecurityService) {
    const c = new OpenIDImplicitFlowConfiguration();
    c.stsServer = this.config.SSOAddress;
    c.redirect_url = window.location.origin;
    c.client_id = this.config.SSOClientId;
    c.response_type = 'id_token token';
    c.scope = 'openid  api1';
    c.post_logout_redirect_uri = window.location.origin + '/unauthorized';
    c.forbidden_route = '/forbidden';
    c.unauthorized_route = '/unauthorized';
    c.auto_userinfo = true;
    c.log_console_warning_active = true;
    c.log_console_debug_active = true;
    c.max_id_token_iat_offset_allowed_in_seconds = 10;
    c.start_checksession = false;
    c.silent_renew = false;
    const wn = new AuthWellKnownEndpoints();
    wn.setWellKnownEndpoints(this.wellKnownEndpoints);
    oidcSecurityService.setupModule(c, wn);
  }

}
