<?php
class SfBrowser {
	private $aResponse = array('success'=>false);

	public function __construct() {
		require 'Slim/Slim.php';
		\Slim\Slim::registerAutoloader();

		//
		define('ROOTFOLDER',realpath('C:\xampp\htdocs\sfbrowser\dist\data'));
		//

		$app = new \Slim\Slim(array(
			'debug' => true
		));
		$app->get('.', function() {
			echo "Hello there.";
		});
		//
		// json reponse like http://labs.omniti.com/labs/jsend
		//
		$app->post('/list/:folder', function($folder) {
			$sDir = urldecode($folder);
			$bIsRoot = realpath($sDir)==ROOTFOLDER;
			if ($this->notError($this->withinRoot($sDir),"Invalid path: '$sDir' not in root folder")) {
				$aFiles = array();
				if ($handle = opendir($sDir)) while (false !== ($file = readdir($handle))) {
					$oFNfo = $this->fileInfo($sDir.'/'.$file);
					if ($oFNfo&&$file!='.'&&!($bIsRoot&&$file=='..')){
						$aFiles[] = $oFNfo;
					}
				}
				$this->aResponse['success'] = true;
				$this->aResponse['data'] = $aFiles;
			}
			echo json_encode($this->aResponse);
		});

		$app->post('/delete/:file', function($file) {
			$sFile = urldecode($file);
			if (
				$this->notError($this->withinRoot($sFile),"Invalid path: '$sFile' not in root folder")
				&&$this->notError(file_exists($sFile),"The file '$file' does not exist")
				&&$this->notError(unlink($sFile),"The file '$file' could not be deleted")
			) {
				$this->aResponse['success'] = true;
				$this->aResponse['data'] = $sFile;
			}
			echo json_encode($this->aResponse);
		});

		$app->post('/rename/:file/:to', function($file,$to) {
			$sFile = urldecode($file);
			$sFileTo = urldecode($to);
			if (
				$this->notError($this->withinRoot($sFile),"Invalid path: '$sFile' not in root folder")
				// todo: check $sFileTo is within root
				&&$this->notError(file_exists($sFile),"The file '$file' does not exist")
				&&$this->notError(rename($sFile,$sFileTo),"The file '$file' could not be renamed")
			) {
				$this->aResponse['success'] = true;
				$this->aResponse['data'] = $sFile.' => '.$sFileTo;
			}
			echo json_encode($this->aResponse);
		});

		$app->post('/move/:target/:current/:files', function($target,$current,$files) {
			$sTarget = urldecode($target);
			$sCurrent = urldecode($current);
			$aFiles = explode(',',urldecode($files));
			if (
				$this->notError($this->withinRoot($sTarget),"Invalid path: '$sTarget' not in root folder")
				&&$this->notError($this->withinRoot($sCurrent),"Invalid path: '$sCurrent' not in root folder")
			){
				foreach ($aFiles as $file) {
					$sCurrentFile = $sCurrent.'/'.$file;
					$sToFile = $sTarget.'/'.$file;
					if (
						$this->notError(file_exists($sCurrentFile),"The file '$file' does not exist")
						&&$this->notError(rename($sCurrentFile,$sToFile),"The file '$file' could not be moved")
					) {
						$this->aResponse['success'] = true;
					}
				}
			}
			echo json_encode($this->aResponse);
		});

/*		$app->post('/upload/:folder', function($folder) {
			$sFolder = urldecode($folder);
			//
			$this->aResponse['data'] = $sFolder;
			$this->aResponse['numFiles'] = count($_FILES);
			$this->aResponse['issetFiles'] = isset($_FILES);
//			print_r($_FILES);
//			if (
//				$this->notError($this->withinRoot($sFile),"Invalid path: '$sFile' not in root folder")
//				// todo: check $sFileTo is within root
//				&&$this->notError(file_exists($sFile),"The file '$file' does not exist")
//				&&$this->notError(rename($sFile,$sFileTo),"The file '$file' could not be renamed")
//			) {
//				$this->aResponse['success'] = true;
//				$this->aResponse['data'] = $sFile.' => '.$sFileTo;
//			}
			echo json_encode($this->aResponse);
		});*/

		$app->post('/upload', function() {
//			$this->aResponse['numFiles'] = count($_FILES);
//			$this->aResponse['post'] = print_r($_POST,true);
			$aFiles = array();
			$bUploaded = true;

			if ( $_SERVER['REQUEST_METHOD']=='POST'&&empty($_POST)&&empty($_FILES)&&$_SERVER['CONTENT_LENGTH']>0) {
				$displayMaxSize = ini_get('post_max_size');
				switch (substr($displayMaxSize,-1)) {
					case 'G': $displayMaxSize = $displayMaxSize*1024;
					case 'M': $displayMaxSize = $displayMaxSize*1024;
					case 'K': $displayMaxSize = $displayMaxSize*1024;
				}
				$bUploaded = false;
				$this->aResponse['error'] = 'Posted data is too large';
				//$error = 'Posted data is too large. '.$_SERVER[CONTENT_LENGTH].' bytes exceeds the maximum size of '.$displayMaxSize.' bytes.';
			} else {
				$sFolder = urldecode($_POST['folder']);
				foreach ($_FILES as $file) {
					$sTarget = ROOTFOLDER.'/'.$sFolder.'/'.$file['name'];
					if (move_uploaded_file($file['tmp_name'],$sTarget)) {
						$oFNfo = $this->fileInfo($sTarget);
						if ($oFNfo){
							$aFiles[] = $oFNfo;
						}
					} else {
						$bUploaded = false;
					}
				}
			}

			if ($bUploaded) {
				$this->aResponse['success'] = true;
			}
			$this->aResponse['data'] = $aFiles;
			echo json_encode($this->aResponse);
		});

		$app->post('/newfolder/:folder', function($folder) {
			$sFolder = urldecode($folder);
			$sName = 'NewFolder'.rand(0,9999);
			$sTarget = $sFolder.'/'.$sName;
			if (
				$this->notError($this->withinRoot($sFolder),"Invalid path: '$sFolder' not in root folder")
				// todo: check $sFileTo is within root
				&&$this->notError(mkdir($sTarget),"The folder '$sName' could not be created")
			) {
				$this->aResponse['success'] = true;
				$this->aResponse['data'] = $this->fileInfo($sTarget);
			}
			echo json_encode($this->aResponse);
		});

		$app->run();
	}

	private function notError($check,$message){
		if (!$check) $this->aResponse['error'] = $message;
		return $check;
	}

	private function withinRoot($path){
		return strpos(realpath($path),ROOTFOLDER)!==false;
	}

	private function fileInfo($sFile) {
		$aRtr = array();
		$aRtr['name'] = basename($sFile);
		$aRtr['size'] = filesize($sFile);
		$aRtr['time'] = filemtime($sFile);
		$aRtr['type'] = filetype($sFile);
		$bFile = $aRtr['type']=='file';
		$aRtr['ext'] = $bFile?substr(strrchr($sFile, '.'), 1):'';
		if ($bFile) {
			$aRtr['mime'] = substr(strrchr($sFile, '.'), 1);
			if (array_search($aRtr['ext'],array('jpg','jpeg','gif','png'))) {
				$aImgNfo = @getimagesize($sFile);
				if (is_array($aImgNfo)) {
					list($width, $height, $type, $attr) = $aImgNfo;
					$aRtr['width'] = $width;
					$aRtr['height'] = $height;
				}
			}
		}
		return $aRtr;
	}
}
new SfBrowser();


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
		//	function fileInfo($sFile) {
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