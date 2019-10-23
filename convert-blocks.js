//-----------Load config----------------------------
const config = require('./config.json');

//-----------Load External dependencies-------------
const fs = require('fs');
const path = require('path');
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
global.wp = wp;  // like in the browser
global.window = window;  // like in the browser
global.document = window.document;
global.navigator = window.navigator;
wp.i18n = require('@wordpress/i18n');
wp.data = require('@wordpress/data');

// Fake Mousetrap needed by wordpress libs.
let Mousetrap = require('mousetrap');
Mousetrap.stopCallback = function (e, element, combo) {
    return false;
};
global.Mousetrap = Mousetrap;

//-----------------END define fake functions/objects-------------------------------------------



//-------------Load WordPress dependencies-----------------------------
const wpblocks = require('@wordpress/blocks');
// global.wpblocks = wpblocks;  // like in the browser
const block_library = require('@wordpress/block-library');

// Register gutenberg core blocks.
block_library.registerCoreBlocks();

// Get blocks categories.
// Register planet4 category.
let cat = wpblocks.getCategories();
cat.push({slug: config.planet4_blocks_category, name: 'Planet4 Blocks'});
wpblocks.setCategories(cat);
// const jml = require('./p4blocks');


var t = wpblocks.registerBlockType, n = wp.i18n.__, o = wp.data.withSelect;


wpblocks.registerBlockType("planet4-blocks/articles", {
    title: "Articles",
    icon: "excerpt-view",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_articles",
            attributes: {
                article_heading: {
                    type: "string", shortcode: function (e) {
                        return e.named.article_heading
                    }
                }, articles_description: {
                    type: "string", shortcode: function (e) {
                        return e.named.articles_description
                    }
                }, article_count: {
                    type: "string", shortcode: function (e) {
                        return e.named.article_count
                    }
                }, read_more_text: {
                    type: "string", shortcode: function (e) {
                        return e.named.read_more_text
                    }
                }, read_more_link: {
                    type: "string", shortcode: function (e) {
                        return e.named.read_more_link
                    }
                }, button_link_new_tab: {
                    type: "string", shortcode: function (e) {
                        return e.named.button_link_new_tab
                    }
                }, ignore_categories: {
                    type: "boolean", shortcode: function (e) {
                        return e.named.ignore_categories
                    }
                }, tags: {
                    type: "string", shortcode: function (e) {
                        return e.named.tags ? e.named.tags.split(",") : []
                    }
                }, post_types: {
                    type: "string", shortcode: function (e) {
                        return e.named.tags ? e.named.post_types.split(",") : []
                    }
                }, posts: {
                    type: "string", shortcode: function (e) {
                        return e.named.tags ? e.named.posts.split(",") : []
                    }
                }, exclude_post_id: {
                    type: "integer", shortcode: function (e) {
                        return Number(e.named.exclude_post_id)
                    }
                }
            }
        }]
    },
    attributes: {
        article_heading: {type: "string"},
        articles_description: {type: "string"},
        article_count: {type: "integer", default: 3},
        tags: {type: "array", default: []},
        posts: {type: "array", default: []},
        post_types: {type: "array", default: []},
        read_more_text: {type: "string"},
        read_more_link: {type: "string", default: ""},
        button_link_new_tab: {type: "boolean", default: !1},
        exclude_post_id: {type: "integer", default: ""}
    },
    edit: (0, wp.data.withSelect)((function (e) {
        var t = {hide_empty: !1, per_page: 50}, n = e("core").getEntityRecords, o = n("taxonomy", "post_tag", t);
        return {postTypesList: n("taxonomy", "p4-page-type", t), tagsList: o}
    }))((function (e) {
        var t = e.postTypesList, n = e.tagsList, o = e.isSelected, a = e.attributes, r = e.setAttributes;
        if (!n || !t) return "Populating block's fields...";
        if (n && 0 === n.length || t && 0 === t.length) return "Populating block's fields...";
        return Object(l.createElement)(C, i()({}, a, {
            isSelected: o,
            tagsList: n,
            postTypesList: t,
            onSelectedTagsChange: function (e) {
                r({tags: e})
            },
            onTitleChange: function (e) {
                r({article_heading: e})
            },
            onDescriptionChange: function (e) {
                r({articles_description: e})
            },
            onCountChange: function (e) {
                r({article_count: Number(e)})
            },
            onSelectedPostsChange: function (e) {
                r({posts: e})
            },
            onSelectedPostTypesChange: function (e) {
                r({post_types: e})
            },
            onReadmoretextChange: function (e) {
                r({read_more_text: e})
            },
            onReadmorelinkChange: function (e) {
                r({read_more_link: e})
            },
            onButtonLinkTabChange: function (e) {
                r({button_link_new_tab: e})
            },
            onIgnoreCategoriesChange: function (e) {
                r({ignore_categories: e})
            }
        }))
    })),
    save: function () {
        return null
    }
});

