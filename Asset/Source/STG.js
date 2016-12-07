'use strict';

var KeyCode  = function(){
	this.arrowLeft  = 37;
	this.arrowUp    = 38;
	this.arrowRight = 39;
	this.arrowDown  = 40;
	this.keySpace   = 32;
	this.keyEnter   = 13;
}

var Player = function(x ,y ,width ,heigth) {
	this.mImg = new Image();
	this.mImg.src =/*画像のパス*/ + new Date().getTime();
	this.mPointX = x;
	this.mPointY = y;
	this.mWidth = width;
	this.mHeight = heigth;
	this.mPointCX = x + width / 2;
	this.mPointCY = y + heigth / 2;
	this.mPointCR = (this.mWidth < this.mHeight)? (this.mWidth / 2) : (this.mHeight / 2); 
	this.mEventMoveRight = false;
	this.mEventMoveLeft  = false;		// ←
    this.mEventMoveUp    = false;		// ↑
    this.mEventMoveDown  = false;		// ↓
    this.mDurability = 4;
}

var KeyEvent = function(){
	window.addEventListener('keyDown',KeyDownFunction,true);
	window.addEventListener('keyUp'  ,KeyUpFunction  ,true);

	function KeyDownFunction(event){
		var code = event.KeyCode;

		switch(code){
			case arrowLeft:

				player.moveLeft = true;
				event.preventDefault();
				break;
			case arrowRight:


		}
	}
}