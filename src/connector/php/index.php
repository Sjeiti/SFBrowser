<?php
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

//
define('ROOTFOLDER','C:\xampp\htdocs\sfbrowser\dist\data');
//

$app = new \Slim\Slim();
$app->get('.', function() {
    echo "Hello there.";
});
//
// json reponse like http://labs.omniti.com/labs/jsend
//
$app->post('/list/:folder', function($folder) {
	$sDir = urldecode($folder);
	$sRealDir = realpath($sDir);
	$aResponse = array('success'=>false);
	if (strpos($sRealDir,ROOTFOLDER)===false) {
		$aResponse['error'] = 'invalid path: \''.$sDir.'\' not in \''.ROOTFOLDER.'';
	} else {
		$aFiles = array();
		if ($handle = opendir($sDir)) while (false !== ($file = readdir($handle))) {
			$oFNfo = fileInfo($sDir.'/'.$file);
			if ($oFNfo) $aFiles[] = $oFNfo;
		}
		$aResponse['success'] = true;
		$aResponse['data'] = $aFiles;
	}
	echo json_encode($aResponse);
});

function fileInfo($sFile) {
	$aRtr = array();
	$aRtr["name"] = basename($sFile);
	$aRtr["size"] = filesize($sFile);
	$aRtr["time"] = filemtime($sFile);
	$aRtr["type"] = filetype($sFile);
	$bFile = $aRtr["type"]=='file';
	$aRtr["ext"] = $bFile?substr(strrchr($sFile, '.'), 1):'';
	if ($bFile) {
		$aRtr["mime"] = substr(strrchr($sFile, '.'), 1);
		if (array_search($aRtr["ext"],array('jpg','jpeg','gif','png'))) {
			$aImgNfo = @getimagesize($sFile);
			if (is_array($aImgNfo)) {
				list($width, $height, $type, $attr) = $aImgNfo;
				$aRtr["width"] = $width;
				$aRtr["height"] = $height;
			}
		}
	}
	return $aRtr;
}

//function get_mime_type($filename, $mimePath = '../etc') {
//   $fileext = substr(strrchr($filename, '.'), 1);
//   if (empty($fileext)) return (false);
//   $regex = "/^([\w\+\-\.\/]+)\s+(\w+\s)*($fileext\s)/i";
//   $lines = file("$mimePath/mime.types");
//   foreach($lines as $line) {
//      if (substr($line, 0, 1) == '#') continue; // skip comments
//      $line = rtrim($line) . " ";
//      if (!preg_match($regex, $line, $matches)) continue; // no match to the extension
//      return ($matches[1]);
//   }
//   return (false); // no match at all
//}
//	function fileInfo($sFile) { // todo: check wp_ext2type
//		$aRtr = array();
//		$aRtr["type"] = filetype($sFile);
//		$sFileName = array_pop(preg_split("/\//",$sFile));
////		if ($aRtr["type"]=="file") {
////			$aRtr["time"] = filemtime($sFile);
//////			$aRtr["date"] = date(FILETIME,$aRtr["time"]);
////			$aRtr["size"] = filesize($sFile);
////			$aRtr["mime"] = array_pop(preg_split("/\./",$sFile));//mime_content_type($sFile);
////			//
////			$aRtr["width"] = 0;
////			$aRtr["height"] = 0;
//////			$aImgNfo = ($aRtr["mime"]=="jpeg"||$aRtr["mime"]=="jpg"||$aRtr["mime"]=="gif"||$aRtr["mime"]=="png") ? @getimagesize($sFile) : "";
//////			if (is_array($aImgNfo)) {
//////				list($width, $height, $type, $attr) = $aImgNfo;
//////				$aRtr["width"] = $width;
//////				$aRtr["height"] = $height;
//////			}
////			$aRtr["file"] = $sFileName;
////			$aRtr["rsize"] = filesize($sFile);
////			$aRtr["size"] = filesize($sFile);//$this->formatSize($aRtr["rsize"]);
////		} else if ($aRtr["type"]=="dir"&&$sFileName!="."&&$sFileName!=".."&&!preg_match("/^\./",$sFileName)) {
////			$aRtr["mime"] = "folder";
////			$aRtr["time"] = filemtime($sFile);
//////			$aRtr["date"] = date(FILETIME,$aRtr["time"]);
////			$aRtr["size"] = filesize($sFile);
////			$aRtr["rsize"] = 0;
////			$aRtr["size"] = '-';
////			$aRtr["file"] = $sFileName;
////		}
////		$aDeny = explode(",",SFB_DENY);
////		if (!isset($aRtr["mime"])||in_array($aRtr["mime"],$aDeny)) return null;
//		return $aRtr;
//	}

//    echo json_encode(array($_POST['folder']));
//	$sDir = $this->sConnBse.(isset($_POST["folder"])?$_POST["folder"]:"data/");
//	$aFiles = array();
//	if ($handle = opendir($sDir)) while (false !== ($file = readdir($handle))) {
//		$oFNfo = $this->fileInfo($sDir.$file);
//		if ($oFNfo) $aFiles[] = $oFNfo;
//	}
//	$this->aReturn['msg'] .= "fileListing";
//	$this->aReturn['data'] = $aFiles;
$app->run();