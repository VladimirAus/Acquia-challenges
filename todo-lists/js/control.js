(function ($, window, document, undefined) {
	$(document).ready(function ($) {
		$('.todo.unordered').todo();
		$('.todo.ordered').todo({ordered: true});
	});
} (jQuery, window, document, undefined));