//-----------Load config----------------------------
const config = require('./config.json');

//-----------Load External dependencies-------------
const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const puppeteer = require('puppeteer');
const Window = require('window');
const window = new Window();
const wpCli = require('wpcli').default;


//-------START Define fake functions/objects--------------
Object.defineProperty(window, 'stopCallback', {
    value: () => {
        return false;
    }
});

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            matches: false,
            addListener: () => {
            },
            removeListener: () => {
            }
        };
    }
});

Object.defineProperty(window, 'getComputedStyle', {
    value: () => {
        return {
            getPropertyValue: () => {
            }
        };
    }
});
//

// Fake wp global object to allow freeform block registration.
let wp = {};
wp.oldEditor = {};
window.wp = wp;

// Registering objects in global namespace.
global.window = window;  // like in the browser
global.document = window.document;
global.navigator = window.navigator;

// Fake Mousetrap needed by wordpress libs.
let Mousetrap = require('mousetrap');
Mousetrap.stopCallback = function (e, element, combo) {
    return false;
};
global.Mousetrap = Mousetrap;

//-----------------END define fake functions/objects-------------------------------------------



//-------------Load WordPress dependencies-----------------------------
const wpblocks = require('@wordpress/blocks');
const block_library = require('@wordpress/block-library');

// Register gutenberg core blocks.
block_library.registerCoreBlocks();

// Get blocks categories.
// Register planet4 category.
let cat = wpblocks.getCategories();
cat.push({slug: config.planet4_blocks_category, name: 'Planet4 Blocks'});
wpblocks.setCategories(cat);

// const eddd = require('./editorIndex');

// Register planet4 blocks.
wpblocks.registerBlockType('planet4-blocks/submenu', {
    title: 'Submenu',
    icon: 'welcome-widgets-menus',
    category: 'planet4-blocks',
    supports: {
        multiple: false, // Use the block just once per post.
    },
    transforms: {
        from: [
            {
                type: 'shortcode',
                // Shortcode tag can also be an array of shortcode aliases
                // This `shortcode` definition will be used as a callback,
                // it is a function which expects an object with at least
                // a `named` key with `cover_type` property whose default value is 1.
                // See: https://simonsmith.io/destructuring-objects-as-function-parameters-in-es6
                tag: 'shortcake_submenu',
                attributes: {
                    submenu_style: {
                        type: 'integer',
                        shortcode: function (attributes) {
                            return Number(attributes.named.submenu_style);
                        }
                    },
                    title: {
                        type: 'string',
                        shortcode: function (attributes) {
                            return attributes.named.title;
                        }
                    },
                    levels: {
                        type: 'array',
                        shortcode: function (attributes) {
                            let levels = [];
                            if (attributes.named.heading1 > 0) {
                                let level = {
                                    heading: Number(attributes.named.heading1),
                                    link: attributes.named.link1 || false,
                                    style: attributes.named.style1 || 'none'
                                };
                                levels.push(Object.assign({}, level));

                                if (attributes.named.heading2 > 0) {
                                    let level = {
                                        heading: Number(attributes.named.heading2),
                                        link: attributes.named.link2 || false,
                                        style: attributes.named.style2 || 'none'
                                    };
                                    levels.push(Object.assign({}, level));

                                    if (attributes.named.heading3 > 0) {
                                        let level = {
                                            heading: Number(attributes.named.heading3),
                                            link: attributes.named.link3 || false,
                                            style: attributes.named.style3 || 'none'
                                        };
                                        levels.push(Object.assign({}, level));
                                    }
                                }
                            }
                            return levels;
                        },
                    }
                },
            },
        ]
    },
    attributes: {
        submenu_style: {
            type: 'integer',
            default: 1
        },
        title: {
            type: 'string',
        },
        levels: {
            type: 'array',
            default: [ {heading: 0, link: false, style: 'none'}]
        },
    },
});



//-------------Script start--------------------

