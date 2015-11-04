AdminConfig = {
	name: 'Designit Stories',
  adminEmails: [ 'murilo.polese@designit.com' ],
  collections: {
    Activity: {
			omitFields: [ 'createdAt' ],
  		tableColumns: [
				{ label: 'Title', name: 'title' },
				{ label: 'Category', name: 'type' },
				{ label: 'Date', name: 'date' }
			]
		}
  },
	dashboard: {
    homeUrl: '/admin'
  }
};
