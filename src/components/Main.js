require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
var ReactDOM = require('react-dom'); 

// let yeomanImage = require('../images/yeoman.png');

// 获取图片相关的数组
let imageDatas = require("../data/imageDatas.json");


// 自执行函数，把图片的文件名转为真实有效的图片地址
imageDatas = (function genImageURL(imageDataArr) {
	for (var i = 0; i < imageDataArr.length; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require("../images/" + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);

// 获取区间内 的一个随机值
function getRangeRandom(low, height) {
	return Math.ceil(Math.random() * (height - low) + low);
}

// 随机倾斜角度
function get30DegRandom() {
	return ((Math.random() > 0.5 ? "" : "-" )+ Math.ceil(Math.random() * 30));
}

class ControllerUnit extends React.Component{
	constructor(props){
		super(props);
		this.handleClick= (e) => {
			if (this.props.arrange.isCenter) {
				this.props.inverse();
			} else {
				this.props.center();
			}
			
			e.stopPropagation();
			e.preventDefault();
		}
	};

	render() {
		var controllerUnitClassName = "controller-unit";

		if (this.props.arrange.isCenter) {
			controllerUnitClassName += " is-center";
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += " is-inverse";
			}
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		)
	}
}

// 单个图片组件
class ImgFigure extends React.Component {
	constructor(props){
		super(props);
		this.handleClick= (e) => {
			if (this.props.arrange.isCenter) {
				this.props.inverse();
			} else {
				this.props.center();
			}
			
			e.stopPropagation();
			e.preventDefault();
		}
	};

	render() {
		var styleObj = {};

		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		if (this.props.arrange.rotate) {
			styleObj["transform"] = "rotate(" + this.props.arrange.rotate + "deg)";
			styleObj["webkitTransform"] = "rotate(" + this.props.arrange.rotate + "deg)";
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
							<p>
								{this.props.data.desc}
							</p>
						</div>
				</figcaption>
			</figure>
		)
	}
};

class AppComponent extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			imgsArrangeArr: [
				// // {
				// pos: {

				// 	left: "0",
				// 	top: "0"
				// },
				// rotate: 0, //旋转角度
				// isInverse: false //图片正反面
				// isCenter: false //图片是否居中

				
				// // }
			]
		};

		this.Constant = {
				centerPos: {
					left: 0,
					right: 0
				},
				hPosRange: {
					leftSecX: [0, 0],
					rightSecX: [0, 0],
					y: [0, 0]
				},
				vPosRange: {
					x: [0, 0],
					topY: [0, 0]
				}
			}

		this.center = (index) => {
			return () => {
				this.rearrange(index)
			}
		}
	}

	rearrange(centerIndex) {

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
			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			// 设置居中图片的位置状态
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			}

			// 取出布局上侧图片的状态信息
			topImgSpliceIndex = parseInt(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			// 设置上侧图片的位置状态
			imgsArrangeTopArr.forEach(function(value, index) {
				imgsArrangeTopArr[index]= {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			})

			// 设置左右两侧图片的位置状态
			for (var i = 0, k = imgsArrangeArr.length / 2; i < imgsArrangeArr.length; i++) {
				var hPosRangeLORX = null;
				// 一半布局左边，一半右边
				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				} else {
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}

			// 把位置状态信息重新的合并回去
			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
	};
	
	inverse(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = ! imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this);
	};

	

	componentDidMount() {
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.rearrange(0);
	};

  	render() {
  		var controllerUnits = [],
  			imgFigures = [];

		imageDatas.forEach(function(value, index) {
			
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: "0",
						top: "0"
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
				
				
			}
			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
				 inverse={this.inverse(index)} center={this.center(index)}/>);
			controllerUnits.push(<ControllerUnit  key={index} arrange={this.state.imgsArrangeArr[index]} 
				inverse={this.inverse(index)} center={this.center(index)}/>)
		}.bind(this));
	
    	return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
    	)
  	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
