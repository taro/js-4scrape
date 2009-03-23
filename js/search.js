$('#loading').appendTo('#main');

var args = get_params();
args['a'] = 'search';
if (!args['p']) args['p'] = 0; else args['p'] = parseInt(args['p']);
if (!args['c']) args['c'] = 20; else args['c'] = parseInt(args['c']);
if (args['q']) args['q'] = args['q'].replace(/\+/g, ' ');

var query = $(document).attr('location').search;
if (query) {
	var rss_feed = 'http://suigintou.desudesudesu.org/4scrape/api?a=search&fmt=rss&' + query.substring(1, query.length);
	$('#rss').append('-- <a href="' + rss_feed + '">RSS Feed</a>');
}

function insert_links(fr, lr, nr, rpp) {
	var params = get_param_string('p');
	$('#content').append('<br/>');

	if (fr > 0)
		$('#content').append('<span class="prev_link"><a href="search?' + params + 'p=' + (fr - rpp) + '">&lt;&lt;&lt; prev</a></span> ');

	$('#content').append('[ Viewing <a href="search?' + params + 'p=' + fr + '"><span class="firstresult">' + (fr + 1) + '</span> to <span class="last_result">' + lr + '</span></a> of ' + nr + ' ]');

	if (lr < nr)
		$('#content').append(' <span class="next_link"><a href="search?' + params + 'p=' + lr + '">next &gt;&gt;&gt;</a></span>');

	$('#content').append('<br/>');
}

bind_infinite(args, function(data) {
	var num_results = parseInt(data[0]);
	$('.num_results').empty().append(num_results);
	$('#when_done').show();

	if (num_results > 0) {
		var first_result = parseInt(Math.max(0, args['p']));
		var results_per_page = parseInt(args['c']);

		if (results_per_page > 100)
			results_per_page = 100;

		var last_result = Math.min(first_result + results_per_page, num_results);

		insert_links(first_result, last_result, num_results, results_per_page);

		if (args['ret'] == 'p') {
			$('#content').append('<table style="display: inline">');
			dump_posts(data[1], $('#content > table:last'), true);
		}
		else {
			dump_images(data[1], $('#content'));
		}

		if (last_result + 1 >= num_results) {
			insert_links(last_result, last_result, num_results, results_per_page);
			return null;
		}
		else {
			args['p'] = first_result + results_per_page;
			return args;
		}
	}
	else {
		$('#main').hide().empty().append('<a href="index" class="clean"><h1>4scrape</h1></a><br/><h4>They Stole All the Mittens</h4><br/><p><center>No posts matched your search for ``' + get_param('q') + '\'\'.</center></p><br/><br/><br/>').show();
		return null;
	}
}, true);
