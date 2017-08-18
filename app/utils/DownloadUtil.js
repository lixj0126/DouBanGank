'use strict';

import RNFetchBlob from 'react-native-fetch-blob';

//下载路径
const PictureDir = RNFetchBlob.fs.dirs.PictureDir;

class DownloadUtil {
	static loadImage(uri_attachment, filename_attachment, mimetype_attachment, callback): void {
		new Promise((RESOLVE, REJECT) => {
      // Fetch attachment
      RNFetchBlob.fetch('GET', uri_attachment)
        .then((response) => {
          let base64Str = response.data;
          let imageLocation = PictureDir+'/'+filename_attachment;
          //Save image
          RNFetchBlob.fs.writeFile(imageLocation, base64Str, 'base64');
          RNFetchBlob.fs.scanFile([ { path : imageLocation, mime : mimetype_attachment } ])
        .then(() => {
          console.log("scan file success")
          //ToastAndroid.show('保存成功', ToastAndroid.SHORT);
          callback();
        })
        .catch((err) => {
          console.log("scan file error")
        })

        }).catch((error) => {
        // error handling
        console.log("Error:", error)
      });
    });
	}
}
module.exports = DownloadUtil;