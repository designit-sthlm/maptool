Template.map.onRendered(function () {
		// Load map
    Mapbox.load();
    Tracker.autorun(function () {
        if( Mapbox.loaded() ) {
					L.mapbox.accessToken = 'pk.eyJ1IjoibXVyaWxvcG9sZXNlIiwiYSI6ImNpZ2o3aWY4OTAwMWx1bmx6cWp3enZneGUifQ.XuFUq-DqQK6kD8S3shSPGQ';
					Meteor.map = L.mapbox.map( 'map', 'mapbox.streets' );
					// document.oncontextmenu = function() {return false;};
					// Meteor.map.on( 'mousedown', function( e ) {
					// 	if( e.originalEvent.button == 2 ) {
					// 		console.log( 'mousedown', e.originalEvent.button );
					// 		return false;
					// 	}
					// 	return true;
					// })
        }
    });
		// Add pins
    Tracker.autorun(function () {
        if( Mapbox.loaded() ) {
					Meteor.map.featureLayer.setGeoJSON( Session.get( 'geojson' ) );
				}
    });
		// Fetch pins from database and map it into a geojson array
    Tracker.autorun(function () {
			if( Pin.find({}) ) {
				var geojson = Pin.find({}).fetch().map( function( pin ) {
					return {
						"type": "Feature",
				    "geometry": {
				      "type": "Point",
				      "coordinates": [ pin.lng || 0, pin.lat || 0 ]
				    },
				    "properties": {
				      "title": '<h2><a href="' + Meteor.absoluteUrl('form') + '/' + pin._id + '">' + ( pin.title || 'Untitled' ) + '</a></h2>',
				      "description": pin.description,
				      "marker-color": "#fc4353",
				      "marker-size": "large"
				    }
					}
				});
				Session.set( 'geojson', geojson );
			}
    });
});

Template.form.onRendered(function() {
	$( '.summernote' ).summernote();

	// Load map
	Mapbox.load();
	Tracker.autorun(function () {
			if( Mapbox.loaded() ) {
				L.mapbox.accessToken = 'pk.eyJ1IjoibXVyaWxvcG9sZXNlIiwiYSI6ImNpZ2o3aWY4OTAwMWx1bmx6cWp3enZneGUifQ.XuFUq-DqQK6kD8S3shSPGQ';
				Meteor.map = L.mapbox.map( 'map-picker', 'mapbox.streets' );
				// Load position pin on map
				if( $( 'input[name=lng]').val() && $( 'input[name=lat]').val() ) {
					var geojson = [{
						"type": "Feature",
						"geometry": {
							"type": "Point",
							"coordinates": [ $( 'input[name=lng]').val(), $( 'input[name=lat]').val() ]
						}
					}];
					Meteor.map.featureLayer.setGeoJSON( geojson );
				}
				// Prevent context menu
				document.oncontextmenu = function() {return false;};
				Meteor.map.on( 'mousedown', function( e ) {
					if( e.originalEvent.button == 2 ) {
						var geojson = [{
					    "type": "Feature",
					    "geometry": {
					      "type": "Point",
					      "coordinates": [ e.latlng.lng, e.latlng.lat ]
					    }
					  }];
						$( 'input[name=lng]').val( e.latlng.lng );
						$( 'input[name=lat]').val( e.latlng.lat );
						Meteor.map.featureLayer.setGeoJSON( geojson );
					}
					return false;
				})
			}
	});

});

Template.form.events({
	'submit form': function( e ) {
		e.preventDefault();
		Session.set( 'savingForm', true );
		// Check what button was pressed
		if( $( document.activeElement ).hasClass( 'btn-danger' ) ) {
			// Delete
			if( this._id ) {
				Pin.remove( this._id, function() {
					Session.set( 'savingForm', false );
					Router.go( 'map' );
				});
			}
		} else {
			// Create or update
			var pin = {
				title: e.target.title.value || 'Untitled',
				description: $( '.summernote' ).code() || '',
				lat: e.target.lat.value || 0,
				lng: e.target.lng.value || 0
			};
			if( this._id ) {
				Pin.update(
					{ _id: this._id },
					{ $set: pin },
					function( err, data ) {
						if( err ) console.log( 'error', err );
						Session.set( 'savingForm', false );
						Router.go( 'map' );
					}
				)
			} else {
				Pin.insert(
					pin,
					function( err, data ) {
						if( err ) console.log( 'error', err );
						Session.set( 'savingForm', false );
						Router.go( 'map' );
					}
				);
			}
		}
		return false;
	}
});

Template.form.helpers({
	loading: function() {
		return Session.equals( 'savingForm', true );
	}
})