wpblocks.registerBlockType("planet4-blocks/carousel-header", {
    title: "Carousel Header",
    icon: "welcome-widgets-menus",
    category: "planet4-blocks",
    supports: {multiple: !1},
    transforms: {
        from: [{
            type: "shortcode", tag: "shortcake_carousel_header", attributes: {
                block_style: {
                    type: "string", shortcode: function (e) {
                        return Number(e.named.block_style)
                    }
                }, carousel_autoplay: {
                    type: "string", shortcode: function (e) {
                        return e.named.carousel_autoplay
                    }
                }, slides: {
                    type: "array", shortcode: function (e) {
                        var t = function (e) {
                            switch (e) {
                                case"left top":
                                    return {x: 0, y: 0};
                                case"center top":
                                    return {x: .5, y: 0};
                                case"right top":
                                    return {x: 1, y: 0};
                                case"left center":
                                    return {x: 0, y: .5};
                                case"center center":
                                    return {x: .5, y: .5};
                                case"right center":
                                    return {x: 1, y: .5};
                                case"left bottom":
                                    return {x: 0, y: 1};
                                case"center bottom":
                                    return {x: .5, y: 1};
                                case"right bottom":
                                    return {x: 1, y: 1}
                            }
                        }, n = [];
                        if (e.named.image_1) {
                            var o = {
                                image: Number(e.named.image_1),
                                header: e.named.header_1,
                                header_size: e.named.header_size_1,
                                subheader: e.named.subheader_1,
                                description: e.named.description_1,
                                link_text: e.named.link_text_1,
                                link_url: e.named.link_url_1,
                                focal_points: t(e.named.focus_image_1)
                            };
                            if (n.push(Object.assign({}, o)), e.named.image_2) {
                                var i = {
                                    image: Number(e.named.image_2),
                                    header: e.named.header_2,
                                    header_size: e.named.header_size_2,
                                    subheader: e.named.subheader_2,
                                    description: e.named.description_2,
                                    link_text: e.named.link_text_2,
                                    link_url: e.named.link_url_2,
                                    focal_points: t(e.named.focus_image_2)
                                };
                                if (n.push(Object.assign({}, i)), e.named.image_3) {
                                    var a = {
                                        image: Number(e.named.image_3),
                                        header: e.named.header_3,
                                        header_size: e.named.header_size_3,
                                        subheader: e.named.subheader_3,
                                        description: e.named.description_3,
                                        link_text: e.named.link_text_3,
                                        link_url: e.named.link_url_3,
                                        focal_points: t(e.named.focus_image_3)
                                    };
                                    if (n.push(Object.assign({}, a)), e.named.image_4) {
                                        var r = {
                                            image: Number(e.named.image_4),
                                            header: e.named.header_4,
                                            header_size: e.named.header_size_4,
                                            subheader: e.named.subheader_4,
                                            description: e.named.description_4,
                                            link_text: e.named.link_text_4,
                                            link_url: e.named.link_url_4,
                                            focal_points: t(e.named.focus_image_4)
                                        };
                                        n.push(Object.assign({}, r))
                                    }
                                }
                            }
                        }
                        return n
                    }
                }
            }
        }]
    },
    attributes: {
        block_style: {type: "string"},
        carousel_autoplay: {type: "boolean"},
        slides: {
            type: "array",
            default: [{
                image: 0,
                focal_points: {x: .5, y: .5},
                header: "",
                header_size: "h1",
                subheader: "",
                description: "",
                link_text: "",
                link_url: "",
                link_url_new_tab: !1
            }]
        }
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(I, i()({}, n, {
            isSelected: t, onBlockStyleChange: function (e) {
                o({block_style: e})
            }, onCarouselAutoplayChange: function (e) {
                o({carousel_autoplay: e})
            }, onTitleChange: function (e) {
                o({title: e})
            }, onImageChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].image = null !== t ? t : 0, o({slides: i})
            }, onHeaderChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].header = t, o({slides: i})
            }, onSubheaderChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].subheader = t, o({slides: i})
            }, onHeaderSizeChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].header_size = t, o({slides: i})
            }, onDescriptionChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].description = t, o({slides: i})
            }, onLinkTextChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].link_text = t, o({slides: i})
            }, onLinkUrlChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].link_url = t, o({slides: i})
            }, onLinkNewTabChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                i[e].link_url_new_tab = t, o({slides: i})
            }, onFocalPointsChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.slides));
                if (null !== t) {
                    var a = JSON.parse(JSON.stringify(t));
                    i[e].focal_points = a
                } else i[e].focal_points = null;
                o({slides: i})
            }, addSlide: function () {
                o({
                    slides: n.slides.concat({
                        image: 0,
                        focal_points: {x: .5, y: .5},
                        header: "",
                        header_size: "h1",
                        subheader: "",
                        description: "",
                        link_text: "",
                        link_url: "",
                        link_url_new_tab: !1
                    })
                })
            }, removeSlide: function () {
                o({slides: n.slides.slice(0, -1)})
            }
        }))
    },
    save: function () {
        return null
    }
});

