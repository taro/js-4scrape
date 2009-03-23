$('#loading').remove();

$('#w').val(screen.width);
$('#h').val(screen.height);
$('#search_field').focus();

$('#op').change(function(){
	$('#w').attr('name', $('#op').val()+'w');

	if ($('#op').val())
		$('#h').attr('name', '').attr('disabled', true);
	else 
		$('#h').attr('name', 'h').removeAttr('disabled');
});

$('#as').change(function(){
	if ($('#as').val()) {
		$('#op').show();
		$('#op').change();
	}
	else {
		$('#op').val('').change().hide();
	}
});

$.getJSON('api?a=stats', null, function(data, _) {
	for ( i in data ) {
		var board = data[i];
		$('select.board_list').append('<option value="' + board['board_id'] + '">/' + board['board_sname'] + '/</option>' );
	}

	$('#choose_indexes_link').click(function() {
		$('#choose_indexes_link').hide();
		$('#choose_indexes_row').show();
	});
});
