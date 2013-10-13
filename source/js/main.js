(function() {
	'use strict';

	if (!document.body.classList || !window.addEventListener || !document.querySelector) return;

	var onScroll = function() {
			if (window.scrollY > 240) {
				navBar.classList.add('fixed');
			} else {
				navBar.classList.remove('fixed');
			}
		};

	if (document.body.classList.contains('home') && document.documentElement.clientWidth > 800) {
		var navBar = document.querySelector('.page-nav');

		window.addEventListener('scroll', onScroll);
	}
}());