wpblocks.registerBlockType("planet4-blocks/columns", {
    title: "Columns",
    icon: "grid-view",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode", tag: "shortcake_columns", attributes: {
                columns_block_style: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.columns_block_style;
                        return void 0 === t ? "" : t
                    }
                }, columns_title: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.columns_title;
                        return void 0 === t ? "" : t
                    }
                }, columns_description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.columns_description;
                        return void 0 === t ? "" : t
                    }
                }, columns: {
                    type: "array", shortcode: function (e) {
                        var t = [];
                        if (e.named.title_1) {
                            var n = {title: e.named.title_1, description: e.named.description_1 || ""};
                            if ("no_image" != e.named.columns_block_style && (n.attachment = e.named.attachment_1 || !1), n.cta_link = e.named.link_1 || "", n.link_new_tab = e.named.link_new_tab_1 || !1, n.cta_text = e.named.cta_text_1 || "", t.push(Object.assign({}, n)), e.named.title_2) {
                                var o = {title: e.named.title_2, description: e.named.description_2 || ""};
                                if ("no_image" != e.named.columns_block_style && (o.attachment = e.named.attachment_2 || !1), o.cta_link = e.named.link_2 || "", o.link_new_tab = e.named.link_new_tab_2 || !1, o.cta_text = e.named.cta_text_2 || "", t.push(Object.assign({}, o)), e.named.title_3) {
                                    var i = {title: e.named.title_3, description: e.named.description_3 || ""};
                                    if ("no_image" != e.named.columns_block_style && (i.attachment = e.named.attachment_3 || !1), i.cta_link = e.named.link_3 || "", i.link_new_tab = e.named.link_new_tab_3 || !1, i.cta_text = e.named.cta_text_3 || "", t.push(Object.assign({}, i)), e.named.title_4) {
                                        var a = {title: e.named.title_4, description: e.named.description_4 || ""};
                                        "no_image" != e.named.columns_block_style && (a.attachment = e.named.attachment_4 || !1), a.cta_link = e.named.link_4 || "", a.link_new_tab = e.named.link_new_tab_4 || !1, a.cta_text = e.named.cta_text_4 || "", t.push(Object.assign({}, a))
                                    }
                                }
                            }
                        }
                        return t
                    }
                }
            }
        }]
    },
    attributes: {
        columns_block_style: {type: "string"},
        columns_title: {type: "string"},
        columns_description: {type: "string"},
        columns: {
            type: "array",
            default: [],
            title: {type: "string"},
            description: {type: "string"},
            attachment: {type: "integer"},
            cta_link: {type: "string"},
            link_new_tab: {type: "string"},
            cta_text: {type: "string"}
        }
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(B, i()({}, n, {
            isSelected: t, onSelectedLayoutChange: function (e) {
                if (o({columns_block_style: e}), "no_image" == e) {
                    var t = n.columns;
                    if (0 < t.length) {
                        var i, a = A()(t);
                        for (i = 0; i < t.length; i++) a[i].attachment = 0;
                        o({columns: a})
                    }
                }
            }, onTitleChange: function (e) {
                o({columns_title: e})
            }, onDescriptionChange: function (e) {
                o({columns_description: e})
            }, onSelectImage: function (e, t) {
                var i = n.columns, a = t.id, r = A()(i);
                r[e].attachment = a, o({columns: r})
            }, onSelectURL: function (e, t) {
                var i = n.columns, a = null.id, r = A()(i);
                r[e].attachment = a, o({columns: r})
            }, addColumn: function () {
                var e = n.columns;
                e.length < 4 && o({
                    columns: [].concat(A()(e), [{
                        title: "",
                        description: "",
                        attachment: 0,
                        cta_link: "",
                        cta_text: "",
                        link_new_tab: ""
                    }])
                })
            }, removeColumn: function () {
                o({columns: n.columns.slice(0, -1)})
            }, onUploadError: function (e) {
                var t = e.message;
                console.log(t)
            }, onColumnHeaderChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.columns));
                i[e].title = t, o({columns: i})
            }, onColumnDescriptionChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.columns));
                i[e].description = t, o({columns: i})
            }, onCTALinkChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.columns));
                i[e].cta_link = t, o({columns: i})
            }, onLinkNewTabChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.columns));
                i[e].link_new_tab = t, o({columns: i})
            }, onCTAButtonTextChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.columns));
                i[e].cta_text = t, o({columns: i})
            }
        }))
    },
    save: function () {
        return null
    }
})

wpblocks.registerBlockType("planet4-blocks/cookies", {
    title: "Cookies",
    icon: "welcome-view-site",
    category: "planet4-blocks",
    supports: {multiple: !1},
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_cookies",
            attributes: {
                title: {
                    type: "string", shortcode: function (e) {
                        return e.named.title
                    }
                }, description: {
                    type: "string", shortcode: function (e) {
                        return e.named.description
                    }
                }, necessary_cookies_name: {
                    type: "string", shortcode: function (e) {
                        return e.named.necessary_cookies_name
                    }
                }, necessary_cookies_description: {
                    type: "string", shortcode: function (e) {
                        return e.named.necessary_cookies_description
                    }
                }, all_cookies_name: {
                    type: "string", shortcode: function (e) {
                        return e.named.all_cookies_name
                    }
                }, all_cookies_description: {
                    type: "string", shortcode: function (e) {
                        return e.named.all_cookies_description
                    }
                }
            }
        }]
    },
    attributes: {
        title: {type: "string"},
        description: {type: "string"},
        necessary_cookies_name: {type: "string"},
        necessary_cookies_description: {type: "string"},
        all_cookies_name: {type: "string"},
        all_cookies_description: {type: "string"}
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(R, i()({}, n, {
            isSelected: t, onTitleChange: function (e) {
                o({title: e})
            }, onDescriptionChange: function (e) {
                o({description: e})
            }, onNecessaryCookiesNameChange: function (e) {
                o({necessary_cookies_name: e})
            }, onNecessaryCookiesDescriptionChange: function (e) {
                o({necessary_cookies_description: e})
            }, onAllCookiesNameChange: function (e) {
                o({all_cookies_name: e})
            }, onAllCookiesDescriptionChange: function (e) {
                o({all_cookies_description: e})
            }
        }))
    },
    save: function () {
        return null
    }
})


t("planet4-blocks/counter", {
    title: "Counter",
    icon: "dashboard",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_counter",
            attributes: {
                style: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.style;
                        return void 0 === t ? "plain" : t
                    }
                }, title: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.title;
                        return void 0 === t ? "" : t
                    }
                }, description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.description;
                        return void 0 === t ? "" : t
                    }
                }, completed: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.completed;
                        return Number(void 0 === t ? 0 : t)
                    }
                }, completed_api: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.completed_api, n = void 0 === t ? "" : t;
                        return "" === n ? null : n
                    }
                }, target: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.target;
                        return Number(void 0 === t ? 0 : t)
                    }
                }, text: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.text;
                        return void 0 === t ? "" : t
                    }
                }
            }
        }]
    },
    attributes: {
        title: {type: "string"},
        description: {type: "string"},
        style: {type: "string", default: "plain"},
        completed: {type: "integer"},
        completed_api: {type: "string"},
        target: {type: "integer"},
        text: {type: "string"}
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(D, i()({}, n, {
            isSelected: t, onTitleChange: function (e) {
                o({title: e})
            }, onDescriptionChange: function (e) {
                o({description: e})
            }, onSelectedLayoutChange: function (e) {
                o({style: e})
            }, onCompletedChange: function (e) {
                o({completed: Number(e)})
            }, onCompletedAPIChange: function (e) {
                o({completed_api: e})
            }, onTargetChange: function (e) {
                o({target: Number(e)})
            }, onTextChange: function (e) {
                o({text: e})
            }
        }))
    },
    save: function () {
        return null
    }
});


