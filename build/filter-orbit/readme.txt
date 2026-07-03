=== FilterOrbit: Advanced Product Filters for WooCommerce ===
Contributors: filterorbit
Tags: woocommerce, product filter, ajax filter, layered navigation, faceted search
Requires at least: 6.0
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Advanced zero-request product filters for WooCommerce with AI search, visual discovery, and a React filter designer.

== Description ==

FilterOrbit adds a powerful, instant-filtering sidebar to your WooCommerce store. All filtering runs client-side on a pre-cached product array — no page reloads, no AJAX round-trips.

**Features**

* Zero-request filtering — filters run entirely in the browser on a cached product array.
* AI natural language search — type plain-English queries to filter products.
* Visual discovery — image swatch grid for colour and style filtering.
* Predictive personalisation — quick picks based on browsing session.
* Range histogram — price slider with distribution bars.
* Drag-and-drop filter designer — build your sidebar layout in the admin.
* Per-filter colour settings — customise pill colours, slider colours, and card tints independently.
* WooCommerce attribute support — automatically discovers global and custom product variation attributes.
* Multi-category / multi-tag — products with multiple categories and tags match all their values.

== Installation ==

1. Upload the `FilterOrbit` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Go to **FilterOrbit** in the admin menu and design your filter layout.
4. Add the shortcode `[filter_orbit]` to any page, or enable the automatic shop sidebar in settings.

== Frequently Asked Questions ==

= Does it require WooCommerce? =

Yes. FilterOrbit requires WooCommerce to be active.

= Does filtering require AJAX calls? =

No. All product data is pre-loaded on page render and filtering runs entirely in the browser with zero network requests.

= Can I customise the colours? =

Yes. Each filter block has independent colour settings in the Block Settings panel of the filter designer. Slider filters, pill/category filters, and layout blocks each expose the colour controls that are relevant to them.

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.0 =
Initial release.
