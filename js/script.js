/* DOM后加载脚本 */
document.addEventListener("DOMContentLoaded", () => {
    setRealViewportHeight();
    setupImageModal();
});
/* -DOM后加载脚本- */

/* 监听事件 */
window.addEventListener('resize', setRealViewportHeight);   // 视窗尺寸变化时，重新设置真实视窗高度

// 点击图片弹出大图
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

/* -监听事件- */

/* 设置真实视窗高度 */
function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
/* -设置真实视窗高度- */