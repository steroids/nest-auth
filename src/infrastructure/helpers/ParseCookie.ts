export function parseCookie(cookieString: string): any {
    return cookieString
        .split(';')
        .map(v => v.split('='))
        .reduce<any>((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
}
