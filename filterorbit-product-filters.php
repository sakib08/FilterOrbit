<?php
/**
 * Plugin Name:       FilterOrbit: Advanced Product Filters for WooCommerce
 * Plugin URI:        https://pluginpros.co
 * Description:       Advanced zero-request product filters for WooCommerce with AI, visual discovery, and a React-powered filter designer.
 * Version:           1.0.1
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Requires Plugins:  woocommerce
 * Author:            sakibbd08
 * Author URI:        https://profiles.wordpress.org/sakibbd08/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       filterorbit-product-filters
 * Domain Path:       /languages
 *
 * @package FilterOrbit
 */

defined( 'ABSPATH' ) || exit;

define( 'FILTER_ORBIT_VERSION', '1.0.1' );
define( 'FILTER_ORBIT_FILE', __FILE__ );
define( 'FILTER_ORBIT_PATH', plugin_dir_path( __FILE__ ) );
define( 'FILTER_ORBIT_URL', plugin_dir_url( __FILE__ ) );

require_once FILTER_ORBIT_PATH . 'includes/class-filter-orbit.php';

/**
 * Initialize the plugin.
 *
 * @return Filter_Orbit
 */
function filter_orbit() {
	return Filter_Orbit::instance();
}

filter_orbit();