wpblocks.registerBlockType("planet4-blocks/covers", {
    title: "Covers",
    icon: "slides",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_newcovers",
            attributes: {
                cover_type: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.cover_type;
                        return void 0 === t ? "1" : t
                    }
                }, title: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.title;
                        return void 0 === t ? "" : t
                    }
                }, description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.description;
                        return void 0 === t ? "" : t
                    }
                }, covers_view: {
                    type: "string", shortcode: function (e) {
                        switch (e.named.covers_view) {
                            case"0":
                                return "1";
                            case"3":
                                return "2";
                            case"1":
                                return "3"
                        }
                        return "1"
                    }
                }, tags: {
                    type: "array", shortcode: function (e) {
                        var t = e.named.tags;
                        return (void 0 === t ? "" : t).split(",").map((function (e) {
                            return Number(e)
                        })).filter((function (e) {
                            return e > 0
                        }))
                    }
                }, post_types: {
                    type: "array", shortcode: function (e) {
                        var t = e.named.post_types;
                        return (void 0 === t ? "" : t).split(",").map((function (e) {
                            return Number(e)
                        })).filter((function (e) {
                            return e > 0
                        }))
                    }
                }, posts: {
                    type: "array", shortcode: function (e) {
                        var t = e.named.posts;
                        return (void 0 === t ? "" : t).split(",").map((function (e) {
                            return Number(e)
                        })).filter((function (e) {
                            return e > 0
                        }))
                    }
                }
            }
        }]
    },
    attributes: {
        title: {type: "string"},
        description: {type: "string"},
        tags: {type: "array", default: []},
        posts: {type: "array", default: []},
        post_types: {type: "array", default: []},
        covers_view: {type: "string", default: "1"},
        cover_type: {type: "string"}
    },
    edit: (0, wp.data.withSelect)((function (e) {
        var t = e("core").getEntityRecords, n = t("taxonomy", "post_tag", {hide_empty: !1, per_page: -1});
        return {postTypesList: t("taxonomy", "p4-page-type"), tagsList: n}
    }))((function (e) {
        var t = e.postTypesList, n = e.tagsList, o = e.isSelected, a = e.attributes, r = e.setAttributes;
        if (!n || !t) return "Populating block's fields...";
        if (!n && 0 === !n.length) return "No tags...";
        return Object(l.createElement)(M, i()({}, a, {
            isSelected: o,
            tagsList: n,
            postTypesList: t,
            onSelectedTagsChange: function (e) {
                r({tags: e})
            },
            onSelectedLayoutChange: function (e) {
                "1" === e && r({post_types: []}), "2" === e && r({post_types: []}), r({cover_type: e, posts: []})
            },
            onTitleChange: function (e) {
                r({title: e})
            },
            onDescriptionChange: function (e) {
                r({description: e})
            },
            onSelectedPostsChange: function (e) {
                r({posts: e})
            },
            onSelectedPostTypesChange: function (e) {
                r({post_types: e})
            },
            onRowsChange: function (e) {
                r({covers_view: e})
            }
        }))
    })),
    save: function () {
        return null
    }
});


t("planet4-blocks/gallery", {
    title: n("Gallery", "p4ge"),
    icon: "format-gallery",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_gallery",
            attributes: {
                gallery_block_style: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.gallery_block_style;
                        return Number(void 0 === t ? "" : t)
                    }
                }, gallery_block_title: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.gallery_block_title;
                        return void 0 === t ? "" : t
                    }
                }, gallery_block_description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.gallery_block_description;
                        return void 0 === t ? "" : t
                    }
                }, multiple_image: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.multiple_image;
                        return void 0 === t ? "" : t
                    }
                }, gallery_block_focus_points: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.gallery_block_focus_points;
                        return void 0 === t ? "" : t
                    }
                }
            }
        }]
    },
    attributes: {
        gallery_block_style: {type: "number", default: 1},
        gallery_block_title: {type: "string"},
        gallery_block_description: {type: "string"},
        multiple_image: {type: "string"},
        gallery_block_focus_points: {type: "string"},
        image_data: {type: "object", default: []}
    },
    edit: o((function (e, t) {
        var n = t.attributes.multiple_image, o = [];
        if (n) {
            var i = n.split(",");
            $.each(i, (function (t, n) {
                var i = e("core").getMedia(n);
                i && (o[n] = i.media_details.sizes.medium.source_url)
            }))
        }
        return {image_urls_array: o}
    }))((function (e) {
        var t = e.image_urls_array, n = e.isSelected, o = e.attributes, a = e.setAttributes, r = o.image_data,
            s = o.gallery_block_focus_points;
        if (0 == r.length && 0 < t.length) {
            var c = [], p = s ? JSON.parse(s) : {};
            for (var u in t) {
                var d = void 0, g = void 0;
                if ($.isEmptyObject(p)) d = 50, g = 50; else {
                    var m = p[u].replace(/\%/g, "").split(" "), h = J()(m, 2);
                    d = h[0], g = h[1]
                }
                c.push({url: t[u], focalPoint: {x: parseInt(d) / 100, y: parseInt(g) / 100}, id: u})
            }
            a({image_data: c})
        }
        return Object(l.createElement)(G, i()({}, o, {
            isSelected: n, onSelectedLayoutChange: function (e) {
                a({gallery_block_style: Number(e)})
            }, onSelectImage: function (e) {
                var t = [], n = [];
                for (var o in e) {
                    t.push(e[o].id);
                    var i = e[o].id;
                    n.push({url: e[o].url, focalPoint: {x: .5, y: .5}, id: i})
                }
                a({multiple_image: t.join(",")}), a({image_data: n})
            }, onTitleChange: function (e) {
                a({gallery_block_title: e})
            }, onDescriptionChange: function (e) {
                a({gallery_block_description: e})
            }, onFocalPointChange: function (e, t) {
                var n = [], o = {};
                r.map((function (i) {
                    if (i.id === e) {
                        var a = parseFloat(t.x).toFixed(2), r = parseFloat(t.y).toFixed(2);
                        n.push({url: i.url, focalPoint: {x: a, y: r}, id: e}), o[e] = 100 * a + "% " + 100 * r + "%"
                    } else {
                        n.push(i);
                        var l = i.id;
                        o[l] = parseInt(100 * i.focalPoint.x) + "% " + parseInt(100 * i.focalPoint.y) + "%"
                    }
                })), a({gallery_block_focus_points: JSON.stringify(o)}), a({image_data: n})
            }, onRemoveImages: function () {
                a({multiple_image: ""}), a({gallery_block_focus_points: ""}), a({image_data: []})
            }
        }))
    })),
    save: function () {
        return null
    }
});


