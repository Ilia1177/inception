<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'Ylen' );

/** Database password */
define( 'DB_PASSWORD', 'aasdfg3_S' );

/** Database hostname */
define( 'DB_HOST', 'mariadb' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'PwHd!?xRZe5H(QhFM*,eJ8TE#E0w{1$cG!Nka5_a>oh<iBlnTCas5pWI_)~bGzTW' );
define( 'SECURE_AUTH_KEY',   'f>{G@T%C+.s)/`)C=*w[v$uhJp5:*09pa%w{Fno:TGX*_qt.~Lc-mHo8mq^%K%tj' );
define( 'LOGGED_IN_KEY',     '.uy%d:4)1RRUtlhpI,51,nKo/fm36YbEo|2)Ki]vO3EgEr~3BRJ}KSA5SwhQQup+' );
define( 'NONCE_KEY',         'h2Dh}L5>I_X1:IPT6C=<rLXZf`-r;=1q%Sll=$pd:&O)_3Mz^] Khz3-x>#QRZ7o' );
define( 'AUTH_SALT',         'BJ}%.!~3UhnE0GgS7k>$>0^hL^^w(apynp/xH+i%7rt^Rv~+$)SxRXg*k(w,<^*`' );
define( 'SECURE_AUTH_SALT',  '*!u:Zi10O.q,c-hHPGR^Z=|dwVJ@?rWT89G c^Ix;>5fUB|n5J0t]JGKY;wq(by2' );
define( 'LOGGED_IN_SALT',    '97|l{+7~&}<k4BN29l6$7H.w:m02fPBv*:#$.}45DPKcp!af!tl5rI,fqs5CEH?%' );
define( 'NONCE_SALT',        'BiQe@J=Q3Cl:$I=(mMYa<bj;/Tq8<zjY<i_$*JEmRTS65j~Iv[UPM>6Io<qAFeC$' );
define( 'WP_CACHE_KEY_SALT', 'eyV=@ZE{5wMYp)@1UAg?9JC+]o=<b0_y5S.8=V8+S1j&${7VB./cZd[Jl3Oo_s4;' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
