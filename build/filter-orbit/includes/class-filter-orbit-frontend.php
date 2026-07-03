<?php
/**
 * WooCommerce storefront integration.
 *
 * @package FilterOrbit
 */

defined( 'ABSPATH' ) || exit;

/**
 * Frontend filter rendering and product data.
 */
class Filter_Orbit_Frontend {

	/**
	 * Whether frontend assets should load on this request.
	 *
	 * @var bool
	 */
	private $should_enqueue = false;

	/**
	 * Prevent duplicate enqueues.
	 *
	 * @var bool
	 */
	private $assets_enqueued = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_shortcode( 'filter_orbit', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ), 20 );

		if ( class_exists( 'WooCommerce' ) ) {
			add_action( 'woocommerce_before_shop_loop', array( $this, 'maybe_render_shop_filters' ), 15 );
		}
	}

	/**
	 * Enqueue assets only when the shortcode or shop sidebar is used.
	 *
	 * @return void
	 */
	public function maybe_enqueue_assets() {
		if ( $this->should_load_frontend_assets() ) {
			$this->enqueue_frontend_assets();
		}
	}

	/**
	 * Decide if storefront assets are needed on this request.
	 *
	 * @return bool
	 */
	private function should_load_frontend_assets() {
		if ( $this->should_enqueue || $this->page_has_shortcode() ) {
			return true;
		}

		$settings = Filter_Orbit::get_settings();

		return ! empty( $settings['enable_shop_sidebar'] ) && $this->is_shop_context();
	}

	/**
	 * Enqueue and localize the webpack storefront bundle.
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		if ( $this->assets_enqueued || ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		$js_path  = FILTER_ORBIT_PATH . 'assets/frontend/filter-orbit.js';
		$css_path = FILTER_ORBIT_PATH . 'assets/frontend/filter-orbit.css';

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		$this->assets_enqueued  = true;
		$this->should_enqueue   = true;

		$js_version  = filemtime( $js_path );
		$css_version = file_exists( $css_path ) ? filemtime( $css_path ) : FILTER_ORBIT_VERSION;

		if ( file_exists( $css_path ) ) {
			wp_enqueue_style(
				'filter-orbit-frontend',
				FILTER_ORBIT_URL . 'assets/frontend/filter-orbit.css',
				array(),
				$css_version
			);
		}

		wp_enqueue_script(
			'filter-orbit-frontend',
			FILTER_ORBIT_URL . 'assets/frontend/filter-orbit.js',
			array(),
			$js_version,
			true
		);

		wp_localize_script(
			'filter-orbit-frontend',
			'filterOrbit',
			array(
				'filters'  => $this->get_active_filters(),
				'products' => $this->get_shop_products(),
				'settings' => Filter_Orbit::get_settings(),
				'language' => Filter_Orbit::get_language_strings(),
			)
		);
	}

	/**
	 * Render filters on shop archive when enabled.
	 *
	 * @return void
	 */
	public function maybe_render_shop_filters() {
		$settings = Filter_Orbit::get_settings();

		if ( empty( $settings['enable_shop_sidebar'] ) ) {
			return;
		}

		$this->should_enqueue = true;
		echo $this->get_mount_markup(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Shortcode output.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public function render_shortcode( $atts = array() ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return '<p class="filter-orbit-notice">' . esc_html__( 'FilterOrbit requires WooCommerce to be active.', 'filter-orbit' ) . '</p>';
		}

		$this->should_enqueue = true;

		if ( ! $this->assets_enqueued ) {
			$this->enqueue_frontend_assets();
		}

		return $this->get_mount_markup();
	}

	/**
	 * Markup root node for the React storefront app.
	 *
	 * @return string
	 */
	private function get_mount_markup() {
		return '<div class="filter-orbit-root" data-filter-orbit></div>';
	}

	/**
	 * Detect shortcode in the current post content.
	 *
	 * @return bool
	 */
	private function page_has_shortcode() {
		if ( is_singular() ) {
			$post = get_post();

			if ( $post && ! empty( $post->post_content ) && has_shortcode( $post->post_content, 'filter_orbit' ) ) {
				return true;
			}
		}

		return (bool) apply_filters( 'filter_orbit_page_has_shortcode', false );
	}

	/**
	 * Whether the request is a WooCommerce catalog archive.
	 *
	 * @return bool
	 */
	private function is_shop_context() {
		return function_exists( 'is_shop' ) && (
			is_shop() ||
			is_product_category() ||
			is_product_tag() ||
			is_product_taxonomy()
		);
	}

	/**
	 * Get enabled filter definitions for the storefront.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function get_active_filters() {
		$filters = Filter_Orbit::get_filters();

		$enabled = array_filter(
			$filters,
			static function ( $filter ) {
				return ! empty( $filter['enabled'] );
			}
		);

		return array_values(
			array_map(
				array( __CLASS__, 'enrich_filter_definition' ),
				$enabled
			)
		);
	}

	/**
	 * Load products for the current shop context.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function get_shop_products() {
		$query = new WP_Query(
			array(
				'post_type'      => 'product',
				'post_status'    => 'publish',
				'posts_per_page' => 100,
				'fields'         => 'ids',
			)
		);

		$products = array();

		foreach ( $query->posts as $product_id ) {
			$product = wc_get_product( $product_id );

			if ( $product ) {
				$products[] = self::map_product( $product );
			}
		}

		return $products;
	}

	/**
	 * Map a WooCommerce product to the filter library shape.
	 *
	 * @param WC_Product $product WooCommerce product.
	 * @return array<string, mixed>
	 */
	public static function map_product( $product ) {
		$categories = wp_get_post_terms( $product->get_id(), 'product_cat', array( 'fields' => 'names' ) );
		$tags       = wp_get_post_terms( $product->get_id(), 'product_tag', array( 'fields' => 'names' ) );

		if ( is_wp_error( $categories ) ) {
			$categories = array();
		}
		if ( is_wp_error( $tags ) ) {
			$tags = array();
		}

		// Remove empty strings and re-index.
		$categories = array_values( array_filter( $categories, 'strlen' ) );
		$tags       = array_values( array_filter( $tags, 'strlen' ) );

		$price = $product->get_price();

		if ( '' === $price && $product->is_type( 'variable' ) ) {
			$price = $product->get_variation_price( 'min', true );
		}

		if ( '' === $price ) {
			$price = $product->get_regular_price();
		}

		$data = array(
			'id'          => (string) $product->get_id(),
			'title'       => $product->get_name(),
			'description' => wp_strip_all_tags( $product->get_short_description() ),
			'price'       => (float) $price,
			'currency'    => get_woocommerce_currency(),
			// Store as array so multi-category/tag products match all their values.
			'category'    => $categories,
			'brand'       => $tags,
			'rating'      => (float) $product->get_average_rating(),
			'imageUrl'    => wp_get_attachment_image_url( $product->get_image_id(), 'medium' ) ?: '',
			'isVariable'  => $product->is_type( 'variable' ),
		);

		self::map_product_attributes( $data, $product );

		if ( $product->is_type( 'variable' ) ) {
			self::map_variation_attributes( $data, $product );
		}

		return $data;
	}

	/**
	 * Merge parent product attributes onto the mapped payload.
	 *
	 * @param array<string, mixed> $data    Product payload.
	 * @param WC_Product           $product WooCommerce product.
	 * @return void
	 */
	private static function map_product_attributes( array &$data, $product ) {
		foreach ( $product->get_attributes() as $attribute ) {
			if ( $attribute->is_taxonomy() ) {
				$taxonomy = $attribute->get_name();
				$terms    = wp_get_post_terms( $product->get_id(), $taxonomy, array( 'fields' => 'names' ) );

				foreach ( $terms as $term_name ) {
					self::append_attribute_value( $data, $taxonomy, $term_name );
				}
				continue;
			}

			$field = sanitize_key( $attribute->get_name() );
			foreach ( $attribute->get_options() as $option ) {
				self::append_attribute_value( $data, $field, wc_clean( $option ) );
			}
		}
	}

	/**
	 * Collect unique attribute values from published variations.
	 *
	 * @param array<string, mixed> $data    Product payload.
	 * @param WC_Product_Variable  $product Variable product.
	 * @return void
	 */
	private static function map_variation_attributes( array &$data, $product ) {
		foreach ( $product->get_children() as $variation_id ) {
			if ( 'publish' !== get_post_status( $variation_id ) ) {
				continue;
			}

			$variation = wc_get_product( $variation_id );
			if ( ! $variation ) {
				continue;
			}

			foreach ( $variation->get_variation_attributes() as $attr_key => $value ) {
				if ( '' === $value ) {
					continue;
				}

				$field = self::variation_attribute_field( $attr_key );
				$label = self::attribute_option_label( $field, $value );
				self::append_attribute_value( $data, $field, $label );
			}
		}
	}

	/**
	 * Normalize a variation attribute key to a filter field name.
	 *
	 * @param string $attr_key Variation attribute key.
	 * @return string
	 */
	private static function variation_attribute_field( $attr_key ) {
		return sanitize_key( str_replace( 'attribute_', '', $attr_key ) );
	}

	/**
	 * Resolve a human-readable attribute label from a stored slug/value.
	 *
	 * @param string $field Attribute field / taxonomy name.
	 * @param string $value Attribute slug or custom value.
	 * @return string
	 */
	public static function attribute_option_label( $field, $value ) {
		if ( taxonomy_exists( $field ) ) {
			$term = get_term_by( 'slug', $value, $field );
			if ( $term && ! is_wp_error( $term ) ) {
				return $term->name;
			}
		}

		return wc_clean( $value );
	}

	/**
	 * Append a unique attribute value to a product field (as a list).
	 *
	 * @param array<string, mixed> $data  Product payload.
	 * @param string               $field Filter field key.
	 * @param string               $label Attribute label.
	 * @return void
	 */
	private static function append_attribute_value( array &$data, $field, $label ) {
		if ( '' === $label ) {
			return;
		}

		if ( ! isset( $data[ $field ] ) ) {
			$data[ $field ] = array( $label );
			return;
		}

		if ( ! is_array( $data[ $field ] ) ) {
			$data[ $field ] = array( $data[ $field ] );
		}

		if ( ! in_array( $label, $data[ $field ], true ) ) {
			$data[ $field ][] = $label;
		}
	}

	/**
	 * Fill missing checkbox options for WooCommerce attribute filters.
	 *
	 * @param array<string, mixed> $filter Filter definition.
	 * @return array<string, mixed>
	 */
	public static function enrich_filter_definition( $filter ) {
		if ( empty( $filter['options'] ) && ! empty( $filter['field'] ) ) {
			$options = self::get_field_options( $filter['field'] );
			if ( ! empty( $options ) ) {
				$filter['options'] = $options;
			}
		}

		return $filter;
	}

	/**
	 * Build checkbox options for a known filter field.
	 *
	 * Handles:
	 *   - category  → product_cat taxonomy terms
	 *   - brand/tags → product_tag taxonomy terms
	 *   - pa_*      → WooCommerce attribute taxonomy terms
	 *
	 * @param string $field Filter field key.
	 * @return array<int, array<string, string>>
	 */
	public static function get_field_options( $field ) {
		$taxonomy_map = array(
			'category' => 'product_cat',
			'brand'    => 'product_tag',
			'tags'     => 'product_tag',
			'tag'      => 'product_tag',
		);

		if ( isset( $taxonomy_map[ $field ] ) ) {
			$taxonomy = $taxonomy_map[ $field ];
		} elseif ( 0 === strpos( $field, 'pa_' ) && taxonomy_exists( $field ) ) {
			$taxonomy = $field;
		} else {
			return array();
		}

		$terms = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'hide_empty' => true,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return array();
		}

		return array_map(
			static function ( $term ) {
				return array(
					'value' => $term->name,
					'label' => $term->name,
					'count' => (int) $term->count,
				);
			},
			$terms
		);
	}
}
