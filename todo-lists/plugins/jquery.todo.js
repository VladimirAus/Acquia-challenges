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
		value = stripHtmlTags($input.val()); // XSS prevention before length check
		
		// Add the item.
		if (value !== undefined && value.length > 0) {
			
			var newList = $('<li>', {
				html: value
			});
			
			//create a delete link
			var newAnchor = $('<a>', { 
				href: 'item/delete', 
				text: 'delete' 
			}).addClass('todo-delete');
			 
			newList.append(newAnchor);
			$list.append(newList);
			
			$input.val('');
		}
	}
	/**
	 * Remove item from the todo list.
	 */
	function removeItem (event) {
		event.preventDefault();
		var clickedLink = $(event.target);
		clickedLink.parent().remove(); // Anchor tem is always directly inside list
	}
	/**
	 * Remove HTML tags and special characters.
	 */
	function stripHtmlTags(html) {
		// Stripping special characters
		var arSpecChars = {"&gt;":"", "&lt;":"", "&amp;":"", 
							"&#x3c;":"", "&#x3e;":"",
							"&#":"", "\\u":""
							}

		for (var specChar in arSpecChars) {
			html = html.replace(new RegExp(specChar, "g"), arSpecChars[specChar]);
		}
		
		// Stripping HTML tags
		var tmp = document.createElement("DIV");
	 	tmp.innerHTML = html;
	 	var resultStripped =  tmp.textContent || tmp.innerText; 
		
		return resultStripped;
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
		if ($.inArray(event.charCode, event.data.keys) > -1 || 
			$.inArray(event.keyCode, event.data.keys) > -1)  { //fix for firefox
			event.data.fn(event);
		}
	}
	/**
	 * Given a wrapper element, such as a div, append the DOM elements
	 * the allow a user to add new list elements.
	 */
	function buildTodoList (isOrdered) {
		var $wrapper = $('<div>');
		$wrapper.append($('<input>', {
			type: 'text'
		}).addClass('todo-input'));
		$wrapper.append($('<a>', {
			href: '/item/add',
			text: 'add item'
		}).addClass('todo-submit'));
		
		var list;
		
		var displayUnorderedList = (isOrdered === undefined || !isOrdered);
		list = $(displayUnorderedList?'<ul>':'<ol>', {}).addClass('todo-list');
		
		// Drag and drop functionality using jQuery.ui
		list.sortable({
			connectWith: ".todo-list",
			dropOnEmpty: true,
			stop: function(event, ui) { // put dragged item on the bottom of the list
				var list = event.target.parentElement;
				if (ui.item.index() + 1 < list.childElementCount) {
					var itemTmp = jQuery.extend(true, {}, ui.item); // deep copy of the object
					
					ui.item.remove();
					$(list).append(itemTmp);
				}
			}
		});
		
		list.disableSelection();
		$wrapper.append(list);
			
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
				.append(buildTodoList(options != undefined ? options.ordered : false))
				.on({
					'click': addItem,
				}, '.todo-submit')
				.on({
					'keypress': keyManager
				}, '.todo-input', {fn: addItem, keys: [13]})
				.on({ // Firefox fix
					'onkeydown' : keyManager
				}, '.todo-input', {fn: addItem, keys: [13]})
				.on({ // attach delete event handler
					'click' : removeItem 
				}, '.todo-delete');
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