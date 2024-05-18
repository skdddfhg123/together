export type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

type CookieOptions = {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

export function setCookie(cookie: Cookie): void {
  const { name, value, options } = cookie;
  let Cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) Cookie += `;expires=${options.expires.toUTCString()}`;
  if (options.maxAge) Cookie += `;max-age=${options.maxAge}`;
  if (options.domain) Cookie += `;domain=${options.domain}`;
  if (options.path) Cookie += `;path=${options.path}`;
  if (options.secure) Cookie += ';secure';
  if (options.httpOnly) Cookie += ';httponly';
  if (options.sameSite) Cookie += `;samesite=${options.sameSite}`;

  document.cookie = Cookie;
}

export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
}
