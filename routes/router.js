/**
 * @desc 根据后缀名读取文件
 * @param pathname string 文件路径 url.parse(request.url).pathname
 * @param fs fs
 * @param request htttp.request
 * @param response https.response
 */
exports.readFileBySuffixName = function (pathname, fs, request, response) {
    var ext = pathname.match(/(\.[^.]+|)$/)[0]; //取得后缀名
    switch (ext) { //根据后缀名读取相应的文件，设置响应头，并发送到客户端
        case ".css":
        case ".js":
            //读取文件
            fs.readFile("." + request.url, 'utf-8', function (err, data) {
                if (err) throw err;
                response.writeHead(200, { //根据不同的后缀设置不同的响应头
                    "Content-Type": {
                        ".css": "text/css",
                        ".js": "application/javascript",
                    } [ext]
                });
                response.write(data); //发送文件数据到客户端
                response.end(); //发送完成
            });
            break;
            //jpg、gif、png后缀的图片
        case ".jpg":
        case ".gif":
        case ".png":
            //二进制读取文件
            fs.readFile("." + decodeURI(request.url), 'binary', function (err, data) {
                if (err) throw err;
                response.writeHead(200, {
                    "Content-Type": {
                        ".jpg": "image/jpeg",
                        ".gif": "image/gif",
                        ".png": "image/png",
                    } [ext]
                });
                response.write(data, 'binary'); //发送二进制数据
                response.end();
            });
            break;
        case ".mp4":
            //读取文件的状态
            fs.stat('.' + decodeURI(request.url), function (err, stats) {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return response.end('404 Not Found');
                    }
                    response.end(err);
                }
                //断点续传，获取分段的位置
                var range = request.headers.range;
                if (!range) {
                    range = 'bytes=0-'+ stats.size +'';
                    //206状态码表示客户端通过发送范围请求头Range抓取到了资源的部分数据
                    //416状态码表示所请求的范围无法满足
                    // return response.end('416 no range');
                }
                //替换、切分，请求范围格式为：Content-Range: bytes 0-2000/4932
                var positions = range.replace(/bytes=/, "").split("-");
                //获取客户端请求文件的开始位置
                var start = parseInt(positions[0]);
                //获得文件大小
                var total = stats.size;
                //获取客户端请求文件的结束位置
                var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                //获取需要读取的文件大小
                var chunksize = (end - start) + 1;

                response.writeHead(206, {
                    "Content-Range": "bytes " + start + "-" + end + "/" + total,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize,
                    "Content-Type": "video/mp4"
                });
                //创建读取流
                var stream = fs.createReadStream('.' + decodeURI(request.url), {
                        start: start,
                        end: end
                    })
                    .on("open", function () {
                        stream.pipe(response); //读取流向写入流传递数据
                    }).on("error", function (err) {
                        response.end(err);
                    }).on("close",function(){
                        console.log('close')
                    }).on("end",function(){
                        console.log('end')
                    });
            });
            break;
        case ".rar":
            //同步读取文件状态
            var stats = fs.statSync("." + decodeURI(request.url));
            response.writeHead(200, {
                "Content-Type": "application/octet-stream", //相应该文件应该下载
                //模板字符串
                "Content-Disposition": `attachment; filename = ${pathname.replace("/","")}`,
                "Content-Length": stats.size
            });
            //管道流
            fs.createReadStream("." + decodeURI(request.url)).pipe(response);
            break;
            //以上都不匹配则使用默认的方法
        default:
            fs.readFile('.' + pathname, 'utf-8', function (err, data) {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
                response.end();
            });
    }
}