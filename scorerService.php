<?php
    header('Content-Type: application/json');

    	$aResult = array();
	$params = $_POST['arguments'];
	
    	if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }
   	if( !isset($_POST['arguments']) ) { $aResult['error'] = 'No function arguments!'; }
    	if( !isset($aResult['error']) ) {
        switch($_POST['functionname']) {
			case 'writeData':
				$idGame = $_POST['idgame'];
				writeJsonFile($params,$idGame);
				echo json_encode('1');
          	break;
			case 'getGameData':
				$obj = getDataGame($params);
				echo json_encode($obj);
			break;
			case 'matchWin':
				$id = $params;
				onMatchWin($id);
				echo json_encode('1');
			break;
			case 'getMostRecentMatch':
				$max = ['path' => null, 'timestamp' => 0];
				$lastfile;
				foreach (scandir('CurrentMatches', SCANDIR_SORT_NONE) as $file) {
					$path = 'CurrentMatches/' . $file;	
					if (!is_file($path)) {
						continue;
					}	  
					$timestamp = filemtime($path);
					
					if ($timestamp > $max['timestamp']) {
					    $max['path'] = $path;
					    $max['timestamp'] = $timestamp;
					    $lastfile = $file;
					}
				}
				
				$pathInfo = pathinfo($lastfile);
				$dataGame = getDataGame($pathInfo['filename']);
				echo json_encode($dataGame);
			break;
			case 'getMostRecentMatchArchive':
				$max = ['path' => null, 'timestamp' => 0];
				$lastfile;
				foreach (scandir('ArchivesMatches', SCANDIR_SORT_NONE) as $file) {
					$path = 'ArchivesMatches/' . $file;	
					if (!is_file($path)) {
						continue;
					}	  
					$timestamp = filemtime($path);
					
					if ($timestamp > $max['timestamp']) {
					    $max['path'] = $path;
					    $max['timestamp'] = $timestamp;
					    $lastfile = $file;
					}
				}
				$pathInfo = pathinfo($lastfile);
				$dataGame = getDataGameArchive($pathInfo['filename']);
				echo json_encode($dataGame);
			break;
			case 'getAllCurrentMatch':
				$lstFileMatch = scandir ("CurrentMatches");
				$i = 0;
				foreach($lstFileMatch as $fileMatch){
					if (!in_array($fileMatch,array(".",".."))){
						$pathInfo = pathinfo($fileMatch);
						$dataGame = getDataGame($pathInfo['filename']);
						$arrayCurrentGames[$i] = $dataGame;
						$i++;
					}
				}
				echo json_encode($arrayCurrentGames);
			break;
            default:
               $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
               break;
        }

    };
    
    	function onMatchWin($id){
		$id = substr($id,1,-1);
		$path = "CurrentMatches/$id.xml";
		if (file_exists($path)){
			//copy
			//copy( $path , "ArchivesMatches/".$id.".xml");
			//$res = unlink($path);
			//error_log("res: $res");

			rename($path,"ArchivesMatches/$id.xml");
			$file = $path;
			$absolute_path = realpath($file);
			sleep(5);
			if (!unlink($absolute_path)) {
				error_log ("Error deleting $absolute_path");
			} else {
				error_log ("Deleted $absolute_path");
			}
		}
	}


    	function writeJsonFile($dataSource, $idGame){
		//Sauvegarde du document
		//error_log(print_r($dataXML,true));
		file_put_contents("CurrentMatches/".$idGame.".xml"
					,$dataSource);
		//,$dataXML->asXML());
		
    }

    function getDataGame($idGame){
		if (file_exists("CurrentMatches/".$idGame.".xml")) {
			$jsonGame = file_get_contents ("CurrentMatches/".$idGame.".xml");
		} else {
			exit('Echec lors de l\'ouverture du fichier test.xml.');
		}
		return $jsonGame;
    }

    function getDataGameArchive($idGame){
	if (file_exists("ArchivesMatches/".$idGame.".xml")) {
		$jsonGame = file_get_contents ("ArchivesMatches/".$idGame.".xml");
	} else {
		exit('Echec lors de l\'ouverture du fichier test.xml.');
	}
	return $jsonGame;
}

 
 

?>
