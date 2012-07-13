/**
 * A simple plugin to create an interactive todo list.
 * Users can add items to the list with an input element.
 *
 * The plugin is used as an exercise for applicants to allow
 * them to express their proficiency with front end technologies.
 *
 * Authors: Jesse Beach <jesse.beach@acquia.com>
 *
 * Developed for Acquia, Inc.
 * http://acquia.com
 */
(function ($, window, document, undefined) {
	// Replace 'pluginName' with the name of your plugin.
	var plugin = 'todo',
	// A private reference to this $plugin object.
	$plugin;

	/**
	 * Add the user input to the todo list.
	 */
	function addItem (event) {
		event.preventDefault();
		var $wrapper = $(event.delegateTarget),
		$input = $wrapper.find('.todo-input'),
		$list = $wrapper.find('.todo-list'),
		value = $input.val();
		// Add the item.
		if (value !== undefined && value.length > 0) {
			$list.append($('<li>', {
				html: value
			}));
			$input.val('');
		}
	}
	/**
	 * A general purpose function that checks allowed keys configured
	 * as part of the event handler registry and calls 
	 * the configured function if the triggering key is part of the allowed set.
	 * 
	 * event.data.keys (Array): The allowed keys
	 * event.data.fn (Function): The function to call
	 */
	function keyManager (event) {
		if ($.inArray(event.charCode, event.data.keys) > -1) {
			event.data.fn(event);
		}
	}
	/**
	 * Given a wrapper element, such as a div, append the DOM elements
	 * the allow a user to add new list elements.
	 */
	function buildTodoList () {
		var $wrapper = $('<div>');
		$wrapper.append($('<input>', {
			type: 'text'
		}).addClass('todo-input'));
		$wrapper.append($('<a>', {
			href: '/item/add',
			text: 'add item'
		}).addClass('todo-submit'));
		$wrapper.append($('<ul>', {}).addClass('todo-list'));
		return $wrapper.contents();
	}

	// Plugins should not declare more than one namespace in the $.fn object.
	// So we declare methods in a methods array
	var methods = {
		init : function (options) {
			// Iterate over matched elements.
			return this.each(function () {
				// Build the todo list.
				$(this)
				.append(buildTodoList())
				.on({
					'click': addItem,
				}, '.todo-submit')
				.on({
					'keypress': keyManager
				}, '.todo-input', {fn: addItem, keys: [13]});
			});
		}
	};

	// Add the plugin to
	$plugin = $.fn[plugin] = function (method) {      
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.' + plugin);
		}
	};
}
// Pass jQuery as the param to the preceding anonymous function
(jQuery, window, document, undefined));