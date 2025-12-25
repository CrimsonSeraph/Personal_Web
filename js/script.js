/* ----------DOM后加载脚本---------- */
document.addEventListener("DOMContentLoaded", () => {
    setRealViewportHeight();
    addAllListener();
    setupImageModal();
    initBGChangeSystem()
});
/* ----------DOM后加载脚本---------- */

/* ----------资源路径---------- */
//跳转路径
const PagePath = {
    //Page: "./page.html",
    personal_page: "",
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
    window.addEventListener('resize', setRealViewportHeight);       // 视窗尺寸变化时，重新设置真实视窗高度

    let top_left_area = document.getElementById("top_left");        // 获取页面跳转区域的父级元素

    // 页面跳转点击事件监听
    top_left_area.addEventListener("click", function () {           // 个人主页跳转
        navigateToPage("personal_page");
    })

    let left_botton = document.getElementById("left_botton");       // 获取左侧切换按键
    let right_botton = document.getElementById("right_botton");     // 获取右侧切换按键

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
    let imgModal = document.getElementById("imgModal");             // 获取模态框元素
    let modalImg = document.getElementById("modalImg");             // 获取模态框中的图片元素
    let buttonClose = document.getElementById("closeImgModal");     // 获取关闭按钮元素

    document.querySelectorAll("img[src]").forEach(img => {
        img.addEventListener("click", () => {
            imgModal.style.display = "flex";                        // 显示模态框
            document.body.style.overflow = "hidden";                // 禁止背景滚动
            modalImg.src = img.dataset.src || img.src;              // 设置模态框图片的源
            modalImg.style.opacity = "0.5";                         // 设置初始透明度  
            modalImg.alt = img.alt || "加载中";                     // 设置模态框图片的替代文本

            modalImg.onload = () => {
                modalImg.style.opacity = "1";                       // 图片加载完成设置透明度为1
            };

            modalImg.onerror = () => {
                modalImg.alt = "图片加载失败";                      // 图片加载失败时设置替代文本
            }
        });
    });

    buttonClose.addEventListener("click", () => {
        imgModal.style.display = "none";                            // 隐藏模态框
        document.body.style.overflow = "auto";                      // 恢复背景滚动
        modalImg.src = "";                                          // 清空模态框图片的源
        modalImg.style.opacity = "0";                               // 重置透明度
        modalImg.alt = "";                                          // 清空模态框图片的替代文本
    })
}
/* ----------点击弹出大图---------- */

/* ----------点击跳转页面---------- */
// 跳转事件
function navigateToPage(key) {
    if (key && PagePath[key]) {
        //window.location.href = PagePath[key];
        console.log("跳转成功" + key);
        return true;
    } else {
        console.warn("PagePath 未定义或键不存在:", key);
        return false;
    }
}
/* ----------点击跳转页面---------- */

/* ----------点击切换背景---------- */
function initBGChangeSystem() {
     initBackgroundSystem();
     //setupKeyboardShortcuts();
}

let currentBackgroundIndex = 0;                                     // 当前背景索引
let backgroundKeys = Object.keys(BGPath);                           // 背景键名数组
let currentMode = 'sequential';                                     // 当前模式: 'sequential' 顺序, 'random' 随机
let randomList = [];                                                // 随机列表
let isChanging = false;                                             // 防止重复点击
const LOAD_TIMEOUT = 10000;                                         // 加载超时时间
let currentVideoElement = document.getElementById('bg_video');      // 当前显示的视频
let nextVideoElement = document.getElementById('bg_video_other');   // 用于淡入的视频
let isFading = false;                                               // 是否正在淡入淡出
const FADE_DURATION = 1000;                                         // 淡入淡出动画时间

// 模式切换
function toggleBackgroundMode(mode) {
    const validModes = ['sequential', 'random'];

    if (validModes.includes(mode)) {
        currentMode = mode;
        console.log(`背景切换模式已切换为: ${mode === 'sequential' ? '顺序模式' : '随机模式'}`);

        // 如果切换到随机模式，生成新的随机列表
        if (mode === 'random') {
            generateRandomList();
        }

        return true;
    } else {
        console.warn(`无效的模式: ${mode}，支持的模式有: ${validModes.join(', ')}`);
        return false;
    }
}

