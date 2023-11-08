export const IsMobile = () => {
    let isMobile = false
    if ("maxTouchPoints" in navigator) {
        isMobile = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
        isMobile = navigator.msMaxTouchPoints > 0;
    } else {
        var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mQ && mQ.media === "(pointer:coarse)") {
            isMobile = !!mQ.matches;
        } else if ('orientation' in window) {
            isMobile = true; 
        } else {
            isMobile = ( /Android|Windows Phone|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
        }
    }
    return isMobile;
}