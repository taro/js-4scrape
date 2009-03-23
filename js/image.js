$('#metadata, #posts').hide();

$.getJSON(get_api_url('image'), function(img, _) {
	$('div.image_num').append(img['img_id']);
	$('div.img_w').append(img['img_w']);
	$('div.img_h').append(img['img_h']);
	$('div.img_as').append(img['img_aspect']);
	$('div.img_path').append(img['img_path']);
	//$('div.img_full').append('<a href="' + image_base + img['img_path'] + '"><img src="' + image_base + img['img_path'] + '" width="90%" style="max-width: 800px"/></a>' );

	if (img['mirror'] && img['img_nsfw'] == 0) {
		var full_image_base = img['mirror'] + '?i=';
	}
	else if (Math.floor(Math.random() * 40) == 32) {
		var full_image_base = 'http://desudesudesu.org/meimei.php?i=';
	}
	else
		var full_image_base = 'img/';

	img['img_path'] = img['img_path'].substring(4);

	if (is_iphone())
		img['img_preview'] = img['img_thumb'].substring(4)
	else
		img['img_preview'] = img['img_thumb'].substring(4).replace('thumb', 'preview');

	$('div.img_full').append('<a href="' + full_image_base + img['img_path'] + '"><img src="' + full_image_base + img['img_preview'] + '""/></a>' );

	if (is_iphone()) {
		$('div.img_thumb > a > img').attr('align', '');
		$('div.ads').hide();
	}

	var ws_sketchy = '<a id="btn_sketchy" href="#">Sketchy?</a> ';
	var ws_nsfw = '<a id="btn_nsfw" href="#">NSFW?</a>'

	$('div.img_nsfw').append({
		'0' : '<span class="ws_0">Worksafe.</span> ' + ws_sketchy + ws_nsfw,
		'1' : '<span class="ws_1">Sketchy.</span> ' + ws_nsfw,
		'2' : '<span class="ws_2">Yes!</span>'
	}[img['img_nsfw']]);

	$('div.img_hits_total').append(parseInt(img['img_hits_total']) + 1);
	$('div.img_hits').append(parseInt(img['img_hits']) + 1);
	$('div.img_search').append('<a href="http://iqdb.hanyuu.net/?url=' + image_base + 'preview/' + img['img_hash'] + '.">Similar images via IQDB</a>' );

	//dump_posts(data[1], $('#posts'), false);

	// relocate the loading box
	$('#loading').appendTo('.img_thumb');

	$('#btn_iqdb').one('click', function() {
		location.href = 'http://iqdb.hanyuu.net/?url=' + image_base + 'preview/' + img['img_hash'] + '.';
	});

	$('#btn_posts').removeAttr('disabled');
	$('#btn_posts').one('click', function() {
		$(this).attr('disabled', 'true');
		$.getJSON(get_api_url('image_posts'), function (posts) {
			dump_posts(posts, $('#posts'), false);
		});
	});

	$('#btn_threads').removeAttr('disabled');
	$('#btn_threads').one('click', function() {
		$(this).attr('disabled', 'true');
		var args = get_params();
		args['a'] = 'image_images';
		args['p'] = 0;
		bind_infinite(args, function(images) {
			dump_images(images, $('#images'));
			if (images.length < 1000) return null;
			args['p'] = parseInt(args['p']) + 1000;
			return args;
		}, true);
	});

	$('#btn_sketchy').click(function() {
		$('#error')
			.empty()
			.html('<p>You\'re about to mark this image as "sketchy". For the purposes of 4scrape, this is a loosely defined term which generally means "would not want your boss to walk in on you while viewing." Unlike the NSFW level (which requires tits), this is a more general all-encompasing category for lewd but not nude images.</p><br/>')
			.dialog({
				'buttons' : {
					'I creamed myself!!!' : function() {
						$.getJSON('api', {'a' : 'nsfw', 'ws' : '1', 'i' : img['img_id']}, function(data) {
							$('div.img_nsfw').empty().append('<span class="ws_1">Sketchy.</span>');
						});
						$(this).dialog('close');
					},
					'Nevermind' : function() {
						$(this).dialog('close');
					}
				},
				'draggable' : false,
				'resizable' : false,
				'position' : 'center',
				'title' : 'Mark Sketchy?',
				'dialogClass' : ''
			})
			.show()
			;
		return false;
	});

	$('#btn_nsfw').click(function() {
		$('#error')
			.empty()
			.html('<p>You\'re about to mark this image as NSFW. For the purposes of 4scrape, this currently means "shows nudity", as in bared breasts or gentalia. Please make sure that the image conforms to these standards before flagging it as such.</p><br/><br/><br/>')
			.dialog({
				'buttons' : {
					'Yes there are tits I saw them' : function() {
						$.getJSON('api', {'a' : 'nsfw', 'ws' : '2', 'i' : img['img_id']}, function(data) {
							$('div.img_nsfw').empty().append('<span class="ws_2">Yes!</span>');
						});
						$(this).dialog('close');
					},
					'Uhh, let me check again...' : function() {
						$(this).dialog('close');
					}
				},
				'draggable' : false,
				'resizable' : false,
				'position' : 'center',
				'title' : 'Mark NSFW?',
				'dialogClass' : ''
			})
			.show()
			;
		return false;
	});

	$('#btn_fav').click(function() {
		with_auth('api', {'a' : 'fav', 'i' : img['img_id']}, function(ret) {
			if (ret != 'ok') {
				alert('Unable to favorite image: ' + ret);
			}
			else {
				document.location.replace('fav');
			}
		});
	});

	$('#metadata, #posts').show();
});
