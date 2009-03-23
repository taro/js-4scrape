$.getJSON(get_api_url('popular'), function(data, _) {
	for (var i in data) {
		var img = data[i];
		$('#content').append('<table class="popular"><tr><td><h3>#' + (parseInt(i) + 1) + '</h3> (<a href="image?i=' + img['img_id'] + '&nup=1">image #' + img['img_id'] + '</a>)<br/><a href="' + image_base + img['img_path'] + '"><img src="' + image_base + img['img_thumb'] + '"/></a><table width="100%"><tr><td><small><b>Views</b>: ' + img['img_hits'] + '<br/><b>Ever</b>: ' + img['img_hits_total'] + '</small></td><td><small><b>Resolution</b>: <a href="random?w=' + img['img_w'] + '&h=' + img['img_h'] + '&ws=2">' + img['img_w'] + 'x' + img['img_h'] + '</a><br/><b>Aspect Ratio</b>: <a href="random?as=' + img['img_aspect'] + '&ws=2">' + img['img_aspect'] + '</a></small></td></tr></table>');
	}
});
