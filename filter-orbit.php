<?php
/**
 * Plugin Name:       FilterOrbit: Advanced WooCommerce Product Filters
 * Plugin URI:        https://github.com/filterorbit/filter-orbit
 * Description:       Advanced zero-request WooCommerce product filters with AI, visual discovery, and a React-powered filter designer.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            FilterOrbit
 * Author URI:        https://filterorbit.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       filter-orbit
 * Domain Path:       /languages
 *
 * @package FilterOrbit
 */

defined( 'ABSPATH' ) || exit;

define( 'FILTER_ORBIT_VERSION', '1.0.0' );
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
