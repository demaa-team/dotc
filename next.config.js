// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

// all the dynamic pages need to be defined here (this needs to be imported from the routes)

const exchangePages = ['/exchange'].reduce((pages, page) => {
	pages[page] = {
		page: '/excange/detail/[[...id]]',
	};

	return pages;
}, {});

const marketPages = [
	'/earn'
].reduce((pages, page) => {
	pages[page] = {
		page: '/market/detail/[[...id]]',
	};

	return pages;
}, {});

const pendingOrderPages = [
	'/pending-order'
].reduce((pages, page) => {
	pages[page] = {
		page: '/pending-order/detail/[[...id]]',
	};

	return pages;
}, {});

module.exports = withPlugins([[optimizedImages]], {
	webpack: (config) => {
		config.resolve.mainFields = ['module', 'browser', 'main'];
		return config;
	},
	trailingSlash: !!process.env.NEXT_PUBLIC_TRAILING_SLASH_ENABLED,
	exportPathMap: function (defaultPathMap) {
		return {
			...defaultPathMap,
			...exchangePages,
			...marketPages,
		};
	},
});
