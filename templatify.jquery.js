// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

// Plugin
(function($, window, document, undefined) {

	var Templatify = {
		init: function( options, container ) {
			var self = this;

			// Set container of element that will be replaced
			self.$container = $( container ); // jQuery object of HTML element

			// Set element that will be replaced
			if( self.$container.is('select') ) {
				self.$elementToBeReplaced = self.$container;
			} else {
				self.$elementToBeReplaced = self.$container.find('select');
			}

			// Allow passing just name of template as only argument
			if( typeof options === 'string' ) {
				options = { template: options };
			}

			// Assign options and override any defaults with passed options
			self.options = $.extend( {}, $.fn.templatify.options, options );

			// Convert Selector (string) of Template into jQuery object
			if( typeof self.options.template === 'string' ) {
				self.options.template = $( self.options.template ).html();
			}

			// Parse Values and save them in this.data object
			self.model();

			// Apply values to template and attach it to DOM
			self.view();

			

		},

		model: function() {
			var data = {
					items: []
				};

			// Insert nodes data-* attributes in data object
			$.each(this.$elementToBeReplaced.children(), function(key, element) {
				var $element = $( element ),
					attributes = $element.data();

				// Added selected attribute to the item's object
				attributes.selected = $element.is(':selected');
				attributes.value = $element.val();
				attributes.html = $element.html();

				// Add item's object to data object
			    data.items.push( attributes );

			    if( attributes.selected ) {
			    	data.selected = attributes;
			    }

			});

			// Add all data-* attributes of select in data object
			data = $.extend( {}, data, this.$elementToBeReplaced.data() );

			// Make data object available to other methods
			this.data = data;

		},

		view: function() {
			var template = Handlebars.compile( this.options.template );

			this.$container.after( template( this.data ) ).remove();

			// Execute user's function when done
			if( typeof this.options.onComplete === 'function' ) {
				this.options.onComplete.apply(this.$container, arguments);
			}

		}


	};

	// Plugin core
	$.fn.templatify = function( options ) {
		return this.each(function() {

			var templatify = Object.create( Templatify );
			templatify.init( options, this );

			$.data( this, 'templatify', templatify );
		});
	};

	// Default Options
	$.fn.templatify.options = {
		template: '#default-template', // Selector of template script tag
		onComplete: null
	};

})( jQuery, window, document );