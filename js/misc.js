var image_base = 'http://suigintou.desudesudesu.org/4scrape/';

var loading_imgs = [
	'suigintou-blink.gif',
	'suigintou-walk.gif',
	'suigintou-laugh.gif'
];

$('#nojs').hide().empty();

$.ajaxSetup({
	timeout : 15000 // ms
});

$('#loading').ajaxStart(function() {
	// kawaii desu ne~~~~
	var img = loading_imgs[Math.floor(Math.random() * loading_imgs.length)];
	$(this).empty().append('<br/><img src="' + img + '" style="border: 0px"/><br/>Loading...').show();
});

$('#loading').ajaxSend(function(evt, request, settings) {
	if (get_param('debug') == '1') {
		var url = settings.url.split('/');
		url = url[url.length - 1];
		url = url.split('?')[0];
		$(this).append("Fetching " + url + "...");
	}
});

$('#loading').ajaxSuccess(function(evt, request, settings) {
	if (get_param('debug') == '1') {
		$(this).append(" ok<br/>");
	}
});

$('#loading').ajaxError(function(evt, request, settings) {
	$('#error')
		.html('<p>An error occured while loading data. My error handling stuff is currently pretty trashy, so you\'ll have to refresh the page manually to unbreak it. If it doesn\'t unbreak, the FCGI backend might be down or something -- there\'s at least one quirk left with this setup :(</p><br/>')
		.dialog({
			'buttons' : {
				'Okay' : function() {
					$(this).dialog('close');
				}
			},
			'autoOpen' : true,
			'draggable' : false,
			'resizable' : false,
			'position' : 'center',
			'title' : 'Junku Broke ;_;',
			'dialogClass' : ''
		})
		;
});

$('#loading').ajaxStop(function() {
	$(this).empty();
});

function dump_images(imgs, elem) {
	for (i in imgs) {
		var img = imgs[i];
		if (img['img_thumb'] == '') continue;
		var t_ratio = 300.0 / Math.max(img['img_w'], img['img_h']);
		var t_w = img['img_w'] * t_ratio;
		var t_h = img['img_h'] * t_ratio;

		$(elem).append('<a href="image?i=' + img['img_id'] + '"><img src="' + image_base + img['img_thumb'] + '" width="' + t_w + '" height="' + t_h + '" title="' + img['img_w'] + 'x' + img['img_h'] + '"/></a> ' );
	}
}

function format_date(ts) {
	return (new Date(parseInt(ts) * 1000)).toLocaleString();
}

function is_iphone() {
	return navigator.userAgent.match(/iphone/i);
}

function dump_posts(posts, elem, imgs) {
	var iphone = is_iphone();

	for (i in posts) {
		var post = posts[i];
		var html = '<tr><td class="post"><a href="thread?b=' + post['board_id'] + '&t=' + post['thread_id'] + '">/' + post['board_sname'] + '/' + post['thread_id'] + '</a> : <a href="mailto:' + post['post_email'] + '"><span class="post_name">' + post['post_name'] + '</span></a> <span class="post_subject">' + post['post_subject'] + '</span> <span class="post_date">' + format_date(post['post_date']) + '</span>, <a name="' + post['post_no'] + '" class="clean">No.</a> <a href="thread?t=' + post['thread_id'] + '#' + post['post_no'] + '"><span class="post_no">' + post['post_no'] + '</span></a>';

		if (post['img_id'] > 0) {
			if (post['post_origimg'] == "")
				post['post_origimg'] = "(missing)";

			html += '<br/><small>Filename: <a href="' + post['img_path'] + '">' + post['post_origimg'] + '</a></small>';

			if (imgs) {
				html += '<small> (' + post['img_w'] + 'x' + post['img_h'] + ', ' + post['img_aspect'] + ')</small>';
				
				if (iphone)
					html += '<br/>';
					
				html += '<a href="image?i=' + post['img_id'] + '"><img src="' + image_base + post['img_thumb'] + '"';

				if (!iphone)
					html += ' align="left"';

				html += '/></a>';
			}
		}

		html += '<blockquote><span class="post_comment">' + post['post_comment'] + '</span></blockquote></td></tr>';

		elem.append(html);
	}
}

function get_api_url(action) {
	var url = $(document).attr('location').search;
	if (url) url += "&a=" + action;
	else url = "?a=" + action;
	return "api" + url;
}

function get_param(name, otherwise) {
	var query = $(document).attr('location').search;
	if (!query) return otherwise;
	var params = query.substring(1, query.length).split('&');

	for (var i in params) {
		if (params[i].substring(0, name.length) == name)
			return unescape(params[i].split('=')[1]).replace(/\+/g, ' ');
	}

	return otherwise;
}

function get_params() {
	var query = $(document).attr('location').search;
	if (!query) return {};
	var params = query.substring(1, query.length).split('&');
	var ret = {};

	for (var i in params) {
		var param = params[i].split('=');
		ret[param[0]] = param[1];
	}

	return ret;
}

function get_param_string(except) {
	var query = $(document).attr('location').search;
	if (!query) return "";
	var params = query.substring(1, query.length).split('&');

	var ret = "";

	for (var i in params) {
		if (params[i].substring(0, except.length) != except)
			ret += params[i] + "&";
	}

	return ret;
}

function unbind_infinite() {
	$(window).unbind('scroll');
}

function bind_infinite(args, f, call) {
	var threshold = 800;

	if (is_iphone())
		threshold = 1500;

	$(window).scroll(function() {
		if ($(window).scrollTop() >= $(document).height() - $(window).height() - threshold) {
			unbind_infinite();			
			load_infinite(f, args, function(new_args) {
				bind_infinite(new_args, f);
			});
		}
	});

	if (call == true) 
		$(window).scroll();
}

function load_infinite(f, args, cb) {
	$.getJSON('api', args, function(data) {
		var new_args = f(data);

		if (new_args == null)
			return;
		
		cb(new_args);
	});
}

function with_auth(url, args, f) {
	var AUTH_COOKIE = '4scrape-auth';

	if ($.cookie(AUTH_COOKIE)) {
		args['auth'] = $.cookie(AUTH_COOKIE);
		$.getJSON(url, args, function(data) {
			if (data == 'invalid auth') {
				$.cookie(AUTH_COOKIE, null);
				return with_auth(url, args, f);
			}
			else {
				return f(data);
			}
		});

		/* Don't display login box */
		return;
	}

	/* Need to display a login box to get the secret, then
	 * resolve the secret to an auth_id and do the rest */
	$('#login')
		.empty()
		.html('<p>Please enter your secret identifier<br/><form id="login_form"><input type="text" id="secret"/> <input type="submit" value="Login"/></form></p>')
		.dialog({
			'buttons' : {},
			'draggable' : false,
			'resizable' : false,
			'position' : 'center',
			'title' : 'Login',
			'dialogClass' : ''
		})
		;
	$('#login_form').submit(function() {
		var secret = $('#secret').val();
			$('#login').dialog('destroy');
		$.getJSON('api', {'a' : 'login', 'secret' : secret}, function(auth_id) {
			$.cookie(AUTH_COOKIE, auth_id, {'expires' : 9001});
			return with_auth(url, args, f);
		});
		return false;
	});
}