t("planet4-blocks/happypoint", {
    title: n("Happypoint", "p4ge"),
    icon: "format-image",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_happy_point",
            attributes: {
                opacity: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.opacity;
                        return void 0 === t ? "" : t
                    }
                }, id: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.background;
                        return Number(t)
                    }
                }, focus_image: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.focus_image;
                        return void 0 === t ? "" : t
                    }
                }, mailing_list_iframe: {
                    type: "boolean", shortcode: function (e) {
                        return "true" == e.named.mailing_list_iframe
                    }
                }, iframe_url: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.iframe_url;
                        return void 0 === t ? "" : t
                    }
                }
            }
        }]
    },
    attributes: {
        focus_image: {type: "string"},
        opacity: {type: "number", default: 60},
        mailing_list_iframe: {type: "boolean"},
        iframe_url: {type: "string"},
        id: {type: "number"},
        load_iframe: {type: "boolean", default: !1}
    },
    edit: o((function (e, t) {
        var n = t.attributes.id, o = "";
        return n && 0 < n && (o = e("core").getMedia(n)) && (o = o.media_details.sizes.medium.source_url), {img_url: o}
    }))((function (e) {
        var t = e.img_url, n = e.isSelected, o = e.attributes, a = e.setAttributes;
        return Object(l.createElement)(q, i()({}, o, {
            isSelected: n, url: t, onSelectImage: function (e) {
                var t = e.id;
                a({id: t})
            }, onOpacityChange: function (e) {
                a({opacity: e})
            }, onMailingListIframeChange: function (e) {
                a({mailing_list_iframe: e})
            }, onIframeUrlChange: function (e) {
                a({iframe_url: e})
            }, onFocalPointChange: function (e) {
                var t = e.x, n = e.y;
                t = parseFloat(t).toFixed(2), n = parseFloat(n).toFixed(2), a({focus_image: 100 * t + "% " + 100 * n + "%"})
            }, onRemoveImages: function () {
                a({id: -1}), a({focus_image: ""})
            }
        }))
    })),
    save: function () {
        return null
    }
});

wpblocks.registerBlockType("planet4-blocks/media-video", {
    title: "Media block",
    icon: "format-video",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_media_video",
            attributes: {
                video_title: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.video_title;
                        return void 0 === t ? "" : t
                    }
                }, description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.description;
                        return void 0 === t ? "" : t
                    }
                }, youtube_id: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.youtube_id;
                        return void 0 === t ? "" : t
                    }
                }, video_poster_img: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.video_poster_img;
                        return void 0 === t ? "" : t
                    }
                }
            }
        }]
    },
    attributes: {
        video_title: {type: "string"},
        description: {type: "string"},
        youtube_id: {type: "string"},
        video_poster_img: {type: "integer"}
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(V, i()({}, n, {
            isSelected: t, onTitleChange: function (e) {
                o({video_title: e})
            }, onDescriptionChange: function (e) {
                o({description: e})
            }, onMediaUrlChange: function (e) {
                o({youtube_id: e})
            }, onSelectImage: function (e) {
                var t = e.id;
                o({video_poster_img: t})
            }, onSelectURL: function (e) {
                e.url, o({id: null})
            }, onUploadError: function (e) {
                var t = e.message;
                console.log(t)
            }
        }))
    },
    save: function () {
        return null
    }
});

wpblocks.registerBlockType("planet4-blocks/social-media", {
    title: (0, wp.i18n.__)("Social Media", "p4ge"),
    icon: "share",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_social_media",
            attributes: {
                title: {
                    type: "string", shortcode: function (e) {
                        return e.named.title
                    }
                }, description: {
                    type: "string", shortcode: function (e) {
                        return e.named.description
                    }
                }, embed_type: {
                    type: "string", shortcode: function (e) {
                        return e.named.embed_type
                    }
                }, facebook_page_tab: {
                    type: "string", shortcode: function (e) {
                        return e.named.facebook_page_tab
                    }
                }, social_media_url: {
                    type: "string", shortcode: function (e) {
                        return e.named.social_media_url
                    }
                }, alignment_class: {
                    type: "string", shortcode: function (e) {
                        return e.named.alignment_class
                    }
                }
            }
        }]
    },
    attributes: {
        title: {type: "string", default: ""},
        description: {type: "string", default: ""},
        embed_type: {type: "string", default: "oembed"},
        facebook_page_tab: {type: "string", default: "timeline"},
        social_media_url: {type: "string", default: ""},
        alignment_class: {type: "string", default: ""}
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(W, i()({}, n, {
            isSelected: t, onTitleChange: function (e) {
                o({title: e})
            }, onDescriptionChange: function (e) {
                o({description: e})
            }, onEmbedTypeChange: function (e) {
                o({embed_type: e})
            }, onFacebookPageTabChange: function (e) {
                o({facebook_page_tab: e})
            }, onSocialMediaUrlChange: function (e) {
                o({social_media_url: e})
            }, onAlignmentChange: function (e) {
                o({alignment_class: e})
            }
        }))
    },
    save: function () {
        return null
    }
});

