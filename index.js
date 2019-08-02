/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';

/**
 * WordPress dependencies
 */
// import {
//     getBlockContent,
//     pasteHandler,
//     rawHandler,
//     serialize,
// } from '@wordpress/blocks';

// const Window = require('window');
//
// let window = new Window();
// global.window = window;
import { JSDOM } from 'jsdom'
const { window } = new JSDOM();
global.window = window;

import { registerCoreBlocks } from '@wordpress/block-library';
// import {
//     rawHandler,
// } from '@wordpress/blocks';


// import blocks
// import 'core-js'; // <- at the top of your entry point

// const wpdata = require('@wordpress/blocks');
// const { apiFetch } = wp;
// const { registerStore } = wp.data;

// const { rawHandler } = wp.blocks;
// rawHandler();

const HTML = readFile( path.join( __dirname, 'fixtures/wordpress-convert.html' ) );
// expect( serialize( rawHandler( { HTML } ) ) ).toMatchSnapshot();