<?php
/**
 * WordPress admin integration.
 *
 * @package FilterOrbit
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers admin menus and enqueues the React admin app.
 */
class Filter_Orbit_Admin {

	/**
	 * Top-level menu slug.
	 */
	const MENU_SLUG = 'filter-orbit';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menus' ) );
		add_action( 'current_screen', array( $this, 'setup_admin_screen' ) );
		add_filter( 'admin_body_class', array( $this, 'admin_body_class' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'admin_head', array( $this, 'admin_page_styles' ) );
	}

	/**
	 * Register admin menu pages.
	 *
	 * @return void
	 */
	public function register_menus() {
		add_menu_page(
			__( 'FilterOrbit', 'filter-orbit' ),
			__( 'FilterOrbit', 'filter-orbit' ),
			'manage_woocommerce',
			self::MENU_SLUG,
			array( $this, 'render_admin_page' ),
			'dashicons-filter',
			56
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'Filter Designer', 'filter-orbit' ),
			__( 'Filter Designer', 'filter-orbit' ),
			'manage_woocommerce',
			self::MENU_SLUG,
			array( $this, 'render_admin_page' )
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'Settings', 'filter-orbit' ),
			__( 'Settings', 'filter-orbit' ),
			'manage_woocommerce',
			self::MENU_SLUG . '-settings',
			array( $this, 'render_admin_page' )
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'AI Settings', 'filter-orbit' ),
			__( 'AI Settings', 'filter-orbit' ),
			'manage_woocommerce',
			self::MENU_SLUG . '-ai',
			array( $this, 'render_admin_page' )
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'Language Settings', 'filter-orbit' ),
			__( 'Language', 'filter-orbit' ),
			'manage_woocommerce',
			self::MENU_SLUG . '-language',
			array( $this, 'render_admin_page' )
		);
	}

	/**
	 * Strip default WP / WooCommerce admin notices on our screens.
	 *
	 * @param WP_Screen $screen Current screen.
	 * @return void
	 */
	public function setup_admin_screen( $screen ) {
		if ( ! $this->is_filter_orbit_screen( $screen ) ) {
			return;
		}

		remove_all_actions( 'admin_notices' );
		remove_all_actions( 'all_admin_notices' );
		remove_all_actions( 'network_admin_notices' );
		remove_all_actions( 'user_admin_notices' );
	}

	/**
	 * Add body class for scoped admin CSS.
	 *
	 * @param string $classes Body classes.
	 * @return string
	 */
	public function admin_body_class( $classes ) {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( $screen && $this->is_filter_orbit_screen( $screen ) ) {
			$classes .= ' filter-orbit-admin-page';
		}

		return $classes;
	}

	/**
	 * Render the React mount point.
	 *
	 * @return void
	 */
	public function render_admin_page() {
		$page = $this->get_current_page();
		?>
		<div id="filter-orbit-admin-shell" class="filter-orbit-admin-shell">
			<div
				id="filter-orbit-admin-root"
				data-page="<?php echo esc_attr( $page ); ?>"
			></div>
		</div>
		<?php
	}

	/**
	 * Determine which React page to load.
	 *
	 * @return string
	 */
	private function get_current_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : self::MENU_SLUG;

		if ( self::MENU_SLUG . '-settings' === $page ) {
			return 'settings';
		}

		if ( self::MENU_SLUG . '-ai' === $page ) {
			return 'ai';
		}

		if ( self::MENU_SLUG . '-language' === $page ) {
			return 'language';
		}

		return 'designer';
	}

	/**
	 * Inline CSS to keep WP chrome from overlapping our app header.
	 *
	 * @return void
	 */
	public function admin_page_styles() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( ! $screen || ! $this->is_filter_orbit_screen( $screen ) ) {
			return;
		}
		?>
		<style id="filter-orbit-admin-layout-css">
			body.filter-orbit-admin-page #wpbody-content {
				padding-bottom: 0;
			}

			/* Hide any WP/WC notices or stray nodes outside our shell */
			body.filter-orbit-admin-page #wpbody-content > :not(.filter-orbit-admin-shell) {
				display: none !important;
			}

			body.filter-orbit-admin-page .filter-orbit-admin-shell {
				margin: 0;
				padding: 0;
				max-width: none;
			}

			body.filter-orbit-admin-page .woocommerce-layout__header,
			body.filter-orbit-admin-page .woo-nav-tab-wrapper,
			body.filter-orbit-admin-page #screen-meta,
			body.filter-orbit-admin-page #screen-meta-links {
				display: none !important;
			}
		</style>
		<?php
	}

	/**
	 * Whether the screen is a FilterOrbit admin page.
	 *
	 * @param WP_Screen $screen Screen object.
	 * @return bool
	 */
	private function is_filter_orbit_screen( $screen ) {
		return $screen && false !== strpos( $screen->id, self::MENU_SLUG );
	}

	/**
	 * Check if we are on a FilterOrbit admin page via query arg.
	 *
	 * @return bool
	 */
	private function is_current_plugin_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
		return 0 === strpos( $page, self::MENU_SLUG );
	}

	/**
	 * Enqueue admin scripts on plugin pages only.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function enqueue_admin_assets( $hook ) {
		if ( ! $this->is_plugin_screen( $hook ) ) {
			return;
		}

		$js_path  = FILTER_ORBIT_PATH . 'assets/admin/filter-orbit-admin.js';
		$css_path = FILTER_ORBIT_PATH . 'assets/admin/filter-orbit-admin.css';

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		$js_version  = filemtime( $js_path );
		$css_version = file_exists( $css_path ) ? filemtime( $css_path ) : FILTER_ORBIT_VERSION;

		if ( file_exists( $css_path ) ) {
			wp_enqueue_style(
				'filter-orbit-admin',
				FILTER_ORBIT_URL . 'assets/admin/filter-orbit-admin.css',
				array(),
				$css_version
			);
		}

		wp_enqueue_script(
			'filter-orbit-admin',
			FILTER_ORBIT_URL . 'assets/admin/filter-orbit-admin.js',
			array(),
			$js_version,
			true
		);

		wp_localize_script(
			'filter-orbit-admin',
			'filterOrbitAdmin',
			array(
				'apiUrl'        => rest_url( 'filter-orbit/v1/' ),
				'nonce'         => wp_create_nonce( 'wp_rest' ),
				'page'          => $this->get_current_page(),
				'pluginUrl'     => FILTER_ORBIT_URL,
				'adminUrl'      => admin_url(),
				'menuSlug'      => self::MENU_SLUG,
				'settingsUrl'   => admin_url( 'admin.php?page=' . self::MENU_SLUG . '-settings' ),
				'aiSettingsUrl'      => admin_url( 'admin.php?page=' . self::MENU_SLUG . '-ai' ),
				'languageSettingsUrl' => admin_url( 'admin.php?page=' . self::MENU_SLUG . '-language' ),
				'designerUrl'        => admin_url( 'admin.php?page=' . self::MENU_SLUG ),
				'i18n'               => array(
					'pluginName'       => __( 'FilterOrbit', 'filter-orbit' ),
					'filterDesigner'   => __( 'Filter Designer', 'filter-orbit' ),
					'settings'         => __( 'Settings', 'filter-orbit' ),
					'aiSettings'       => __( 'AI Settings', 'filter-orbit' ),
					'languageSettings' => __( 'Language', 'filter-orbit' ),
					'saved'          => __( 'Saved successfully.', 'filter-orbit' ),
					'saveError'      => __( 'Could not save. Please try again.', 'filter-orbit' ),
				),
			)
		);
	}

	/**
	 * Check if the current screen belongs to this plugin.
	 *
	 * @param string $hook Admin hook suffix.
	 * @return bool
	 */
	private function is_plugin_screen( $hook ) {
		return false !== strpos( $hook, self::MENU_SLUG );
	}
}
