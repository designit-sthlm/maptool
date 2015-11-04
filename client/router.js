Router.route( '/', function() {
	this.redirect( '/map' );
});

Router.route( '/map', function() {
		this.render( 'map' );
	}
);

Router.route( '/form/:id?', function() {
	var data = {};
	if( this.params.id ) {
		data = Pin.findOne( this.params.id );
	}
	this.render( 'form', { data: data } );
});
