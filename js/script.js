/* ----------调试信息---------- */
// 创建不同模块的调试函数
const debugBG = createDebug('BG', false);                               // 背景相关调试
const debugPageChange = createDebug('PageChange', false);               // 页面切换相关调试
const debugUserInfo = createDebug('UserInfo', true);                   // 用户信息相关调试

// 创建Debug信息
function createDebug(namespace = 'default', enabled = false) {
    // 存储所有命名空间的启用状态
    const debuggers = createDebug.debuggers || {};
    createDebug.debuggers = debuggers;

    // 如果没有设置过，使用传入的enabled值
    if (debuggers[namespace] === undefined) {
        debuggers[namespace] = enabled;
    }

    // 创建调试函数
    const debug = (...args) => {
        if (debuggers[namespace]) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [${namespace}]`, ...args);
        }
    };

    // 添加启用/禁用方法
    debug.enable = () => {
        debuggers[namespace] = true;
        console.log(`[debug] ${namespace} enabled`);
    };

    debug.disable = () => {
        debuggers[namespace] = false;
        console.log(`[debug] ${namespace} disabled`);
    };

    debug.isEnabled = () => debuggers[namespace];

    return debug;
}

// 全局启用/禁用所有调试
createDebug.enableAll = () => {
    Object.keys(createDebug.debuggers || {}).forEach(namespace => {
        createDebug.debuggers[namespace] = true;
    });
    console.log('[debug] All debuggers enabled');
};

createDebug.disableAll = () => {
    Object.keys(createDebug.debuggers || {}).forEach(namespace => {
        createDebug.debuggers[namespace] = false;
    });
    console.log('[debug] All debuggers disabled');
};

// 设置特定命名空间的启用状态
createDebug.set = (namespace, enabled) => {
    if (!createDebug.debuggers) createDebug.debuggers = {};
    createDebug.debuggers[namespace] = enabled;
    console.log(`[debug] ${namespace} ${enabled ? 'enabled' : 'disabled'}`);
};

// 获取所有调试状态
createDebug.getStatus = () => {
    return { ...(createDebug.debuggers || {}) };
};
/* ----------调试信息---------- */

/* ----------DOM后加载脚本---------- */
document.addEventListener("DOMContentLoaded", () => {
    setRealViewportHeight();                                            // 设置真实视窗高度
    initConfirmDialog()                                                 // 初始化确认对话框
    initBGChangeSystem()                                                // 初始化背景切换系统
    addAllListener();                                                   // 添加所有监听事件
    updateCurrentTime();                                                // 初始化时间显示
    setInterval(updateCurrentTime, 1000);                               // 设置每秒更新时间
    displayUserInfo();                                                  // 获取并显示用户IP及国家
    setupImageModal();                                                  // 设置图片模态框功能
    console.log(createDebug.getStatus());                               // 检查Debug状态
});
/* ----------DOM后加载脚本---------- */

/* ----------资源路径---------- */
//跳转路径
const PagePath = {
    //Page: "./page.html",
    personal_page: "",
    bilibili: "https://space.bilibili.com/1741002917?spm_id_from=333.1007.0.0",
    github: "https://github.com/CrimsonSeraph",
    twitter: "https://x.com/CrimSeraph_QwQ",
};

// 网站名称
const SiteName = {
    //Site: "网站名称",
    personal_page: "个人主页",
    bilibili: "Bilibili（哔哩哔哩）",
    github: "GitHub",
    twitter: "X（Twitter）",
};

// 背景路径
const BGPath = {
    //Video: "./video.m4",
    video_BG_1: "./assets/video/video_BG_1.mp4",
    video_BG_2: "./assets/video/video_BG_2.mp4",
};
/* ----------资源路径---------- */

/* ----------监听事件---------- */
function addAllListener() {
    window.addEventListener('resize', setRealViewportHeight);           // 视窗尺寸变化时，重新设置真实视窗高度

    let top_left_area = document.getElementById("top_left");            // 获取页面跳转区域的父级元素
    let iconBar = document.querySelector('.icon_bar');                  // 获取图标栏元素

    // 页面跳转点击事件监听
    if (top_left_area) {                                                // 个人主页跳转(快速跳转)
        top_left_area.addEventListener("click", function () {
            quickNavigateToPage("personal_page");
        })
    }
    if (iconBar) {
        iconBar.addEventListener('click', function (event) {
            // 找到被点击的元素
            let target = event.target;

            // 如果是path，找到父级svg
            if (target.tagName === 'path') {
                target = target.closest('svg');
            }

            // 检查id并跳转
            if (target && target.id === 'bilibili_icon') {              // 哔哩哔哩跳转
                navigateToPage('bilibili');
            } else if (target && target.id === 'github_icon') {         // GitHub跳转
                navigateToPage('github');
            } else if (target && target.id === 'twitter_icon') {        // Twitter跳转
                navigateToPage('twitter');
            }
        });
    }

    let left_botton = document.getElementById("left_botton");           // 获取左侧切换按键
    let right_botton = document.getElementById("right_botton");         // 获取右侧切换按键

    // 背景切换
    left_botton.addEventListener('click', function () {
        changeBackground('prev')
    });
    right_botton.addEventListener('click', function () {
        changeBackground('next')
    });
}
/* ----------监听事件---------- */

/* ----------点击弹出大图---------- */
function setupImageModal() {
    let imgModal = document.getElementById("imgModal");                 // 获取模态框元素
    let modalImg = document.getElementById("modalImg");                 // 获取模态框中的图片元素
    let buttonClose = document.getElementById("closeImgModal");         // 获取关闭按钮元素

    document.querySelectorAll("img[src]").forEach(img => {
        img.addEventListener("click", () => {
            imgModal.style.display = "flex";                            // 显示模态框
            document.body.style.overflow = "hidden";                    // 禁止背景滚动
            modalImg.src = img.dataset.src || img.src;                  // 设置模态框图片的源
            modalImg.style.opacity = "0.5";                             // 设置初始透明度  
            modalImg.alt = img.alt || "加载中";                         // 设置模态框图片的替代文本

            modalImg.onload = () => {
                modalImg.style.opacity = "1";                           // 图片加载完成设置透明度为1
            };

            modalImg.onerror = () => {
                modalImg.alt = "图片加载失败";                          // 图片加载失败时设置替代文本
            }
        });
    });

    buttonClose.addEventListener("click", () => {
        imgModal.style.display = "none";                                // 隐藏模态框
        document.body.style.overflow = "auto";                          // 恢复背景滚动
        modalImg.src = "";                                              // 清空模态框图片的源
        modalImg.style.opacity = "0";                                   // 重置透明度
        modalImg.alt = "";                                              // 清空模态框图片的替代文本
    })
}
/* ----------点击弹出大图---------- */

/* ----------点击跳转页面---------- */
// 跳转事件
function navigateToPage(key) {
    if (key && PagePath[key]) {
        return showConfirmDialog(key);
    } else {
        debugPageChange("PagePath 未定义或键不存在:", key);
        return false;
    }
}

// 快速跳转函数
function quickNavigateToPage(key) {
    if (key && PagePath[key]) {
        window.location.href = PagePath[key];
        console.log("快速跳转成功:", key);
        return true;
    } else {
        debugPageChange("PagePath 未定义或键不存在:", key);
        return false;
    }
}

// 当前要跳转的信息
let pendingNavigation = {
    key: null,
    url: null,
    name: null
};

// 显示确认对话框
function showConfirmDialog(key) {
    if (!key || !PagePath[key]) {
        debugPageChange("无效的跳转键:", key);
        return false;
    }

    // 设置待跳转信息
    pendingNavigation = {
        key: key,
        url: PagePath[key],
        name: SiteName[key] || key
    };

    // 更新对话框内容
    const siteNameElement = document.getElementById('confirmSiteName'); // 获取跳转目标名称
    if (siteNameElement) {
        siteNameElement.textContent = pendingNavigation.name;
    }

    // 显示对话框
    const overlay = document.getElementById('confirmOverlay');          // 获取确定对话页面
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
    }

    return true;
}

// 隐藏确认对话框
function hideConfirmDialog() {
    const overlay = document.getElementById('confirmOverlay');          // 获取确定对话页面
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    // 重置待跳转信息
    pendingNavigation = { key: null, url: null, name: null };
}

// 确认跳转
function confirmNavigation() {
    if (pendingNavigation.url) {
        debugPageChange(`确认跳转到: ${pendingNavigation.name}`);

        window.open(pendingNavigation.url, '_blank');                   // 新建窗口打开页面
        hideConfirmDialog();                                            // 隐藏确定对话框

        return true;
    }
    debugPageChange("没有待跳转的URL");
    return false;
}

// 取消跳转
function cancelNavigation() {
    debugPageChange(`取消跳转到: ${pendingNavigation.name}`);
    hideConfirmDialog();                                                // 隐藏确定对话框

    return true;
}

// 初始化对话框事件
function initConfirmDialog() {
    const overlay = document.getElementById('confirmOverlay');          // 获取确定对话页面
    const okBtn = document.getElementById('confirmOk');                 // 获取确定按键
    const cancelBtn = document.getElementById('confirmCancel');         // 获取取消按键

    if (!overlay || !okBtn || !cancelBtn) {
        debugPageChange("确认对话框元素未找到");
        return;
    }

    // 确定按钮点击事件
    okBtn.addEventListener('click', function (event) {
        event.preventDefault();
        confirmNavigation();                                            // 确定
    });

    // 取消按钮点击事件
    cancelBtn.addEventListener('click', function (event) {
        event.preventDefault();
        cancelNavigation();                                             // 取消
    });

    // 点击遮罩层关闭
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            cancelNavigation();                                         // 取消
        }
    });

    // 键盘事件支持
    document.addEventListener('keydown', function (event) {
        const overlay = document.getElementById('confirmOverlay');      // 获取确定对话页面
        if (!overlay || overlay.style.display !== 'flex') return;

        // ESC键取消
        if (event.key === 'Escape') {
            cancelNavigation();                                         //取消
        }
        // Enter键确认
        else if (event.key === 'Enter') {
            confirmNavigation();                                        // 确定
        }
    });
    debugPageChange("确认对话框初始化完成");
}
/* ----------点击跳转页面---------- */

/* ----------点击切换背景---------- */
function initBGChangeSystem() {
    initBackgroundSystem();                                             // 初始化背景系统
    //setupKeyboardShortcuts();                                         // 添加按键控制
}

let currentBackgroundIndex = 0;                                         // 当前背景索引
let backgroundKeys = Object.keys(BGPath);                               // 背景键名数组
let currentMode = 'sequential';                                         // 当前模式: 'sequential' 顺序, 'random' 随机
let randomList = [];                                                    // 随机列表
let isChanging = false;                                                 // 防止重复点击
const LOAD_TIMEOUT = 10000;                                             // 加载超时时间
let currentVideoElement = document.getElementById('bg_video');          // 当前显示的视频
let nextVideoElement = document.getElementById('bg_video_other');       // 用于淡入的视频
let isFading = false;                                                   // 是否正在淡入淡出
const FADE_DURATION = 1000;                                             // 淡入淡出动画时间

// 模式切换
function toggleBackgroundMode(mode) {
    const validModes = ['sequential', 'random'];                        // 定义切换模式

    if (validModes.includes(mode)) {
        currentMode = mode;
        debugBG(`背景切换模式已切换为: ${mode === 'sequential' ? '顺序模式' : '随机模式'}`);

        // 如果切换到随机模式，生成新的随机列表
        if (mode === 'random') {
            generateRandomList();                                       // 生成随机列表
        }

        return true;
    } else {
        debugBG(`无效的模式: ${mode}，支持的模式有: ${validModes.join(', ')}`);
        return false;
    }
}

// 生成随机列表
function generateRandomList() {
    const keys = Object.keys(BGPath);                                   // 获取所有背景的键

    // 如果只有一个或没有背景，直接返回
    if (keys.length <= 1) {
        randomList = [...keys];
        return randomList;
    }

    // 洗牌算法
    const shuffled = [...keys];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 确保新列表的第一个元素不是当前背景
    if (shuffled[0] === backgroundKeys[currentBackgroundIndex]) {
        const randomIndex = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
        [shuffled[0], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[0]];
    }

    randomList = shuffled;
    debugBG('随机列表已生成:', randomList);

    return randomList;
}

// 加载视频函数，返回Promise
function loadVideo(url) {
    return new Promise((resolve, reject) => {
        // 创建视频元素来预加载
        const video = document.createElement('video');
        video.style.display = 'none';

        // 设置超时
        const timeoutId = setTimeout(() => {
            document.body.removeChild(video);
            reject(new Error(`视频加载超时: ${url}`));
        }, LOAD_TIMEOUT);

        // 视频加载成功
        video.oncanplaythrough = () => {
            clearTimeout(timeoutId);
            document.body.removeChild(video);
            resolve(true);
        };

        // 视频加载错误
        video.onerror = () => {
            clearTimeout(timeoutId);
            document.body.removeChild(video);
            reject(new Error(`视频加载失败: ${url}`));
        };

        // 开始加载
        video.src = url;
        video.load();
        document.body.appendChild(video);
    });
}

// 背景切换函数
async function changeBackground(direction = 'next') {
    // 防止重复点击
    if (isChanging || isFading) {
        debugBG('正在切换背景，请稍候...');
        return false;
    }

    // 检查是否有背景
    if (backgroundKeys.length === 0) {
        debugBG('BGPath中没有配置任何背景视频');
        return false;
    }

    isChanging = true;
    debugBG(`开始切换背景，方向: ${direction}，模式: ${currentMode}`);

    try {
        // 确定下一个背景的索引和键
        let nextIndex, nextKey;

        if (currentMode === 'sequential') {
            // 顺序模式
            if (direction === 'next') {
                nextIndex = (currentBackgroundIndex + 1) % backgroundKeys.length;
            } else {
                nextIndex = (currentBackgroundIndex - 1 + backgroundKeys.length) % backgroundKeys.length;
            }
            nextKey = backgroundKeys[nextIndex];
        } else {
            // 随机模式
            if (randomList.length !== backgroundKeys.length) {
                generateRandomList();
            }

            const currentKey = backgroundKeys[currentBackgroundIndex];
            let currentRandomIndex = randomList.indexOf(currentKey);

            if (currentRandomIndex === -1) {
                generateRandomList();
                currentRandomIndex = randomList.indexOf(currentKey) || 0;
            }

            if (direction === 'next') {
                nextIndex = (currentRandomIndex + 1) % randomList.length;
            } else {
                nextIndex = (currentRandomIndex - 1 + randomList.length) % randomList.length;
            }

            nextKey = randomList[nextIndex];
            nextIndex = backgroundKeys.indexOf(nextKey);

            if (nextIndex === -1) {
                throw new Error(`在backgroundKeys中找不到键: ${nextKey}`);
            }
        }

        // 获取视频URL
        const videoUrl = BGPath[nextKey];
        if (!videoUrl) {
            throw new Error(`找不到键 ${nextKey} 对应的视频路径`);
        }

        debugBG(`准备切换到背景: ${nextKey}, URL: ${videoUrl}`);
        await loadVideoToElement(videoUrl, nextVideoElement);           // 预加载视频到备用视频元素
        debugBG('视频预加载成功');

        await performFadeTransition();                                  // 执行淡入淡出切换
        swapVideoElements();                                            // 切换完成后，交换两个视频元素的角色
        currentBackgroundIndex = nextIndex;                             // 更新当前索引

        debugBG(`背景已切换到: ${nextKey}`);

        return {
            success: true,
            key: nextKey,
            url: videoUrl,
            index: nextIndex,
            mode: currentMode
        };

    } catch (error) {
        debugBG('背景切换失败:', error.message);

        resetVideoElements();                                           // 切换失败，重置视频元素状态

        return {
            success: false,
            error: error.message
        };
    } finally {
        isChanging = false;
    }
}

// 加载视频到指定元素
function loadVideoToElement(url, videoElement) {
    return new Promise((resolve, reject) => {
        // 设置超时
        const timeoutId = setTimeout(() => {
            videoElement.oncanplaythrough = null;
            videoElement.onerror = null;
            reject(new Error(`视频加载超时: ${url}`));
        }, LOAD_TIMEOUT);

        // 视频加载成功
        videoElement.oncanplaythrough = () => {
            clearTimeout(timeoutId);
            videoElement.oncanplaythrough = null;
            videoElement.onerror = null;
            resolve(true);
        };

        // 视频加载错误
        videoElement.onerror = () => {
            clearTimeout(timeoutId);
            videoElement.oncanplaythrough = null;
            videoElement.onerror = null;
            reject(new Error(`视频加载失败: ${url}`));
        };

        // 开始加载
        videoElement.src = url;
        videoElement.load();
    });
}

// 执行淡入淡出动画
function performFadeTransition() {
    return new Promise((resolve) => {
        isFading = true;

        debugBG('开始淡入淡出动画...');

        // 备用视频开始播放
        nextVideoElement.play().catch(e => {
            debugBG('备用视频播放失败:', e);
        });

        currentVideoElement.style.opacity = '0';                        // 主视频淡出
        nextVideoElement.style.opacity = '1';                           // 备用视频淡入

        // 等待淡入淡出动画完成
        setTimeout(() => {
            isFading = false;
            debugBG('淡入淡出动画完成');
            resolve();
        }, FADE_DURATION);
    });
}

// 交换视频元素角色
function swapVideoElements() {
    // 交换两个视频元素的引用
    const tempElement = currentVideoElement;
    currentVideoElement = nextVideoElement;
    nextVideoElement = tempElement;

    // 交换ID
    currentVideoElement.id = 'bg_video';
    nextVideoElement.id = 'bg_video_other';

    // 重置z-index
    currentVideoElement.style.zIndex = '-1';
    nextVideoElement.style.zIndex = '-2';

    // 重置透明度
    currentVideoElement.style.opacity = '1';
    nextVideoElement.style.opacity = '0';

    debugBG('视频元素角色已交换');
}

// 重置视频元素状态
function resetVideoElements() {
    // 恢复到初始状态
    currentVideoElement.style.opacity = '1';
    nextVideoElement.style.opacity = '0';
    isFading = false;

    debugBG('视频元素状态已重置');
}

// 获取当前背景信息
function getCurrentBackground() {
    if (backgroundKeys.length === 0) {
        return null;
    }

    const currentKey = backgroundKeys[currentBackgroundIndex];
    return {
        key: currentKey,
        url: BGPath[currentKey],
        index: currentBackgroundIndex,
        mode: currentMode,
        total: backgroundKeys.length
    };
}

// 确保视频元素存在
function ensureVideoElements() {
    if (!currentVideoElement) {
        debugBG('找不到主视频元素 bg_video');
        return false;
    }

    // 检查是否有备用视频元素，没有则创建
    if (!nextVideoElement) {
        nextVideoElement = document.createElement('video');
        nextVideoElement.id = 'bg_video_other';
        nextVideoElement.className = 'background_video';

        copyVideoAttributes(currentVideoElement, nextVideoElement);     // 复制主视频元素的所有属性（除了id）
        currentVideoElement.parentNode.appendChild(nextVideoElement);   // 添加到同一层级

        debugBG('已创建备用视频元素');
    }

    return true;
}

// 复制视频属性
function copyVideoAttributes(source, target) {
    // 复制所有属性和样式
    for (let attr of source.attributes) {
        if (attr.name !== 'id' && attr.name !== 'style') {
            target.setAttribute(attr.name, attr.value);
        }
    }

    // 复制样式
    target.style.cssText = source.style.cssText;

    // 添加淡入淡出相关样式
    target.style.position = 'absolute';
    target.style.top = '0';
    target.style.left = '0';
    target.style.width = '100%';
    target.style.height = '100%';
    target.style.objectFit = 'cover';
    target.style.opacity = '0';
    target.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
    target.style.zIndex = '0';
}

// 初始化视频元素状态
function initVideoElements() {
    if (currentVideoElement && nextVideoElement) {
        // 主视频
        currentVideoElement.style.position = 'absolute';
        currentVideoElement.style.top = '0';
        currentVideoElement.style.left = '0';
        currentVideoElement.style.width = '100%';
        currentVideoElement.style.height = '100%';
        currentVideoElement.style.objectFit = 'cover';
        currentVideoElement.style.opacity = '1';
        currentVideoElement.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
        currentVideoElement.style.zIndex = '-1';

        // 备用视频
        nextVideoElement.style.position = 'absolute';
        nextVideoElement.style.top = '0';
        nextVideoElement.style.left = '0';
        nextVideoElement.style.width = '100%';
        nextVideoElement.style.height = '100%';
        nextVideoElement.style.objectFit = 'cover';
        nextVideoElement.style.opacity = '0';
        nextVideoElement.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`;
        nextVideoElement.style.zIndex = '-2';
    }
}

