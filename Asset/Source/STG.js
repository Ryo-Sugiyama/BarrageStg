'use strict';

/**************************************************
* 座標・幅・高さを持つクラス。
* あたり判定を管理する関数も管理
***************************************************/
class Rectangle { 

	//コンストラクタ：各変数の初期化
	constructor(x, y, width, height ) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	//矩形のあたり判定を管理する関数
	hitTest(other) {

		//AND演算で、TRUE or FALSE が格納される 
		const horizontal = (other.x < this.x + this.width) &&
			(this.x < other.x + other.width);

		//AND演算で、TRUE or FALSE が格納される
		const vertical = (other.y < this.y + this.height) && 
			(this.y < other.y + other.height);

		//AND演算で、両方TRUEの場合はTRUE。それ以外の場合はFALSEを返す
		return (horizontal && vertical);
	}
}

/*************************************************
* 画像の定義・初期化をするクラス
**************************************************/
class Sprite {

	//コンストラクタ：スプライトとその座標・幅・高さを初期化
	constructor(image,rectangle) {
		this.image = image;
		this.rectangle = rectangle;
	}
}

/*************************************************
* 初期化した画像の読み込みをするクラス
**************************************************/
class AssetLoader {
	//コンストラクタ：プライベート変数の初期化
	constructor(){
		this._promises = [];
		this._assets = new Map();
	}

	addImage(name,url) {
		const img = new Image();
		img.src = url;

		//実行と完了に遅延がある処理を非同期処理で扱う
		//resolve():成功時の処理・reject:例外処理
		const promise = new Promise((resolve,reject) =>
			img.addEventListener('load',(e)=>{
				this._assets.set(name,img);
				resolve(img);
			}))
		this._promises.push(promise);
		//実行状態がpending(未解決)からfulfilled(解決)に変化
	}

	loadAll(){
		//すべての並列処理が終わったタイミングを調べるために使うのがPromise.all
		return Promise.all(this._promises)
				 .then((p) => this._assets);
	}

	get(name){
		//set(name,img) で登録した名前をget(name)で受け取る
		return this._assets.get(name);
	}
}
const assets = new AssetLoader();

class EventDispatcher {
	constructor(){
		this._eventListeners = {};
	}

	addEventListener(type,callback) {
		if(this._eventListeners[type] == undefined) {
			this._eventListeners[type] = [];
		}

		this._eventListeners[type].push(callback);
	}

	dispatchEvent(type,event) {
		const losteners = this._eventListeners.forEach((callback) => callback(event));
	}
}

class Character extends EventDispatcher {
	constructor(x, y, hitAria, tags = []){
		this.hitAria = hitAria;
		this._hitAriaOffsetX = hitAria.x;
		this._hitAriaOffsetY = hitAria.y;
		this.tags = tags;

		this.x = x;
		this.y = y;
	}

	update(gameinfo, input) {}

	render(target) {}

	hasTag(tagName) {
		return this.tag.includes(tagName);
	}
	spawnCharacter(character) {
		this.dispatchEvent('spawncharacter', new GameEvent(character));
	}

	destoy() {
		this.dispatchEvent('destoy' , new GameEvent(this));
	}

	get x() {
		return this.x;
	}

	set x(value) {
		this.x = value;
		this.hitAria.x = value + this._hitAriaOffsetX;
	}

	get y() {
		return this.y;
	}

	set y(value) {
		this.y = value;
		tihs.hitAria = value + this._hitAriaOffsetY;
	}
}

class SpritCharacter extends Character {
	constructor(x, y, sprite, hitAria, tags = []) {
		super(x, y, hitAria, tags);
		this.sprite = sprite;
		this.width = sprite.Rectangle.width;
		this.height = sprite.Rectangle.height;
	}

	render(target) {
		const context = target.getContext('2d');
		const rect = this.sprite.rectangle;
		content.drawImage(this.sprite.image,
			rect.x, rect.y, 
			rect.width, rect.height,
			this.x, this.y, 
			rect.width, rect.height);
	}

