function show_dialog(img) {
	var width = document.body.clientWidth * 0.8;
	if (width > 800) width = 800;
	var height = width / parseFloat(img['img_aspect']);

	$('#error')
		.empty()
		.html('<a href="' + img['img_path'] + '"><img src="' + img['img_thumb'].replace('thumb', 'preview') + '" width="100%"/></a>')
		.dialog({
			'buttons' : {
				'Details' : function() {
					document.location = "image?i=" + img['img_id'];
				},
				'Unfavorite' : function() {
					with_auth('api', {
						'a' : 'unfav',
						'f' : img['fav_id']
					}, function(data) {
						document.location = "fav";
					});
				},
				'Close' : function() {
					$(this).dialog('close');
					$(this).dialog('destroy');
				}
			},
			'draggable' : false,
			'resizable' : false,
			'position' : 'top',
			'title' : 'Image #' + img['img_id'],
			'dialogClass' : 'dialog-fav',
			'modal' : true,
			'width' : width,
			'height' : height
		})
		.show()
		;
}

with_auth('api', {'a' : 'favlist'}, function(imgs) {
	if (imgs.length > 0) {
		dump_images(imgs, $('#favs'));

		var imgid_to_img = {};
		for (var i in imgs) {
			var img = imgs[i];
			imgid_to_img[img['img_id']] = img;
		}

		$('a.img').each(function() {
			var img_id = parseInt($(this).attr('id'));

			$(this).click(function() {
				show_dialog(imgid_to_img[img_id]);
				return false;
			});
		});
	}
	else
		$('#help').show();
});