// Initiliaze puppeteer instance.
let browser;
(async () => {
    // const browser = await puppeteer.launch();
    browser = await puppeteer.launch(
        {
            ignoreHTTPSErrors: true,
            headless: true
        }
    );
})();


// Get registered blocks.
//wpblocks.getBlockTypes().forEach((block) => {console.log(block.name)});

// Get one page using wp cli wrapper and process post.
wpCli('wp', ['post', 'list', '--post_type=page', '--posts_per_page=1', '--format=json', '--fields=ID,post_title,post_name,post_status,url,post_content'], {
    cwd: config.wordpress_path,
}).then(process_posts);


//-------------Script end--------------------







//-----------START functions------------------//
async function process_posts(result) {
    let posts = JSON.parse(result.stdout);
    posts.forEach((post) => process_post(post));
}

/**
 * Process each post
 *
 * Take screenshot
 * Retrieve post content
 * Convert post content
 * Take screenshot after conversion
 * Compare screenshots.
 *
 * @param post
 */
async function process_post(post) {

    // Create new page.
    // Navigate to post.
    // Take a screenshot of the post.
    let page = await browser.newPage();
    await page.goto(`${config.wordpress_url}/?p=${post.ID}`);
    await page.setViewport({ width: 1366, height: 1400});  // may need to adjust that for posts with much content.
    await page.screenshot({path: `./screenshots/before/${post.post_name}.png`});

    // Grab post content.
    let HTML = post.post_content;

    // Force post_content into a core/freeform block.
    let temp = '<!-- wp:core/freeform --> \n' + HTML + '\n <!-- /wp:core/freeform -->';

    // Convert post content enclosed in `freeform` block to blocks.
    // This is happening to emulate the wordpress gutenberg editor that converts the whole post content to a single freeform block.
    // Assuming that there is no other gutenberg block in the post content,
    // this will output a single core/freeform block.
    let blocks = wpblocks.rawHandler({HTML: temp});

    // Then pass the freeform block content to rawHandler again to convert the content to individual blocks
    // and transform our shortcodes to gutenberg blocks.
    blocks = wpblocks.rawHandler({HTML: wpblocks.getBlockContent(blocks[0])});

    // Debug blocks object.
    blocks.forEach((block) => {
        // if (block.name.includes('planet4-blocks')) {
        console.log(block);
        // block1 = block;
        // }
    });

    // Serialize blocks to html output.
    // wpblocks.serialize(blocks);

    fs.writeFile("temp_converted", wpblocks.serialize(blocks), async (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");

        // Save converted post content to temp file.
        var absolutePath = path.resolve("temp_converted");

        // Use temp file to update the post content using wp cli wrapper.
        wpCli('wp', ['post', 'update', post.ID, absolutePath], {
            cwd: config.wordpress_path,
        }).then(async (result) => {

            // Navigate to post and take screenshot after the update of post content.
            console.log("Successfully updated post content.");
            await page.goto('https://www.planet4.test/?p='+ post.ID);
            await page.screenshot({path: `./screenshots/after/${post.post_name}.png`});

            // Compare before/after post screenshots.
            const diffPixels = await compareScreenshots(post.post_name);
            console.log("Pixel diff: " + diffPixels);
            // resolve(diffPixels);
        });
    });
}

/**
 * Compare screenshots on pixel level.
 *
 * @param fileName
 * @returns {Promise<unknown>}
 */
function compareScreenshots(fileName) {
    return new Promise((resolve, reject) => {
        const img1 = fs.createReadStream(`./screenshots/before/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
        const img2 = fs.createReadStream(`./screenshots/after/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

        let filesRead = 0;

        function doneReading() {
            // Wait until both files are read.
            if (++filesRead < 2) return;

            // Do the visual diff.
            const diff = new PNG({width: img1.width, height: img2.height});
            const numDiffPixels = pixelmatch(
                img1.data, img2.data, diff.data, img1.width, img1.height,
                {threshold: 0.1});

            fs.writeFileSync('diff.png', PNG.sync.write(diff));
            resolve(numDiffPixels);
        }
    });
}
//-----------END functions------------------//
