
/**************************************************
* Title : Shooting Games						  *
* *************************************************
* Language type : HTML5 + JavaScript			  *
* *************************************************
* Coding rules : Lower camel					  *
* *************************************************
* Authors : Ryo Sugiyama (c) 2016.11.30 Start	  *
* *************************************************
* History :  									  *
* 		2016.11.30 var1 Created basic part.		  *
* 			 12. 7 var2 Created KeyEvent		  *
***************************************************/

'use strict';


/**************************************************
* class name : KeyCode							  *
***************************************************
* Authers : Ryo Sugiyama (c) 2016.12.7 			  *
***************************************************
* キーコードの定義　　　　　　　　　　　　　　　		  *
***************************************************
*  引数 : event : イベント							  *
**************************************************/
var KeyCode  = function(){
	this.arrowLeft  = 37;
	this.arrowUp    = 38;
	this.arrowRight = 39;
	this.arrowDown  = 40;
	this.keySpace   = 32;
	this.keyEnter   = 13;
}


/**************************************************
* class name : Player							  
***************************************************
* Authers : Ryo Sugiyama (c) 2016.12.7 			  
***************************************************
* プレイヤーの各要素　　　　　　　　　　　　　　　		  
***************************************************
* 引数 : x      : プレイヤーのx座標　　　　　　　　　　　 
*        y      : プレイヤーのy座標
* 	　   width  : プレイヤーの縦の長さ
* 	　   height : プレイヤーの横の長さ				  
***************************************************/
var Player = function(x ,y ,width ,heigth) {
	this.mImg = new Image();
	this.mImg.src =/*画像のパス*/ + new Date().getTime();
	this.mPointX  = x;
	this.mPointY  = y;
	this.mWidth   = width;
	this.mHeight  = heigth;
	this.mPointCX = x + width / 2;
	this.mPointCY = y + heigth / 2;
	this.mPointCR = (this.mWidth < this.mHeight)? (this.mWidth / 2) : (this.mHeight / 2);

	this.mEventMoveRight = false;
	this.mEventMoveLeft  = false;
    this.mEventMoveUp    = false;
    this.mEventMoveDown  = false;
    this.mDurability     = 4;
}

/**************************************************
* class name : Enemy							  
***************************************************
* Authers : Ryo Sugiyama (c) 2016.12.7 			  
***************************************************
* プレイヤーの各要素　　　　　　　　　　　　　　　		  
***************************************************
* 引数 : type : 敵の種類			  
***************************************************/
var Enemy = function( x, y, width, height, type, src, onActive, onAttack, speed, durability){
	
	this.mPointX  = x;
	this.mPointY  = y;
	this.mWidth   = width;
	this.mHeight  = heigth;
	this.mPointCX = x + width / 2;
	this.mPointCY = y + heigth / 2;
	this.mPointCR = (this.mWidth < this.mHeight)? (this.mWidth / 2) : (this.mHeight / 2);

	this.mImg = new Image();
	this.mImg.src = src;
	this.Type = type;
	this.onActive = onActive;
	this.onAttack = onAttack;
	this.speed = speed;
	this.durability = durability;

}
var StgSystem = function(){
	this.mScore;		
	this.mGrazeScore;		
    this.mBackGroundImg;
    this.mTimer;
    this.mIsGameOver;		
    this.mIsGameStart;		
    this.mStartBlink;		
    this.mBlinkCnt;			
    
    function Initialize(){
    	window.resizeTo(360,580);

    	mIsGameOver  = false;
    	mIsGameStart = false;
    	mStartBlink  = false;
    	mBlinkCnt    = 0;
    	mScore = 0;

    	canvas  = document.getElementById("canvas");
    	context = canvas.getContext("2d");
    	
    	mBackGroundImg = new Image();
    	mBackGroundImg.src = "../Resource/1ce3a6b9.jpg?" + new Date().getTime();

    	mBackGroundImg.onLoad = function(){
    		context.drawImage( mBackGroundImg, 0, 0);
    	}
    	Player = new Player(150,440,50,50);

    }
}

/**************************************************
* class name : keyEvent							  
***************************************************
* Authers : Ryo Sugiyama (c) 2016.12.7 			  
***************************************************
* キー入力に関するイベント　　　　　　　　　　　		  
***************************************************
* 引数 : void			  
***************************************************/
var KeyEvent = function(){
	window.addEventListener('keyDown',KeyDownFunction,true);
	window.addEventListener('keyUp'  ,KeyUpFunction  ,true);

	function KeyDownFunction(event){
		var code = event.KeyCode;

		switch(code){
			case KeyCode.arrowLp:
				 Player.mEventMoveUp = true;
				 event.preventDefault();
				 break;
			case KeyCode.arrowRight:
				 Player.mEventMoveRight = true;
				 event.preventDefault();
				 break;
			case KeyCode.arrowDown:
				 Player.mEventMoveDown = true;
				 event.preventDefault();
				 break;
			case KeyCode.arrowLeft:
				 Player.mEventMoveLeft = true;
				 event.preventDefault();
				break;
			case KeyCode.keySpace:


		}
	}
}