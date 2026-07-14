<?php
/**
 * Plugin activation defaults.
 *
 * @package FilterOrbit
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles activation and default data.
 */
class Filter_Orbit_Activator {

	/**
	 * Run on plugin activation.
	 *
	 * @return void
	 */
	public static function activate() {
		if ( false === get_option( 'filter_orbit_filters', false ) ) {
			update_option( 'filter_orbit_filters', self::default_filters() );
		}

		if ( false === get_option( 'filter_orbit_settings', false ) ) {
			update_option( 'filter_orbit_settings', self::default_settings() );
		}

		if ( false === get_option( 'filter_orbit_ai_settings', false ) ) {
			update_option( 'filter_orbit_ai_settings', self::default_ai_settings() );
		}

		if ( false === get_option( 'filter_orbit_language_strings', false ) ) {
			update_option( 'filter_orbit_language_strings', self::default_language_strings() );
		}
	}

	/**
	 * Default filter definitions.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public static function default_filters() {
		return array(
			array(
				'id'      => 'price',
				'label'   => __( 'Price Range', 'filterorbit-product-filters' ),
				'type'    => 'range',
				'field'   => 'price',
				'min'     => 0,
				'max'     => 1000,
				'step'    => 5,
				'unit'    => 'USD',
				'accent'  => 'violet',
				'color'   => '#6366f1',
				'enabled' => true,
				'order'   => 0,
				'column'  => 0,
			),
			array(
				'id'      => 'category',
				'label'   => __( 'Category', 'filterorbit-product-filters' ),
				'type'    => 'checkbox',
				'field'   => 'category',
				'options' => array(),
				'color'   => '#8b5cf6',
				'enabled' => true,
				'order'   => 1,
				'column'  => 0,
			),
			array(
				'id'      => 'brand',
				'label'   => __( 'Brand', 'filterorbit-product-filters' ),
				'type'    => 'checkbox',
				'field'   => 'brand',
				'options' => array(),
				'color'   => '#8b5cf6',
				'enabled' => true,
				'order'   => 2,
				'column'  => 0,
			),
		);
	}

	/**
	 * Default plugin settings.
	 *
	 * @return array<string, mixed>
	 */
	public static function default_settings() {
		return array(
			'enable_ai_filter'        => true,
			'enable_visual_discovery' => true,
			'enable_personalization'  => true,
			'hide_irrelevant_filters' => false,
			'products_per_page'       => 12,
			'sidebar_position'        => 'left',
			'show_product_counts'     => true,
			'cache_products'          => true,
			'layout_columns'          => 2,
			'google_font'             => 'DM Sans',
			'label_font_size'         => 11,
			'option_font_size'        => 14,
			'page_layout'             => self::default_page_layout(),
		);
	}

	/**
	 * Default storefront page layout.
	 *
	 * @return array<string, mixed>
	 */
	public static function default_page_layout() {
		return array(
			'columns' => array(
				array(
					'id'     => 'col_0',
					'width'  => 30,
				),
				array(
					'id'     => 'col_1',
					'width'  => 70,
				),
			),
			'blocks'  => array(
				array(
					'id'      => 'nlp_search',
					'type'    => 'nlp_search',
					'column'  => 0,
					'order'   => 0,
					'enabled' => true,
					'color'   => '#8b5cf6',
				),
				array(
					'id'      => 'personalized_filters',
					'type'    => 'personalized',
					'column'  => 0,
					'order'   => 1,
					'enabled' => true,
					'color'   => '#f43f5e',
				),
				array(
					'id'      => 'results_bar',
					'type'    => 'results_bar',
					'column'  => 0,
					'order'   => 99,
					'enabled' => true,
					'color'   => '#64748b',
				),
				array(
					'id'                  => 'products_grid',
					'type'                => 'products',
					'column'              => 1,
					'order'               => 0,
					'enabled'             => true,
					'productGridColumns'  => 3,
					'color'               => '#f59e0b',
				),
			),
		);
	}

	/**
	 * Default storefront language strings.
	 *
	 * @return array<string, string>
	 */
	public static function default_language_strings() {
		return array(
			'search_section_label'          => __( 'AI Language', 'filterorbit-product-filters' ),
			'search_title'                  => __( 'AI Natural Language Filter', 'filterorbit-product-filters' ),
			'search_description'            => __( 'Describe what you\'re looking for in plain English', 'filterorbit-product-filters' ),
			'search_placeholder'            => __( 'e.g. Show me wireless headphones under $150 with noise cancellation…', 'filterorbit-product-filters' ),
			'visual_section_label'          => __( 'Visual Search', 'filterorbit-product-filters' ),
			'visual_title'                  => __( 'Visual Discovery', 'filterorbit-product-filters' ),
			'visual_description'            => __( 'Upload or drop an image to find visually similar products', 'filterorbit-product-filters' ),
			'visual_drop_text'              => __( 'Drop image here or click to upload', 'filterorbit-product-filters' ),
			'visual_file_types'             => __( 'PNG, JPG, WEBP — up to 20MB', 'filterorbit-product-filters' ),
			'visual_camera_button'          => __( 'Camera', 'filterorbit-product-filters' ),
			'visual_url_button'             => __( 'URL', 'filterorbit-product-filters' ),
			'personalized_title'            => __( 'Predictive Personalization', 'filterorbit-product-filters' ),
			'personalized_description'      => __( 'AI-modeled from your browsing, purchases & taste profile', 'filterorbit-product-filters' ),
			'personalized_predicted_title'  => __( 'Predicted For You', 'filterorbit-product-filters' ),
			'personalized_model_confidence' => __( 'Model Confidence', 'filterorbit-product-filters' ),
			'personalized_active_badge'     => __( 'ACTIVE', 'filterorbit-product-filters' ),
			'personalized_prioritized_prefix' => __( 'Prioritized filters:', 'filterorbit-product-filters' ),
			'chip_next_buy'                 => __( 'Your Next Buy', 'filterorbit-product-filters' ),
			'chip_trending'                 => __( 'Trending Near You', 'filterorbit-product-filters' ),
			'chip_eco'                      => __( 'Eco-friendly only', 'filterorbit-product-filters' ),
			'chip_sale'                     => __( 'On sale', 'filterorbit-product-filters' ),
			'chip_new'                      => __( 'New arrivals', 'filterorbit-product-filters' ),
			'chip_local'                    => __( 'Local brands', 'filterorbit-product-filters' ),
			'products_label'                => __( 'products', 'filterorbit-product-filters' ),
			'clear_all'                     => __( 'Clear all', 'filterorbit-product-filters' ),
			'no_products'                   => __( 'No products match your filters.', 'filterorbit-product-filters' ),
			'selected_label'                => __( 'SELECTED', 'filterorbit-product-filters' ),
			'fit_label'                     => __( 'fit', 'filterorbit-product-filters' ),
		);
	}

