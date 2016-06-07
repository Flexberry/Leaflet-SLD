/// Функция получения файла, выбранного в файловом контроле.
/// Выходные данные: файл SLD.
function getFile()
{
	var file = document.getElementById("openFile").files[0];
	if(file) return file;
	else alert("Select a file!");
}

/// Функция, применяющая SLD-стиль из заданного SLD-файла к выбранному слою Leaflet.
/// Входные параметры: Слой Leaflet и SLD-файл.
function setSldStyleToLeaflet(leafletLayer, sldFile)
{
	var text = getText(sldFile)
	leafletLayer.eachLayer(function (layer) {
		layer.setStyle(getSldStyle(text));
	});
}
	
/// Функция получения текста из выбранного файла.
/// Входные параметры: выбранный файл.
/// Выходные данные: текст.
function getText(file)
{
	var fr = new FileReader();
	fr.readAsText(file);
	alert(file.name);
	var text = fr.result;
	return text;
}

/// Функция получения атрибутов класса Path(стили Leaflet).
/// Входные параметры: текст SLD-файла.
/// Выходные данные: атрибуты Path.
function getSldStyle(text)
{
	var style = {};
	// Атрибуты класса Path Leaflet.
	var pathParams = [
		//"stroke",
		"color",
		"weight",
		"opacity",
		//"fill",
		"fillColor",
		"fillOpacity"/*,
		"fillRule",
		"dashArray",
		"lineCap",
		"lineJoin"*/
	];
	pathParams.forEach(function(item, i, arr){
		var tmp = getSldNameAndDefaultValue(item, dictionarySldToLeaflet);
		style[item] = getValue(text, tmp);
	});
	return style;
}
	
/// Функция, возвращающая название SLD-параметра, соответствующего атрибуту класса Path, и его значение по умолчанию.
/// Входные параметры: название атрибута Path и словарь соответствия.
/// Выходные данные: название SLD-параметра, соответствующего атрибуту класса Path, и его значение по умолчанию.
function getSldNameAndDefaultValue(leafletName, dictionary)
{
	var sldNameAndDefaultValue = {
		"sldName": dictionary[leafletName].sldName,
		"defaultValue": dictionary[leafletName].defaultValue
	};
	return sldNameAndDefaultValue;
}

/// Функция выбора значения одного из параметров.
/// Входные параметры: текст SLD-файла, название желаемого SLD-параметра и его значение по умолчанию.
/// Выходные данные: значение SLD-параметра из текста при его наличии или значение по умолчанию при его отсутствии.
function getValue(text, sldNameAndDefaultValue)
{
	var regexp = "<se:SvgParameter name=\"" + sldNameAndDefaultValue.sldName + "\">(.*?)<\/se:SvgParameter>";
	if (text.match(regexp)) return text.match(regexp)[0].replace(/<[^>]+>/g,'');
	else return sldNameAndDefaultValue.defaultValue;
}