// 初始化背景系统
function initBackgroundSystem() {
    backgroundKeys = Object.keys(BGPath);                               // 更新背景键列表

    // 初始化视频元素
    if (backgroundKeys.length > 0) {
        ensureVideoElements();                                          // 确保两个视频元素存在
        initVideoElements();                                            // 初始化视频元素状态
        generateRandomList();                                           // 初始化随机列表

        debugBG('背景系统初始化完成');
        debugBG(`总共有 ${backgroundKeys.length} 个背景`);
        debugBG(`当前模式: ${currentMode}`);
        debugBG(`当前背景: ${getCurrentBackground()?.key || '无'}`);
    } else {
        debugBG('背景系统初始化: BGPath中没有配置任何背景视频');
    }
}

//辅助函数
// 直接切换到指定索引的背景
async function changeToBackgroundIndex(index) {
    if (index < 0 || index >= backgroundKeys.length) {
        debugBG(`索引 ${index} 超出范围 (0-${backgroundKeys.length - 1})`);
        return false;
    }

    // 如果要切换的就是当前背景，直接返回
    if (index === currentBackgroundIndex) {
        debugBG('已经是当前背景，无需切换');
        return { success: true, key: backgroundKeys[index] };
    }

    const originalMode = currentMode;
    const originalIndex = currentBackgroundIndex;

    // 临时切换到顺序模式
    currentMode = 'sequential';
    currentBackgroundIndex = index - 1;

    const result = await changeBackground('next');                      // 调用切换函数

    currentMode = originalMode;                                         // 恢复原模式

    if (!result.success) {                                              // 如果失败，恢复原索引
        currentBackgroundIndex = originalIndex;
    }

    return result;
}

