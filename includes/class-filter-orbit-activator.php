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
				'label'   => __( 'Price Range', 'filterorbit-advanced-product-filters-for-woocommerce' ),
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
				'label'   => __( 'Category', 'filterorbit-advanced-product-filters-for-woocommerce' ),
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
				'label'   => __( 'Brand', 'filterorbit-advanced-product-filters-for-woocommerce' ),
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
			'search_section_label'          => __( 'AI Language', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'search_title'                  => __( 'AI Natural Language Filter', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'search_description'            => __( 'Describe what you\'re looking for in plain English', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'search_placeholder'            => __( 'e.g. Show me wireless headphones under $150 with noise cancellation…', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_section_label'          => __( 'Visual Search', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_title'                  => __( 'Visual Discovery', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_description'            => __( 'Upload or drop an image to find visually similar products', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_drop_text'              => __( 'Drop image here or click to upload', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_file_types'             => __( 'PNG, JPG, WEBP — up to 20MB', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_camera_button'          => __( 'Camera', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'visual_url_button'             => __( 'URL', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'personalized_title'            => __( 'Predictive Personalization', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'personalized_description'      => __( 'AI-modeled from your browsing, purchases & taste profile', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'personalized_predicted_title'  => __( 'Predicted For You', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'personalized_model_confidence' => __( 'Model Confidence', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'personalized_active_badge'     => __( 'ACTIVE', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'personalized_prioritized_prefix' => __( 'Prioritized filters:', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'chip_next_buy'                 => __( 'Your Next Buy', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'chip_trending'                 => __( 'Trending Near You', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'chip_eco'                      => __( 'Eco-friendly only', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'chip_sale'                     => __( 'On sale', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'chip_new'                      => __( 'New arrivals', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'chip_local'                    => __( 'Local brands', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'products_label'                => __( 'products', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'clear_all'                     => __( 'Clear all', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'no_products'                   => __( 'No products match your filters.', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'selected_label'                => __( 'SELECTED', 'filterorbit-advanced-product-filters-for-woocommerce' ),
			'fit_label'                     => __( 'fit', 'filterorbit-advanced-product-filters-for-woocommerce' ),
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
}