t("planet4-blocks/split-two-columns", {
    title: n("Split Two Columns", "p4ge"),
    icon: "editor-table",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode", tag: "shortcake_split_two_columns", attributes: {
                select_issue: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.select_issue, n = void 0 === t ? "" : t;
                        return Number(n) > 0 ? Number(n) : null
                    }
                }, title: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.title;
                        return void 0 === t ? "" : t
                    }
                }, issue_description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.issue_description;
                        return void 0 === t ? "" : t
                    }
                }, issue_link_text: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.issue_link_text;
                        return void 0 === t ? "" : t
                    }
                }, issue_link_path: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.issue_link_path;
                        return void 0 === t ? "" : t
                    }
                }, issue_image: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.issue_image, n = void 0 === t ? "" : t;
                        return Number(n) > 0 ? Number(n) : null
                    }
                }, focus_issue_image: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.focus_issue_image;
                        return void 0 === t ? "" : t
                    }
                }, select_tag: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.select_tag, n = void 0 === t ? "" : t;
                        return Number(n) > 0 ? Number(n) : null
                    }
                }, tag_description: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.tag_description;
                        return void 0 === t ? "" : t
                    }
                }, button_text: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.button_text;
                        return void 0 === t ? "" : t
                    }
                }, button_link: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.button_link;
                        return void 0 === t ? "" : t
                    }
                }, tag_image: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.tag_image, n = void 0 === t ? "" : t;
                        return Number(n) > 0 ? Number(n) : null
                    }
                }, focus_tag_image: {
                    type: "string", shortcode: function (e) {
                        var t = e.named.focus_tag_image;
                        return void 0 === t ? "" : t
                    }
                }
            }
        }]
    },
    attributes: {
        select_issue: {type: "number", default: 0},
        title: {type: "string"},
        issue_description: {type: "string"},
        issue_link_text: {type: "string"},
        issue_link_path: {type: "string"},
        issue_image: {type: "number"},
        focus_issue_image: {type: "string"},
        select_tag: {type: "number", default: 0},
        tag_description: {type: "string"},
        button_text: {type: "string"},
        button_link: {type: "string"},
        tag_image: {type: "number"},
        focus_tag_image: {type: "string"}
    },
    edit: o((function (e, t) {
        var n = e("core").getEntityRecords, o = n("taxonomy", "post_tag", {hide_empty: !1, per_page: 50}),
            i = n("postType", "page", {
                per_page: -1,
                sort_order: "asc",
                sort_column: "post_title",
                parent: window.p4ge_vars.planet4_options.explore_page,
                post_status: "publish"
            }), a = t.attributes, r = a.issue_image, l = a.tag_image, s = "";
        r && (s = e("core").getMedia(r)) && (s = s.media_details.sizes.medium.source_url);
        var c = "";
        return l && (c = e("core").getMedia(l)) && (c = c.media_details.sizes.medium.source_url), {
            tagsList: o,
            issuepageList: i,
            issue_image_url: s,
            tag_image_url: c
        }
    }))((function (e) {
        var t = e.tagsList, n = e.issuepageList, o = e.issue_image_url, a = e.tag_image_url, r = e.isSelected,
            s = e.attributes, c = e.setAttributes;
        if (!t || !n) return "Populating block's fields...";
        if (t && 0 === t.length || n && 0 === n.length) return "Populating block's fields...";
        return Object(l.createElement)(Z, i()({}, s, {
            isSelected: r,
            tagsList: t,
            issuepageList: n,
            issue_image_url: o,
            tag_image_url: a,
            onSelectIssue: function (e) {
                c({select_issue: parseInt(e)})
            },
            onIssueTitleChange: function (e) {
                c({title: e})
            },
            onIssueDescriptionChange: function (e) {
                c({issue_description: e})
            },
            onIssueLinkTextChange: function (e) {
                c({issue_link_text: e})
            },
            onIssueLinkPathChange: function (e) {
                c({issue_link_path: e})
            },
            onSelectIssueImage: function (e) {
                var t = e.id;
                c({issue_image: t})
            },
            onIssueImageFocalPointChange: function (e) {
                var t = e.x, n = e.y;
                c({focus_issue_image: parseInt(100 * t) + "% " + parseInt(100 * n) + "%"})
            },
            onSelectTag: function (e) {
                c({select_tag: parseInt(e)})
            },
            onTagDescriptionChange: function (e) {
                c({tag_description: e})
            },
            onButtonTextChange: function (e) {
                c({button_text: e})
            },
            onButtonLinkChange: function (e) {
                c({button_link: e})
            },
            onSelectCampaignImage: function (e) {
                var t = e.id;
                c({tag_image: t})
            },
            onCampaignImageFocalPointChange: function (e) {
                var t = e.x, n = e.y;
                c({focus_tag_image: parseInt(100 * t) + "% " + parseInt(100 * n) + "%"})
            }
        }))
    })),
    save: function () {
        return null
    }
});

wpblocks.registerBlockType("planet4-blocks/submenu", {
    title: "Submenu",
    icon: "welcome-widgets-menus",
    category: "planet4-blocks",
    supports: {multiple: !1},
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_submenu",
            attributes: {
                submenu_style: {
                    type: "integer", shortcode: function (e) {
                        return Number(e.named.submenu_style)
                    }
                }, title: {
                    type: "string", shortcode: function (e) {
                        return e.named.title
                    }
                }, levels: {
                    type: "array", shortcode: function (e) {
                        var t = [];
                        if (e.named.heading1 > 0) {
                            var n = {
                                heading: Number(e.named.heading1),
                                link: Boolean(e.named.link1) || !1,
                                style: e.named.style1 || "none"
                            };
                            if (t.push(Object.assign({}, n)), e.named.heading2 > 0) {
                                var o = {
                                    heading: Number(e.named.heading2),
                                    link: Boolean(e.named.link2) || !1,
                                    style: e.named.style2 || "none"
                                };
                                if (t.push(Object.assign({}, o)), e.named.heading3 > 0) {
                                    var i = {
                                        heading: Number(e.named.heading3),
                                        link: Boolean(e.named.link3) || !1,
                                        style: e.named.style3 || "none"
                                    };
                                    t.push(Object.assign({}, i))
                                }
                            }
                        }
                        return t
                    }
                }
            }
        }]
    },
    attributes: {
        submenu_style: {type: "integer", default: 1},
        title: {type: "string"},
        levels: {type: "array", default: [{heading: 0, link: !1, style: "none"}]}
    },
    edit: (0, wp.data.withSelect)((function (e) {
    }))((function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(X, i()({}, n, {
            isSelected: t, onSelectedLayoutChange: function (e) {
                o({submenu_style: Number(e)})
            }, onTitleChange: function (e) {
                o({title: e})
            }, onHeadingChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.levels));
                i[e].heading = Number(t), o({levels: i})
            }, onLinkChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.levels));
                i[e].link = t, o({levels: i})
            }, onStyleChange: function (e, t) {
                var i = JSON.parse(JSON.stringify(n.levels));
                i[e].style = t, o({levels: i})
            }, addLevel: function () {
                o({levels: n.levels.concat({heading: 0, link: !1, style: "none"})})
            }, removeLevel: function () {
                o({levels: n.levels.slice(0, -1)})
            }
        }))
    })),
    save: function () {
        return null
    }
});

