# Repository purpose
This repo is an attempt to use wordpress (gutenberg) libraries to try to convert our existing shortcodes (\[shortcake_xxx\]) 
and the whole posts content to gutenberg blocks.

Process flow:

 - Use wp cli wrapper to query posts.   
 - Loop over results  
 - Use puppeteer to navigate to post and take screenshot of the post before  conversion.   
 - Grab post content, convert it to a core/freeform block using rawHandler.
 - Convert core/freeform block to individual blocks using rawHandler again. 
 - Save post content. 
 - Use puppeteer to navigate to post and take screenshot after conversion. 
 - Compare screenshots and log difference.


## Environment
Tested with 
- nodejs: v12.6.0
- npm: v6.9.0
- WP-CLI: v2.2.0

## Usage

Copy config.example.json to config.json.
Update config.json to match your env

Point wordpress_path to your local wordpress installation
Change wordpress_url to match your local.
Wp cli should be available globally to work.

```
{
  "planet4_blocks_category": "planet4-blocks",
  "wordpress_path": "/path",
  "wordpress_url": "https://www.planet4.test"
}
```

# TODO
A lot of things.

Currently will work only for posts/pages that do not have any gutenberg blok in their content.

Automate planet4-gutenberg-blocks registation. Use code from [planet4-plugin-gutenberg-blocks](https://github.com/greenpeace/planet4-plugin-gutenberg-blocks)
Currently planet4-plugin-gutenberg-blocks (parts of them) are hardcoded inside script.