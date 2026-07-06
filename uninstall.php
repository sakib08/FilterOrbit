<?php
/**
 * Plugin uninstall — removes all options created by FilterOrbit.
 *
 * @package FilterOrbit
 */

if ( ! defined( 'ABSPATH' ) || ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'filter_orbit_filters' );
delete_option( 'filter_orbit_settings' );
delete_option( 'filter_orbit_ai_settings' );
delete_option( 'filter_orbit_language_strings' );