t("planet4-blocks/take-action-boxout", {
    title: n("Take Action Boxout"),
    icon: "welcome-widgets-menus",
    category: "planet4-blocks",
    supports: {multiple: !1},
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_take_action_boxout",
            attributes: {
                take_action_page: {
                    type: "integer", shortcode: function (e) {
                        return Number(e.named.take_action_page)
                    }
                }, custom_title: {
                    type: "string", shortcode: function (e) {
                        return e.named.custom_title
                    }
                }, custom_excerpt: {
                    type: "string", shortcode: function (e) {
                        return e.named.custom_excerpt
                    }
                }, custom_link: {
                    type: "string", shortcode: function (e) {
                        return e.named.custom_link
                    }
                }, custom_link_text: {
                    type: "string", shortcode: function (e) {
                        return e.named.custom_link_text
                    }
                }, custom_link_new_tab: {
                    type: "boolean", shortcode: function (e) {
                        return e.named.custom_link_new_tab
                    }
                }, tag_ids: {
                    type: "array", shortcode: function (e) {
                        return e.named.tag_ids ? e.named.tag_ids.split(",").map((function (e) {
                            return Number(e)
                        })).filter((function (e) {
                            return e > 0
                        })) : []
                    }
                }, background_image: {
                    type: "integer", shortcode: function (e) {
                        var t = e.named.background_image, n = void 0 === t ? "" : t;
                        return Number(n) > 0 ? Number(n) : 0
                    }
                }
            }
        }]
    },
    attributes: {
        take_action_page: {type: "number"},
        custom_title: {type: "string"},
        custom_excerpt: {type: "string"},
        custom_link: {type: "string"},
        custom_link_text: {type: "string"},
        custom_link_new_tab: {type: "boolean", default: !1},
        tag_ids: {type: "array", default: []},
        background_image: {type: "number"}
    },
    edit: o((function (e, t) {
        var n = e("core"), o = n.getEntityRecords,
            i = (n.getMedia, o("taxonomy", "post_tag", {hide_empty: !1, per_page: 50})), a = o("postType", "page", {
                per_page: -1,
                sort_order: "asc",
                sort_column: "post_title",
                parent: window.p4ge_vars.planet4_options.act_page,
                post_status: "publish"
            }), r = t.attributes.background_image, l = "";
        return r && (l = e("core").getMedia(r)) && (l = l.media_details.sizes.medium.source_url), {
            actPageList: a,
            tagsList: i,
            background_image_url: l
        }
    }))((function (e) {
        var t = e.tagsList, n = e.actPageList, o = e.background_image_url, a = e.isSelected, r = e.attributes,
            s = e.setAttributes;
        if (!t || !n) return "Populating block's fields...";
        if (t && 0 === t.length || n && 0 === n.length) return "Populating block's fields...";
        return Object(l.createElement)(ee, i()({}, r, {
            isSelected: a,
            tagsList: t,
            actPageList: n,
            background_image_url: o,
            onSelectTakeActoinPage: function (e) {
                s({take_action_page: e})
            },
            onCustomTitleChange: function (e) {
                s({custom_title: e})
            },
            onCustomExcerptChange: function (e) {
                s({custom_excerpt: e})
            },
            onCustomLinkChange: function (e) {
                s({custom_link: e})
            },
            onCustomLinkTextChange: function (e) {
                s({custom_link_text: e})
            },
            onCustomLinkNewTabChange: function (e) {
                s({custom_link_new_tab: e})
            },
            onButtonLinkTabChange: function (e) {
                s({button_link_new_tab: e})
            },
            onSelectedTagsChange: function (e) {
                s({tag_ids: e})
            },
            onSelectBackGroundImage: function (e) {
                var t = e.id;
                s({background_image: t})
            },
            onRemoveBackGroundImage: function () {
                s({background_image: -1})
            }
        }))
    })),
    save: function () {
        return null
    }
});

wpblocks.registerBlockType("planet4-blocks/timeline", {
    title: "Timeline",
    icon: "clock",
    category: "planet4-blocks",
    transforms: {
        from: [{
            type: "shortcode",
            tag: "shortcake_timeline",
            attributes: {
                timeline_title: {
                    type: "string", shortcode: function (e) {
                        return e.named.timeline_title
                    }
                }, description: {
                    type: "string", shortcode: function (e) {
                        return e.named.description
                    }
                }, google_sheets_url: {
                    type: "string", shortcode: function (e) {
                        return e.named.google_sheets_url
                    }
                }, language: {
                    type: "array", shortcode: function (e) {
                        return e.named.language
                    }
                }, timenav_position: {
                    type: "array", shortcode: function (e) {
                        return e.named.timenav_position
                    }
                }, start_at_end: {
                    type: "boolean", shortcode: function (e) {
                        return e.named.start_at_end
                    }
                }
            }
        }]
    },
    attributes: {
        timeline_title: {type: "string"},
        description: {type: "string"},
        google_sheets_url: {type: "string"},
        language: {type: "string", default: "en"},
        timenav_position: {type: "string"},
        start_at_end: {type: "boolean"}
    },
    edit: function (e) {
        var t = e.isSelected, n = e.attributes, o = e.setAttributes;
        return Object(l.createElement)(te, i()({}, n, {
            isSelected: t, onTimelineTitleChange: function (e) {
                o({timeline_title: e})
            }, onDescriptionChange: function (e) {
                o({description: e})
            }, onGoogleSheetsUrlChange: function (e) {
                o({google_sheets_url: e})
            }, onLanguageChange: function (e) {
                o({language: e})
            }, onTimenavPositionChange: function (e) {
                o({timenav_position: e})
            }, onStartAtEndChange: function (e) {
                o({start_at_end: e})
            }
        }))
    },
    save: function () {
        return null
    }
});


