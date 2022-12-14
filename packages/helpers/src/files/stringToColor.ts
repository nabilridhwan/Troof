// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript

const stringToColor = function (str: string) {
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	var col = "#";
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xff;
		col += ("00" + value.toString(16)).substr(-2);
	}
	return col;
};

export default stringToColor;
