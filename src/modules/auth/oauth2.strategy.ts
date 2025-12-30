import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import axios from 'axios';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor() {
    super({
      authorizationURL: 'https://oauth2.mezon.ai/oauth2/auth',
      tokenURL: 'https://oauth2.mezon.ai/oauth2/token',
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/oauth/callback',
      scope: ['openid', 'offline', 'offline_access'],
      state: true,
    });
    
  }

  async userProfile(accessToken: string, done: Function) {
    try {
      const { data } = await axios.get(
        'https://oauth2.mezon.ai/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      done(null, data);
    } catch (err) {
      done(err, null);
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    console.log(profile);

    if (!profile) {
      throw new UnauthorizedException('Không lấy được thông tin từ Mezon');
    }
    
    const { user_id, email, username } = profile;
    return {
      oauthId: user_id,
      email: email,
      username: username,
      accessToken,
    };
  }
}
