function dealImage(path, obj, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function() {
        // 預設按比例壓縮
        let w = img.width,
            h = img.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        let quality = 0.7; // 預設圖片質量為0.7
        //生成canvas
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        // 建立屬性節點
        let nw = document.createAttribute("width");
        nw.nodeValue = w;
        let nh = document.createAttribute("height");
        nh.nodeValue = h;
        canvas.setAttributeNode(nw);
        canvas.setAttributeNode(nh);
        ctx.drawImage(img, 0, 0, w, h);
        // 影象質量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        // quality值越小，所繪製出的影象越模糊
        let base64 = canvas.toDataURL('image/jpeg', quality);
        // 回撥函式返回base64的值
        callback(base64);
    }
};
// export { dealImage };