export function getTokenFromHttpRequest(request: any) {
    let authHeader = request.headers.authorization || '';
    if (!authHeader && request.query.token) {
        authHeader = 'Bearer ' + request.query.token;
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer.toLowerCase() === 'bearer' && token) {
        return token;
    }
    return null;
}
