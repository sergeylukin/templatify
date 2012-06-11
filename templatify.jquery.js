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
		init: function( options, elem ) {
			var self = this;

			// Set element that will be replaced
			self.$elem = $( elem ); // jQuery object of HTML element

			// For now - only <SELECT> element is supported..
			// Probably will be changed in future
			if( !self.$elem.is('select') ) {
				return false;
			}


			// If a string was passed as an only option - pass it as if it is name of template
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
			$.each(this.$elem.children(), function(key, node) {
				var $node = $( node ),
					attributes = $node.data();

				// Added selected attribute to the item's object
				attributes.selected = $node.is(':selected');
				attributes.value = $node.val();
				attributes.html = $node.html();

				// Add item's object to data object
			    data.items.push( attributes );

			    if( attributes.selected ) {
			    	data.selected = attributes;
			    }

			});

			// Add all data-* attributes of select in data object
			data = $.extend( {}, data, this.$elem.data() );

			// Make data object available to other methods
			this.data = data;

		},

		view: function() {
			var template = Handlebars.compile( this.options.template );
			
			// Append rendered template to DOM and save new element in variable
			this.$newElement = this.$elem.after( template( this.data ) ).next();

			// Delete old element
			this.$elem.remove();

		}


	};

	// Plugin core
	$.fn.templatify = function( options ) {
		return this.each(function() {

			var templatify = Object.create( Templatify );
			templatify.init( options, this );

			// Save instance in newly created element
			templatify.$newElement.data('templatify', templatify );

			// Execute user's function when done
			if( typeof templatify.options.onComplete === 'function' ) {
				templatify.options.onComplete.apply(templatify.$newElement, arguments);
			}

		});
	};

	// Default Options
	$.fn.templatify.options = {
		template: '#default-template', // Selector of template script tag
		onComplete: null
	};

})( jQuery, window, document );