// 直接切换到指定键的背景
async function changeToBackgroundKey(key) {
    const index = backgroundKeys.indexOf(key);
    if (index === -1) {
        debugBG(`找不到键为 "${key}" 的背景`);
        return false;
    }

    return changeToBackgroundIndex(index);
}

// 暂停背景视频淡入淡出
function pauseBackgroundVideo() {
    if (currentVideoElement) {
        currentVideoElement.pause();
    }
    if (nextVideoElement) {
        nextVideoElement.pause();
    }
}

// 播放背景视频
function playBackgroundVideo() {
    if (currentVideoElement) {
        currentVideoElement.play().catch(e => {
            debugBG('背景视频播放失败:', e);
        });
    }
}

// 设置淡入淡出时长
function setFadeDuration(duration) {
    FADE_DURATION = duration;

    // 更新CSS过渡时间
    if (currentVideoElement) {
        currentVideoElement.style.transition = `opacity ${duration}ms ease-in-out`;
    }
    if (nextVideoElement) {
        nextVideoElement.style.transition = `opacity ${duration}ms ease-in-out`;
    }

    debugBG(`淡入淡出时长已设置为: ${duration}ms`);
}

// 添加键盘快捷键支持
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // 左箭头键 - 上一个
        if (event.key === 'ArrowLeft') {
            changeBackground('prev');
            event.preventDefault(); // 防止页面滚动
        }
        // 右箭头键 - 下一个
        else if (event.key === 'ArrowRight') {
            changeBackground('next');
            event.preventDefault(); // 防止页面滚动
        }
        // R键 - 切换随机模式
        else if (event.key === 'r' || event.key === 'R') {
            toggleBackgroundMode('random');
            debugBG('已切换到随机模式 (按S键切换回顺序模式)');
        }
        // S键 - 切换顺序模式
        else if (event.key === 's' || event.key === 'S') {
            toggleBackgroundMode('sequential');
            debugBG('已切换到顺序模式 (按R键切换回随机模式)');
        }
        // 数字键1-9 - 直接切换到对应索引的背景
        else if (event.key >= '1' && event.key <= '9') {
            const index = parseInt(event.key) - 1;
            if (index < backgroundKeys.length) {
                changeToBackgroundIndex(index);
            }
        }
    });
}
/* ----------点击切换背景---------- */

