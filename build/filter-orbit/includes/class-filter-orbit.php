<?php
/**
 * Main plugin bootstrap.
 *
 * @package FilterOrbit
 */

defined( 'ABSPATH' ) || exit;

require_once FILTER_ORBIT_PATH . 'includes/class-filter-orbit-activator.php';
require_once FILTER_ORBIT_PATH . 'includes/class-filter-orbit-admin.php';
require_once FILTER_ORBIT_PATH . 'includes/class-filter-orbit-rest-api.php';
require_once FILTER_ORBIT_PATH . 'includes/class-filter-orbit-frontend.php';

/**
 * Core plugin class.
 */
final class Filter_Orbit {

	/**
	 * Singleton instance.
	 *
	 * @var Filter_Orbit|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Filter_Orbit
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		register_activation_hook( FILTER_ORBIT_FILE, array( 'Filter_Orbit_Activator', 'activate' ) );

		add_action( 'plugins_loaded', array( $this, 'init' ) );
	}

	/**
	 * Load plugin components.
	 *
	 * @return void
	 */
	public function init() {
		new Filter_Orbit_Admin();
		new Filter_Orbit_REST_API();
		new Filter_Orbit_Frontend();
	}

	/**
	 * Get saved filter definitions.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public static function get_filters() {
		$filters = get_option( 'filter_orbit_filters', array() );

		if ( ! is_array( $filters ) ) {
			return array();
		}

		return $filters;
	}

	/**
	 * Get plugin settings.
	 *
	 * @return array<string, mixed>
	 */
	public static function get_settings() {
		$defaults = Filter_Orbit_Activator::default_settings();
		$settings = get_option( 'filter_orbit_settings', array() );

		if ( ! is_array( $settings ) ) {
			return $defaults;
		}

		$merged = wp_parse_args( $settings, $defaults );

		if ( empty( $merged['page_layout'] ) || ! is_array( $merged['page_layout'] ) ) {
			$merged['page_layout'] = $defaults['page_layout'];
		}

		return $merged;
	}

	/**
	 * Get storefront language strings merged with defaults.
	 *
	 * @return array<string, string>
	 */
	public static function get_language_strings() {
		$defaults = Filter_Orbit_Activator::default_language_strings();
		$stored   = get_option( 'filter_orbit_language_strings', array() );

		if ( ! is_array( $stored ) ) {
			return $defaults;
		}

		$merged = wp_parse_args( $stored, $defaults );

		return array_intersect_key( $merged, $defaults );
	}

	/**
	 * Get AI and RAG settings (API keys masked for admin display).
	 *
	 * @param bool $mask_keys Whether to mask API keys in the response.
	 * @return array<string, mixed>
	 */
	public static function get_ai_settings( $mask_keys = true ) {
		$defaults = Filter_Orbit_Activator::default_ai_settings();
		$settings = get_option( 'filter_orbit_ai_settings', array() );

		if ( ! is_array( $settings ) ) {
			$settings = array();
		}

		$merged = wp_parse_args( $settings, $defaults );

		foreach ( array( 'openai', 'gemini' ) as $provider ) {
			if ( ! isset( $merged[ $provider ] ) || ! is_array( $merged[ $provider ] ) ) {
				$merged[ $provider ] = $defaults[ $provider ];
			}

			$has_key = ! empty( $merged[ $provider ]['api_key'] );
			$merged[ $provider ]['has_api_key'] = $has_key;

			if ( $mask_keys ) {
				$merged[ $provider ]['api_key'] = '';
			}
		}

		return $merged;
	}
}
