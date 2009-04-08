$('#loading').remove();

$('#as').val(screen.width / screen.height);
$('#search_field').focus();

$.getJSON(document.location.protocol + '//twitter.com/status/user_timeline/4scrape.json?count=2&callback=?', null, function(data) {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	data = data[0];
	var d = new Date(Date.parse(data['created_at']));
	var min = d.getMinutes();
	if (min < 10) min = '0' + min;
	var d1 = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getHours() + ':' + min; 
	$('#notice').append(d1 + ': ' + data['text']);
});

$.getJSON('api?a=stats', null, function(data, _) {
	var num_images = 0;
	var num_posts = 0;

	for ( i in data ) {
		var board = data[i];
		num_images += parseInt(board['board_imgs']);
		num_posts += parseInt(board['board_posts']);

		$('select.board_list').append('<option value="' + board['board_id'] + '">/' + board['board_sname'] + '/</option>' );
	}

	$('#num_images').empty().append(num_images);
	$('#num_posts').empty().append(num_posts);
});