	/**
	 * Default AI and RAG settings.
	 *
	 * @return array<string, mixed>
	 */
	public static function default_ai_settings() {
		return array(
			'provider'  => 'openai',
			'openai'    => array(
				'api_key'          => '',
				'organization_id'  => '',
				'chat_model'       => 'gpt-4o-mini',
				'embedding_model'  => 'text-embedding-3-small',
			),
			'gemini'    => array(
				'api_key'         => '',
				'chat_model'      => 'gemini-2.0-flash',
				'embedding_model' => 'text-embedding-004',
			),
			'nl_filter' => array(
				'enabled'       => true,
				'system_prompt' => '',
			),
			'rag'       => array(
				'enabled'              => true,
				'chunk_size'           => 512,
				'chunk_overlap'        => 50,
				'top_k'                => 5,
				'similarity_threshold' => 0.7,
				'context_max_tokens'   => 2000,
				'auto_index_products'  => true,
				'index_fields'         => array( 'title', 'description', 'category', 'tags' ),
				'indexed_products'     => 0,
				'last_indexed_at'      => '',
			),
		);
	}

	/**
	 * Allowed Google Font families for the shortcode UI.
	 *
	 * @return array<string, string> family => label
	 */
	public static function google_fonts() {
		return array(
			''                   => __( 'Theme / System default', 'filterorbit-product-filters' ),
			'DM Sans'            => 'DM Sans',
			'Outfit'             => 'Outfit',
			'Inter'              => 'Inter',
			'Roboto'             => 'Roboto',
			'Open Sans'          => 'Open Sans',
			'Lato'               => 'Lato',
			'Montserrat'         => 'Montserrat',
			'Poppins'            => 'Poppins',
			'Nunito'             => 'Nunito',
			'Nunito Sans'        => 'Nunito Sans',
			'Source Sans 3'      => 'Source Sans 3',
			'Raleway'            => 'Raleway',
			'Ubuntu'             => 'Ubuntu',
			'Work Sans'          => 'Work Sans',
			'Manrope'            => 'Manrope',
			'Plus Jakarta Sans'  => 'Plus Jakarta Sans',
			'Figtree'            => 'Figtree',
			'Space Grotesk'      => 'Space Grotesk',
			'IBM Plex Sans'      => 'IBM Plex Sans',
			'Mulish'             => 'Mulish',
			'Karla'              => 'Karla',
			'Rubik'              => 'Rubik',
			'Merriweather'       => 'Merriweather',
			'Playfair Display'   => 'Playfair Display',
		);
	}

	/**
	 * Sanitize a Google Font family name against the allow-list.
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	public static function sanitize_google_font( $value ) {
		$family = is_string( $value ) ? $value : '';
		$fonts  = self::google_fonts();

		if ( array_key_exists( $family, $fonts ) ) {
			return $family;
		}

		return 'DM Sans';
	}

	/**
	 * Build Google Fonts CSS2 URL for a family (empty = none).
	 *
	 * @param string $family Font family.
	 * @return string
	 */
	public static function google_font_css_url( $family ) {
		$family = self::sanitize_google_font( $family );

		if ( '' === $family ) {
			return '';
		}

		$encoded = str_replace( ' ', '+', $family );
		return 'https://fonts.googleapis.com/css2?family=' . $encoded . ':wght@400;500;600;700&display=swap';
	}

	/**
	 * CSS font-family stack for a selected Google Font.
	 *
	 * @param string $family Font family.
	 * @return string
	 */
	public static function google_font_stack( $family ) {
		$family = self::sanitize_google_font( $family );

		if ( '' === $family ) {
			return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
		}

		return '"' . $family . '", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
	}

	/**
	 * Allowed font size options (px) shown in Settings.
	 *
	 * @return array<int, string>
	 */
	public static function font_size_options() {
		return array(
			10 => '10px',
			11 => '11px',
			12 => '12px',
			13 => '13px',
			14 => '14px',
			15 => '15px',
			16 => '16px',
			18 => '18px',
			20 => '20px',
			22 => '22px',
			24 => '24px',
		);
	}

	/**
	 * Sanitize a typography font size in px.
	 *
	 * @param mixed $value   Raw value.
	 * @param int   $default Fallback.
	 * @return int
	 */
	public static function sanitize_font_size( $value, $default = 14 ) {
		$size = absint( $value );
		if ( $size < 10 || $size > 28 ) {
			return absint( $default );
		}
		return $size;
	}

}
