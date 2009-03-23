$('#loading').appendTo('#main');

var args = get_params();
args['a'] = 'random';

bind_infinite(args, function(data) {
	dump_images(data, $('#content'));
	return args;
}, true);
