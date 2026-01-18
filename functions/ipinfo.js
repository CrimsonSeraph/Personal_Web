// 将国家代码转为国家名
function getCountryName(code) {
    const countries = {
        'CN': '中国', 'US': '美国', 'JP': '日本', 'KR': '韩国',
        'GB': '英国', 'DE': '德国', 'FR': '法国', 'CA': '加拿大',
        'AU': '澳大利亚', 'RU': '俄罗斯', 'IN': '印度', 'BR': '巴西',
        'MX': '墨西哥', 'ES': '西班牙', 'IT': '意大利', 'NL': '荷兰',
        'CH': '瑞士', 'SE': '瑞典', 'NO': '挪威', 'DK': '丹麦',
        'FI': '芬兰', 'PL': '波兰', 'TR': '土耳其', 'SA': '沙特阿拉伯',
        'AE': '阿联酋', 'SG': '新加坡', 'MY': '马来西亚', 'TH': '泰国',
        'VN': '越南', 'PH': '菲律宾', 'ID': '印度尼西亚', 'TW': '台湾',
        'HK': '香港', 'MO': '澳门', 'unknown': '未知'
    };
    return countries[code] || code || '未知';
}

// Cloudflare Pages Functions 导出格式
export async function onRequest(context) {
    const { request } = context;

    // 从请求头获取客户端IP（Cloudflare自动添加）
    const clientIP = request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

    // 使用Cloudflare的IP地理定位
    const countryCode = request.headers.get('cf-ipcountry') || 'unknown';

    // 返回JSON响应
    return new Response(JSON.stringify({
        ip: clientIP,
        country: getCountryName(countryCode),
        country_code: countryCode,
        timestamp: new Date().toISOString(),
        source: 'cloudflare-function'
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600'
        },
        status: 200
    });
}

// 处理OPTIONS预检请求（CORS）
export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}