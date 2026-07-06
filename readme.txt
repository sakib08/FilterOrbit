=== FilterOrbit: Advanced Product Filters for WooCommerce ===
Contributors: sakibbd08
Tags: woocommerce, product filter, layered navigation, faceted search, ajax filter
Requires at least: 6.0
Tested up to: 7.0
Requires PHP: 7.4
Requires Plugins: woocommerce
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

1. Upload the `filterorbit-product-filters` folder to the `/wp-content/plugins/` directory.
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

== External services ==

FilterOrbit includes an optional AI natural-language search feature. When enabled and configured, the plugin sends product search queries and product data to third-party AI services. This feature is **opt-in** — it only activates if you enter an API key in the AI Settings screen. No data is sent without your explicit configuration.

**OpenAI**

* What it is: A third-party AI platform (https://openai.com).
* What it is used for: Processing natural-language search queries and optionally generating product embeddings for semantic search (RAG).
* What data is sent: The user's search query text, and (when indexing is enabled) product titles, descriptions, categories, tags, and attributes.
* When data is sent: Only when a visitor submits a natural-language search and AI is enabled and configured with a valid API key.
* Terms of service: https://openai.com/policies/terms-of-use
* Privacy policy: https://openai.com/policies/privacy-policy

**Google Gemini**

* What it is: A third-party AI platform provided by Google (https://ai.google.dev).
* What it is used for: An alternative AI provider for natural-language query processing and product embeddings.
* What data is sent: The user's search query text, and (when indexing is enabled) product titles, descriptions, categories, tags, and attributes.
* When data is sent: Only when a visitor submits a natural-language search and AI is enabled and configured with a valid Gemini API key.
* Terms of service: https://ai.google.dev/gemini-api/terms
* Privacy policy: https://policies.google.com/privacy

If you do not enter any API keys in the AI Settings screen, no data is ever transmitted to these services.

== Source code ==

The compiled JavaScript assets (`assets/admin/filter-orbit-admin.js` and `assets/frontend/filter-orbit.js`) are built from human-readable React/TypeScript source files. The full source code is publicly available at:

https://github.com/sakib08/FilterOrbit

Build instructions (requires Node.js 18+):

1. `npm install`
2. `npm run build`

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.0 =
Initial release.
