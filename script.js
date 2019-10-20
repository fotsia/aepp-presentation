$(function() {
	'use scrict';

	remark.highlighter.engine.registerLanguage('γλώσσα', glossa);

	var slideshow = remark.create({
		sourceUrl: 'presentation.md',
	//	ratio: '16:9',
		highlightLanguage: 'γλώσσα',
		highlightLines: true,
		highlightStyle: 'vs'
	});

	$(window).on('hashchange', function() {
		if(window.location.hash) {
            var hash = window.location.hash;
			var id = hash.substr(1).replace(/\./ig,'-') + '-';
			var name = hash.substr(1);
		//	console.log(id);
		//	console.log(name);
			var index = $('[id^="' + id +'"]').closest('.remark-slide-container').index() + 1;
			slideshow.gotoSlide(index);
    	}
	});

	slideshow.on('showSlide', function (slide) {
		setTimeout(function() {
			// Clear flowchart markup first
			// Then draw flowchart
			$('.remark-visible .remark-code.flowchart:not(:has(>svg))').each(function () {
				var $this = $(this);
				var html = $this.html();
			//	console.log(html);
				var code = html;
				code = code.replace(/<\/div>/ig, '\n');
				code = code.replace(/<\/?[^>]+>/ig, '');
				code = code.replace(/&lt;/ig, '<');
				code = code.replace(/&gt;/ig, '>');
			//	console.log(code);

				var diagram = flowchart.parse(code);
				$this.html('');
				diagram.drawSVG($this.get(0));
				$this.hide();
				setTimeout(() => {
					$this.find('svg').attr('width', '100%');
					$this.find('svg').attr('height', '98%');
					$this.show();
				}, 100);
			});

			// Prevent scrolling on overflowing code elements
			$('.remark-visible pre > code').each(function () {
				var $this = $(this);
				var el = $this[0];
				var hasHorizontalScrollbar = el.scrollWidth > el.clientWidth;
				var hasVerticalScrollbar = el.scrollHeight > el.clientHeight;
				if (hasHorizontalScrollbar || hasVerticalScrollbar) {
					$this.on('mousewheel', function(event) {
						event.stopPropagation();
					});
				}
			});
		}, 100);
	});

	if ('serviceWorker' in navigator) {
		console.log('CLIENT: service worker registration in progress.');
		navigator.serviceWorker
			.register('./service-worker.js')
			.then(
				function() {
					console.log('CLIENT: service worker registration complete.');
				},
				function() {
					console.log('CLIENT: service worker registration failure.');
				}
			);
	} else {
		console.log('CLIENT: service worker is not supported.');
	}
});
