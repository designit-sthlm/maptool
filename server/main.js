Meteor.startup( function() {
	Pin.remove({});
	Pin.insert({
		title: 'test',
		description: 'desc',
		lat: 38.913188059745586,
		lng: -77.03238901390978
	});
	Pin.insert({
		title: 'test',
		description: 'desc',
		lat: 37.776,
		lng: -122.414
	});
})
