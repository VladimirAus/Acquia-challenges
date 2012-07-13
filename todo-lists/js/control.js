(function ($, window, document, undefined) {
	$(document).ready(function ($) {
		$('.todo.today').todo(); //example of unordered list
		$('.todo.tomorrow').todo({ordered: true}); //example of ordered list
	});
} (jQuery, window, document, undefined));