$('#m').val('');

var args = {'a' : 'comments', 'c' : 20, 's' : 0};
bind_infinite(args, function(data) {
	var converter = new Showdown.converter();
	
	for (i in data) {
		var c = data[i];
		
		if (parseInt(c['comment_id']) > 491) {
			c['comment_body'] = c['comment_body'].replace(/</g, '&lt;');
			c['comment_body'] = converter.makeHtml(c['comment_body']);
		}

		$('#comments').append('<table style="width: 700px"><tr><td class="post">' + format_date(c['comment_time']) + ' - No. ' + c['comment_id'] + '<blockquote style="max-width: 600px; overflow: auto;">' + c['comment_body'] + '</blockquote></td></tr></table>');
	}
	
	args['s'] += args['c'];
	return args;
}, true);

$('#cfrm').submit(function() {
	data = {
		'a' : 'comments',
		'm' : $('#m').val()
	};

	$('#cfrm').hide();

	$.getJSON('api', data, function(data, _) {
		window.location.reload();
	});

	return false;
});
