require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用执行函数将图片名转成图片url路径信息。 
imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];
		// 增加一个属性,
		singleImageData.imageURL = require("../images/" + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr
})(imageDatas);

// imageDatas = genImageURL(imageDatas);


var GalleryByReactApp = React.createClass({
  render: function(){
    return (
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav clannNamd="controller-nav">
      	</nav>
      </section>
    )
  }
})

React.render(<GalleryByReactApp />, document.getElementById("app"));

module.exports = GalleryByReactApp;