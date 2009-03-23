with_auth('api', {'a' : 'favlist'}, function(imgs) {
	if (imgs.length > 0)
		dump_images(imgs, $('#favs'));
	else
		$('#help').show();
});