	isOutOfBounds(boundRect) {
		const characterLeft = this.x;
		const characterRight = this.x + this.width;
		const characterTop = this.y;
		const characterBottom = this.y + this.height;

	    const horizontal = (characterRight < boundRect.x || characterLeft > boundRect.width); 
	    const vertical = (characterBottom < boundRect.y || characterTop > boundRect.height);

	    return (horizontal || vertical);
	}
}

class Input {
	constructor(keyMap, prevKeyMap) {
		this.keyMap = keyMap;
		this.prevKeyMap = prevKeyMap;
	}

	_getKeyFromMap(keyName, map) {
		if(map.has(keyName)){
			return map.get(keyName);
		}
		else {
			return false;
		}
	}

	_getPrevKey(keyName) {
		return this._getKeyFromMap(keyName, this.keyMap);
	}

	getKey(keyName) {
		return this._getKeyFromMap(keyName, this.keyMap);
	}

	getKeyDown(keyName) {
		const prevDown = this._getPrevKey(keyName);
		const currentDown = this.getKey(keyName);
		return (!prevDown && !currentDown);
	}

	getKeyUp(keyName) {
		const prevDown = this._getPrevKey(keyName);
		const currentDown = this.getKey(keyName);
		return (prevDown && currentDown);
	}
}

class InputReceiver {
	constructor() {
		this._keyMap = new Map();
		this._prevKeyMap = new Map();

		addEventListener('keydown',(ke) => this._keyMap.set(ke.key,true));
		addEventListener('keyup',(ke) => this._keyMap.set(ke.key,false));

	}

	getInput() {
		const keyMap = new Map(this._keyMap);
		const prevKeyMap = new Map(this._prevKeyMap);
		this._prevKeyMap = new Input(keyMap,prevKeyMap);
	}
}

class Scene extends EventDispatcher {
	constructor(name,backgroundColor,renderingTarget) {
		this.name = name;
		this.backgroundColor = backgroundColor;
		this.actors = [];
		this.renderingTarget = renderingTarget;

		this._destroyedActors = [];
	}

	add(actor) {
		this.actors.push(actor);
		actor.addEventListener('spawnactor',(e) => this.add(e.target));
		actor.addEventListener('destroy',(e) => this._addDestroyedActors(e.target));
	}

	remove(actor) {
		const index = this.actors.indexOf(actor);
		this.actors.splice(index,1);
	}

	changeScene(newScene) {
		const event = new GameEvent(newScene);
		this.dispatchEvent('changeScene',event);
	}

	update(gameInfo,input) {
		this._updateAll(gameInfo,input);
		this._hitTest();
		this._disposeDestroyedActors();
		this._clrerDrawScreen(gameInfo);
		this._renderAll();
	}

	_updateAll() {
		const length = this.actors.length;
		for(let i = 0; i < length - 1; i++) {
			for(let j = i + 1; j < length; j++) {
				const obj1 = this.actors[i];
				const obj2 = this.actors[j];
				const hit = obj1.hitAria.hitTest(obj2.hitAria);
				if(hit) {
					obj1.dispatchEvent('hit',new GameEvent(obj2));
					obj2.dispatchEvent('hit',new GameEvent(obj1));

				}
			}
		}
	}

	_clearDrawScreen(gameInfo) {
		const context = this.renderingTarget.getContext('2d');
		const width = gameInfo.screenRectangle.width;
		const height = gameInfo.screenRectangle.height;

		context.fillStyle = this.backgroundColor;
		context.fillRect(0,0,width,height);
	}

	_renderAll() {
		this.actors.forEach((obj) => obj.render(this.renderingTarget));
	}

	_addDestroyedActors(actor) {
		this._destroyedActors.push(actor);
	}

	_disposeDestroyedActors() {
		this.desstoyedActors.forEach((actor) => this.remove(actor));
	}
}

class GameInfo {
	constructor(title,screenRectangle,maxFps,currentFps) {
		this.title = title;
		this.screenRectangle = screenRectangle;
		this.maxFps = maxFps;
		this.currentFps = currentFps;

		this.screenCanvas = document.createElement('canvas');
		this.screenCanvas.width = width;
		this.screenCanvas.height = height;

		this._inputReceiver = new InputReceiver();
		this._prevTimestamp = 0;

		console.log('${title}が初期化されました。');
	}

	changeScene(newScene) {
		
	}


}
