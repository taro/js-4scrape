$.getJSON(get_api_url('thread'), function(data, _) {
	if (data[0]['error'] == 'ambiguous') {
		var buttons = {};
		for (var i in data) {
			var board = data[i];
			buttons[board['sname']] = 
				(function (board_id) { return function() {
					window.location = 'thread?t=' + get_param('t') + '&b=' + board_id;
				}})(board['id']);
		}

		$('#error')
			.empty()
			.html('<p>The thread specified exists on multiple boards. Please choose one:<br/><br/><br/><br/><br/></p>')
			.dialog({
				'buttons' : buttons,
				'draggable' : false,
				'resizable' : false,
				'position' : 'center',
				'title' : 'Ambiguous Thread ID',
				'dialogClass' : ''
			})
			.show()
			;
	}
	else if (data[0]['error']) {
		$('#error')
			.html('<p>' + data[0]['error'] + '</p>')
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
				'title' : 'Error',
				'dialogClass' : ''
			})
			;
	}
	else {
		dump_posts(data, $('#content'), true);
	}
});