// 生成随机列表
function generateRandomList() {
    // 获取所有背景的键
    const keys = Object.keys(BGPath);

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
    console.log('随机列表已生成:', randomList);

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
        console.log('正在切换背景，请稍候...');
        return false;
    }

    // 检查是否有背景
    if (backgroundKeys.length === 0) {
        console.warn('BGPath中没有配置任何背景视频');
        return false;
    }

    isChanging = true;
    console.log(`开始切换背景，方向: ${direction}，模式: ${currentMode}`);

    try {
        // 确定下一个背景的索引和键（与原函数相同）
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

        console.log(`准备切换到背景: ${nextKey}, URL: ${videoUrl}`);

        // 预加载视频到备用视频元素
        console.log('开始预加载视频到备用视频元素...');
        await loadVideoToElement(videoUrl, nextVideoElement);
        console.log('视频预加载成功');

        // 执行淡入淡出切换
        await performFadeTransition();

        // 切换完成后，交换两个视频元素的角色
        swapVideoElements();

        // 更新当前索引
        currentBackgroundIndex = nextIndex;

        console.log(`背景已切换到: ${nextKey}`);

        return {
            success: true,
            key: nextKey,
            url: videoUrl,
            index: nextIndex,
            mode: currentMode
        };

    } catch (error) {
        console.error('背景切换失败:', error.message);

        // 切换失败，重置视频元素状态
        resetVideoElements();

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

        console.log('开始淡入淡出动画...');

        // 备用视频开始播放
        nextVideoElement.play().catch(e => {
            console.warn('备用视频播放失败:', e);
        });

        // 主视频淡出
        currentVideoElement.style.opacity = '0';

        // 备用视频淡入
        nextVideoElement.style.opacity = '1';

        // 等待淡入淡出动画完成
        setTimeout(() => {
            isFading = false;
            console.log('淡入淡出动画完成');
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

    console.log('视频元素角色已交换');
}

// 重置视频元素状态
function resetVideoElements() {
    // 恢复到初始状态
    currentVideoElement.style.opacity = '1';
    nextVideoElement.style.opacity = '0';
    isFading = false;

    console.log('视频元素状态已重置');
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
    // 主视频元素应该已经存在于HTML中
    if (!currentVideoElement) {
        console.error('找不到主视频元素 bg_video');
        return false;
    }

    // 检查是否有备用视频元素，没有则创建
    if (!nextVideoElement) {
        nextVideoElement = document.createElement('video');
        nextVideoElement.id = 'bg_video_other';
        nextVideoElement.className = 'background-video';

        // 复制主视频元素的所有属性（除了id）
        copyVideoAttributes(currentVideoElement, nextVideoElement);

        // 添加到同一层级
        currentVideoElement.parentNode.appendChild(nextVideoElement);

        console.log('已创建备用视频元素');
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
        const container = currentVideoElement.parentNode;

        // 主视频（当前显示）
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

// 初始化函数
function initBackgroundSystem() {
    // 更新背景键列表
    backgroundKeys = Object.keys(BGPath);

    // 初始化视频元素
    if (backgroundKeys.length > 0) {
        // 确保两个视频元素存在
        ensureVideoElements();

        // 初始化视频元素状态
        initVideoElements();

        // 初始化随机列表
        generateRandomList();

        console.log('背景系统初始化完成');
        console.log(`总共有 ${backgroundKeys.length} 个背景`);
        console.log(`当前模式: ${currentMode}`);
        console.log(`当前背景: ${getCurrentBackground()?.key || '无'}`);
    } else {
        console.warn('背景系统初始化: BGPath中没有配置任何背景视频');
    }
}

//辅助函数
// 直接切换到指定索引的背景
async function changeToBackgroundIndex(index) {
    if (index < 0 || index >= backgroundKeys.length) {
        console.warn(`索引 ${index} 超出范围 (0-${backgroundKeys.length - 1})`);
        return false;
    }

    // 如果要切换的就是当前背景，直接返回
    if (index === currentBackgroundIndex) {
        console.log('已经是当前背景，无需切换');
        return { success: true, key: backgroundKeys[index] };
    }

    const originalMode = currentMode;
    const originalIndex = currentBackgroundIndex;

    // 临时切换到顺序模式
    currentMode = 'sequential';
    currentBackgroundIndex = index - 1;

    // 调用切换函数
    const result = await changeBackground('next');

    // 恢复原模式
    currentMode = originalMode;

    if (!result.success) {
        // 如果失败，恢复原索引
        currentBackgroundIndex = originalIndex;
    }

    return result;
}

// 直接切换到指定键的背景
async function changeToBackgroundKey(key) {
    const index = backgroundKeys.indexOf(key);
    if (index === -1) {
        console.warn(`找不到键为 "${key}" 的背景`);
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
            console.warn('背景视频播放失败:', e);
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

    console.log(`淡入淡出时长已设置为: ${duration}ms`);
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
            console.log('已切换到随机模式 (按S键切换回顺序模式)');
        }
        // S键 - 切换顺序模式
        else if (event.key === 's' || event.key === 'S') {
            toggleBackgroundMode('sequential');
            console.log('已切换到顺序模式 (按R键切换回随机模式)');
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

/* ----------设置真实视窗高度---------- */
function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
/* ----------设置真实视窗高度---------- */