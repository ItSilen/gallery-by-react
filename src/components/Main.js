require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
var ReactDOM = require('react-dom');
/* 获取图片相关的数据*/

var imageDatas = require('../data/imageDatas.json');

/*利用执行函数将图片名转成图片url路径信息。  */
imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];
		/*增加一个属性,等于在json里面多加了一个键值。*/
		singleImageData.imageURL = require("../images/" + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
 *获取区间内日的一个随机值
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low)
}

/*
 *获取0到30度之间的任意正负值
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random() * 30))
}


/*imageDatas = genImageURL(imageDatas);*/

var ImgFigure = React.createClass({
	/*
	 *imgfigure的点击处理函数
	 */
	handleClick: function(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	},

	render: function() {
		var styleObj = {};

		/*如果props属性指定了这张图片的位置，则使用*/
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		};

		// 如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			(["-moz-", "-ms-", "-webkit-", "-o-", ""]).forEach(function(value) {
				styleObj[value + "transform"] = "rotate(" + this.props.arrange.rotate + "deg)";
			}.bind(this))
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "img-figure";
		imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";
		// alert(this.props.arrange.isInverse)
		return (<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}> 
					<img src={this.props.data.imageURL}  alt={this.props.data.title}/> 
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2> 
						<div className="img-back" onClick={this.handleClick}>
							<p>
								{this.props.data.desc}
							</p>
						</div>
					</figcaption> 
				</figure>)
	}
})


var GalleryByReactApp = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: { /*水平方向的取值范围*/
			/*左分区x取值范围*/
			leftSecX: [0, 0],
			/* 右分区x*/
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: { /*垂直方向的取值范围*/
			x: [0, 0],
			topY: [0, 0]
		}
	},

	/*
	 *翻转图片
	 *@param index 输入当前被执行inverse操作的 图片对应的的图片信息数组的index值
	 *@return {function} 这时一个闭包函数，其内return 一个真正待被执行的函数
	 */
	inverse: function(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this)
	},

	/* 
	 *重新布局我们所有的图片
	 * @param centerIndex 指定居中排布那个图片
	 */
	rearrange: function(centerIndex) {

		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			/* 存储我们布局在上侧区域的图片的状态信息，取一个或者不取，随机数取整值就会变为0和1？？：1和2吧*/
			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),
			topImgSpliceIndex = 0,
			/* 居中图片的状态信息*/
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		// 首先居中我们centerIndex的图片,正中央的图片它不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		/* 取出要布局上侧的图片的状态信息*/
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		/* 取出来后就要布局位于上侧的图片*/
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		});


		/* 布局左右两侧的图片*/
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;
			/* 前半部分布局左边，右半部分布局右边*/
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			};
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		};


		/* 位置信息都处理完了，重新的把他们合并起来,也就是把剔除的重新插回去*/
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});


	},

	/*
	 *利用rearrange函数居中对应的图片
	 *@param index, 需要被居中的图片对应的图片信息数组的Index值，
	 *return {function} 
	 */
	center: function(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState: function() {
		return {
			imgsArrangeArr: [
				// {
				/*pos: {

					left: "0",
					top: "0"
				},
				rotate: 0, //旋转角度
				isInverse: false //图片正反面
				isCenter: false //图片是否居中

				*/
				// }
			]
		};

	},
	// componentDidUpdate: function() {
	// 	alert("up")
	// },
	// componentWillUnmount: function() {
	// 	alert("un")
	// },

	/* 组件加载以后，为每张图片计算其位置的范围。*/
	componentDidMount: function() {

		/* 首先拿到舞台的大小*/
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			/*一半取整*/
			halfStageH = Math.ceil(stageH / 2);
		/* console.log(halfStageH);*/
		/* 拿到一个imgFigure的大小*/
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		/* 计算中心图片的位置点*/
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		/* 计算左侧右侧区域图片排布位置的取值范围*/
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		/* 计算上侧区域图片排布位置的取值范围*/
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgW * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	},

	render: function() {
		var controllUnits = [],
			imgFigures = [];
		imageDatas.forEach(function(value, index) {

			if (!this.state.imgsArrangeArr[index]) {

				this.state.imgsArrangeArr[index] = {
						pos: {
							left: 0,
							top: 0
						},
						rotate: 0,
						isInverse: false,
						isCenter: false
					}
					// alert(index)
			};
			imgFigures.push(<ImgFigure ref={"imgFigure"+index} 
				data={value} arrange={this.state.imgsArrangeArr[index]}
				inverse = {this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));
		return (
			<section className="stage" ref="stage">
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