/* ----------获取用户IP及国家------------ */
let ip = null;
let country = null;

const ipServices = [
    'https://api.ipify.org?format=json',
    'https://api.ip.sb/ip',
    'https://api.myip.com',
    'https://ipinfo.io/json',
    'https://ipapi.co/json/'
];

const geoApis = [
    `https://ipapi.co/${ip}/json/`,
    `https://ipwho.is/${ip}`,
    `https://ipinfo.io/${ip}/json`
];

// 显示用户信息
async function displayUserInfo() {
    try {
        ip = await getUserIP();                                   // 获取IP
        country = ip ? await getCountryFromIP(ip) : null;         // 获取国家信息

        const ipElement = document.getElementById('user_ip');           // 获取IP容器
        const countryElement = document.getElementById('user_country'); // 获取国家容器

        if (ipElement) ipElement.textContent = ip || '无法获取';
        if (countryElement) countryElement.textContent = country || '未知';

    } catch (error) {
        debugUserInfo('获取用户信息失败:', error);
    }
}

// 获取IP
async function getUserIP() {
    for (let service of ipServices) {
        try {
            const response = await fetch(service, {                     // 尝试获取IP
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) continue;

            const data = await response.json();

            let ip;
            if (data.ip) ip = data.ip;
            else if (data.ip_address) ip = data.ip_address;
            else if (typeof data === 'string') ip = data.trim();

            if (ip) return ip;
        } catch (error) {
            debugUserInfo(`服务 ${service} 失败，尝试下一个`);
            continue;
        }
    }
    return null;
}

// 获取国家
async function getCountryFromIP(ip) {
    if (!ip) return null;

    for (let api of geoApis) {                                          // 尝试获取国家
        try {
            const response = await fetch(api);
            if (!response.ok) continue;

            const data = await response.json();

            let country;
            if (data.country_name) country = data.country_name;
            else if (data.country) country = data.country;
            else if (data.countryName) country = data.countryName;

            if (country) return country;
        } catch (error) {
            continue;
        }
    }
    return null;
}
/* ----------获取用户IP及国家------------ */

/* ----------更新时间------------ */
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',                                                // 设置显示完整年份
        month: '2-digit',                                               // 设置显示两位数
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false                                                   // 禁用12小时制
    });

    const timeElement = document.getElementById('current_time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}
/* ----------更新时间------------ */

/* ----------设置真实视窗高度---------- */

function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
/* ----------设置真实视窗高度---------- */