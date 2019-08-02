/**
 * External dependencies
 */
const glob = require( 'glob' ).sync;

// Finds all packages which are transpiled with Babel to force Jest to use their source code.
// const transpiledPackageNames = glob( 'packages/*/src/index.js' )
// 	.map( ( fileName ) => fileName.split( '/' )[ 1 ] );

module.exports = {
	rootDir: '.',
	// moduleNameMapper: {
	// 	[ `@wordpress\\/(${ transpiledPackageNames.join( '|' ) })$` ]: 'packages/$1/src',
	// },
	preset: '@wordpress/jest-preset-default',
	// setupFiles: [
	// 	'<rootDir>/test/unit/config/gutenberg-phase.js',
	// ],
	testURL: 'http://localhost',
	testMatch: ["**/blocks-raw-handling(*.)+(spec|test).[jt]s?(x)"],
	testPathIgnorePatterns: [
		'/\.git/',
		'/node_modules/',
	],
};
