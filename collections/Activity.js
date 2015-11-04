Activity = new Mongo.Collection( 'activity' );

ActivitySchema = new SimpleSchema({
	type: {
		type: String,
		allowedValues: [ 'Desk Research', 'Interview', 'Shadowing', 'Immersion', 'Workshop', 'Visit' ]
	},
	title: {
		type: String,
		max: 60
	},
	description: {
		type: String,
		autoform: {
			rows: 5
		}
	},
	date: {
		type: Date
	},
	createdAt: {
		type: Date,
		autoValue: function() {
			if( this.isInsert ) {
				return new Date();
			}
		}
	},
});

Activity.attachSchema( ActivitySchema );