// wpblocks.getBlockTypes().forEach((block) => {console.log(block.name)});


//-------------Script start--------------------

let cli_args = process.argv.slice(2);

console.log('args: ', cli_args);
let post_type;
let wp_cli_args = [];

if (cli_args.length === 0) {

    console.log('No paremeters passed');
    process.exit(1);
} else if (cli_args.length === 1) {

    post_type = cli_args[0];
    wp_cli_args = [
        'post', 'list', `--post_type=${post_type}`, '--nopaging=true', '--format=json', '--fields=ID,post_title,post_name,post_status,url,post_content'
    ];
} else if (cli_args.length === 2 && 'post' === cli_args[0]) {

    console.log('Id passed');
    post_id = cli_args[1];
    wp_cli_args = [
        'post', 'get', `${post_id}`, '--format=json', '--fields=ID,post_title,post_name,post_status,post_content'
    ];
}

// Get registered blocks.
// wpblocks.getBlockTypes().forEach((block) => {console.log(block.name)});

// Get one page using wp cli wrapper and process post.

let failed_posts = [];
console.log(`Converting posts...`);
wpCli('wp', wp_cli_args, {
    cwd: config.wordpress_path,
}).then(process_posts);




//-------------Script end--------------------









//-----------START functions------------------//
function process_posts(result) {
    let posts = JSON.parse(result.stdout);
    if (! Array.isArray(posts)) {
        posts = [posts];
    }

    let i=0;
    posts.forEach((post) => {
        try {
            process_post(post);
            // setTimeout(function () {
            // }, 2000);
            i++;
        } catch (error) {
            console.error(error);
        }
    });
    console.log(`Updated ${i} posts` );
    return 0;
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
function process_post(post) {

    // Grab post content.
    let postContent = post.post_content;

    // Force post_content into a core/freeform block.
    // postContent = '<!-- wp:core/freeform --> ' + postContent + ' <!-- /wp:core/freeform -->';

    // Convert post content enclosed in `freeform` block to blocks.
    // This is happening to emulate the wordpress gutenberg editor that converts the whole post content to a single freeform block.
    // Assuming that there is no other gutenberg block in the post content,
    // this will output a single core/freeform block.

    // Then pass the freeform block content to rawHandler again to convert the content to individual blocks
    // and transform our shortcodes to gutenberg blocks.
    try {

        // Parse the original content - 1st time.
        let blocks = wpblocks.rawHandler({HTML: postContent});
        // blocks = wpblocks.rawHandler({HTML: wpblocks.getBlockContent(blocks[0])});

        // Debug blocks object.
        let new_blocks = [];

        // Parse each block.
        blocks.forEach((block) => {
                // console.log(block);

            // If it isn't one our planet4 blocks (which should be converted already)
            // then serialize that blocks (it should be a freeform probably)
            // and pass it again to rawHandler to break it down to blocks.
            // This way freeform blocks will be broken down to smaller blocks, like paragraphs.
            if (!block.name.includes('planet4') && !block.name.includes('freeform')) {

                // try {

                    // let temp_content = wpblocks.serialize(block);
                    let temp_content = '<!-- wp:core/freeform --> ' + wpblocks.getBlockContent(block) + ' <!-- /wp:core/freeform -->';
                    // console.log(temp_content);
                    temp_blocks = wpblocks.rawHandler({HTML: temp_content});
                    // console.log(temp_blocks);
                    temp_blocks = wpblocks.rawHandler({HTML: wpblocks.getBlockContent(temp_blocks[0])});
                    // console.log(temp_blocks);
                    // block = temp_blocks[0];
                    // console.log(temp_blocks);

                    // Push the broken blocks to the new array.
                    temp_blocks.forEach((_block) => {
                        new_blocks.push(_block);
                        // console.log(_block);
                    });
                // } catch (err) {
                //     console.log(post.ID);
                //     console.log(err);
                // }

                // new_blocks.concat(temp_blocks);
            } else if (block.name.includes('freeform')) {
                let temp_content =  wpblocks.getBlockContent(block);
                // console.log(temp_content);
                temp_blocks = wpblocks.rawHandler({HTML: temp_content});
                temp_blocks.forEach((_block) => {new_blocks.push(_block);});
            }
            else {
                new_blocks.push(block);
            }
        });

        // new_blocks.forEach((block) => {
        //     console.log(block.name);
        // });

        // Serialize blocks to html output.
        // let content = wpblocks.serialize(blocks);
        // blocks = wpblocks.rawHandler({HTML: content});

        fs.writeFile(`temp_converted_${post.ID}`, wpblocks.serialize(new_blocks), async (err) => {
            if (err) console.log(err);
            console.log(`Successfully Written to file ${post.ID}.`);

            // Save converted post content to temp file.
            var absolutePath = path.resolve(`temp_converted_${post.ID}`);

            // Use temp file to update the post content using wp cli wrapper.
            wpCli('wp', ['post', 'update', post.ID, absolutePath], {
                cwd: config.wordpress_path,
            }).then(async (result) => {
                // Navigate to post and take screenshot after the update of post content.
                console.log(`Successfully updated post content ${post.ID}`);
            });
        });
    } catch (error) {
        console.log("Post not updated");
        console.log(post.ID);
        console.error(error);
        // failed_posts.push(post.ID);
    }
}

//-----------END functions------------------//
