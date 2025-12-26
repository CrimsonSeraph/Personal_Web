addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const targetPageUrl = 'https://personaweb.ltyy-leoyu.workers.dev/index.html';

    try {
        const response = await fetch(targetPageUrl);

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
    } catch (err) {
        return new Response('无法加载目标页面，请检查目标地址或稍后重试。', {
            status: 502,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
}