import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-openidconnect';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  constructor(private configService: ConfigService) {
    super({
      issuer: configService.get<string>('app.oidc.issuer'),
      clientID: configService.get<string>('app.oidc.clientId'),
      clientSecret: configService.get<string>('app.oidc.clientSecret'),
      callbackURL: configService.get<string>('app.oidc.redirectUri'),
      scope: configService.get<string>('app.oidc.scope'),
    });
  }

  async validate(issuer: string, sub: string, profile: any, done: any) {
    // Handle OIDC user profile
    const user = {
      id: sub,
      email: profile.emails?.[0]?.value,
      firstName: profile.given_name,
      lastName: profile.family_name,
      provider: 'oidc',
    };

    return done(null, user);
  }
}
