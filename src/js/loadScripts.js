/**
 * Load javascript file
 * @method
 * @param {Array|String} srcList The source location of the file.
 * @param {Boolean} sequential Load sequential or simultaneaously.
 * @return {Object} promise
 */
function loadScripts(srcList,sequential) {
	if (!Array.isArray(srcList)) srcList = [srcList];
	var iNumToLoad = srcList.length
		,aFullfilled = []
		,aUnfullfilled = []
		,aProgress = []
	;
	if (sequential) {
		loadScript(srcList.shift());
	} else {
		srcList.forEach(loadScript);
	}
	function loadScript(src){
		var sExtension = src.split('.').pop()
			,sElementType = {js:'script',css:'link'}[sExtension]
			,sAttribute = {js:'src',css:'href'}[sExtension]
			,mElement = document.createElement(sElementType);
		mElement.setAttribute(sAttribute,src);
		if (sExtension==='css') {
			mElement.setAttribute('type','text/css');
			mElement.setAttribute('media','screen');
			mElement.setAttribute('rel','stylesheet');
		}
		mElement.addEventListener('load',handleSrcLoaded);
		mElement.addEventListener('error',handleSrcError);
		(document.head || document.getElementsByTagName('head')[0]).appendChild(mElement);
	}
	function handleSrcLoaded(){
		iNumToLoad--;
		if (iNumToLoad===0) {
			aFullfilled.forEach(function(fn){
				fn.call();
			});
		} else if (sequential) {
			loadScript(srcList.shift());
		}
	}
	function handleSrcError(){
		aUnfullfilled.forEach(function(fn){
			fn.call();
		});
	}
	return {
		then: function(fullfilled,unfullfilled,progress){
			aFullfilled.push(fullfilled);
			aUnfullfilled.push(unfullfilled);
			aProgress.push(progress);
		}
	};
}