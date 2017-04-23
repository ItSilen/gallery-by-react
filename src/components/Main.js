require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关的数据

var imageDatas = require('../data/imageDatas.json');

// 利用执行函数将图片名转成图片url路径信息。 
imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];
		// 增加一个属性,等于在json里面多加了一个键值。
		singleImageData.imageURL = require("../images/" + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

// imageDatas = genImageURL(imageDatas);

var ImgFigure = React.createClass({
	render: function() {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL}
					 alt={this.props.data.title}
						/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>

		)
	}
})


var GalleryByReactApp = React.createClass({
  render: function() {
  	var controllUnits = [],
  		imgFigures = [];
	
	imageDatas.forEach(function(value,index) {
			imgFigures.push(<ImgFigure key={index} data={value}/>);
		})

    return (
      <section className="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllUnits}
      	</nav>
      </section>
    )
  }
})




export default GalleryByReactApp;