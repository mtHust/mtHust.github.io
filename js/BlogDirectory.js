/*
 * Customized js for Thomas's Blog.
 * Thomas.Zhao, 2015-01-13
 */
jQuery.noConflict();
jQuery(document).ready(function(){
    var backToTopTxt = "▲", backToTopEle = jQuery('<div class="backToTop"></div>').appendTo(jQuery("body")).text(backToTopTxt).attr("title","Back to Top").click(function() {
        jQuery("html, body").animate({ scrollTop: 0 }, 120);
    }), backToTopFun = function() {
        var st = jQuery(document).scrollTop(), winh = jQuery(window).height();
        (st > 200)? backToTopEle.show(): backToTopEle.hide();    
        //IE6下的定位
        if (!window.XMLHttpRequest) {
            backToTopEle.css("top", st + winh - 166); 
        }
    };

    backToTopEle.hide(); 
        jQuery(window).bind("scroll", backToTopFun);
    jQuery('div.main a,div.pic a').attr('target', '_blank');
});



var BlogDirectory = {
    /*
     * Side Nav Affixing
     *
     * reference to:
     * https://github.com/twbs/bootstrap/blob/master/docs/assets/js/src/application.js#L35
     */
    setSideNavAffixing:function() {
        // Scrollspy
        var $window = jQuery(window)
        var $body   = jQuery("html, body")

        $body.scrollspy({
            target: '.bs-docs-sidebar'
        })
        $window.on('load', function () {
            $body.scrollspy('refresh')
        })

        // Kill links
        jQuery('.bs-docs-container [href=#]').click(function (e) {
            e.preventDefault()
        })

        // Sidenav affixing
        setTimeout(function () {
            var $sideBar = jQuery('.bs-docs-sidebar')

            $sideBar.affix({
                offset: {
                    top: function () {
                        var offsetTop      = $sideBar.offset().bottom
                        var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
                        var navOuterHeight = jQuery('.bs-docs-bar-top').height()

                        return (this.top = offsetTop - navOuterHeight - sideBarMargin)
                    },
                    bottom: function () {
                        return (this.bottom = 0 - jQuery('.bs-docs-container').outerHeight(true))
                    }
                }
            })
        }, 100)

        setTimeout(function () {
            jQuery('.bs-top').affix()
        }, 100)
    }, // end of setSideNavAffixing:function()


    /* Generate directory tree
     *
     * side_nav_element: side navigation element
     * article_body_element:  article body container.
     *
     * processing: search header elements(h1,h2,h3) in `article_body_element`,
     * generate directory tree list, and put them into side_nav_element.
     */
    createBlogDirectory:function (side_nav_element, article_body_element){
        if(!article_body_element || article_body_element.length < 1 ||
                !side_nav_element) {
            return false;
        }

        var nodes = article_body_element.find("h1,h2,h3");
        var ulSideNav = side_nav_element;
		ulSideNav.append("<h1><a href=#top>Contents</a><br/><h1>");

        jQuery.each(nodes,function(){
			$this = jQuery(this);
            var nodetext = $this.text();
            // There maybe HTML tags in header inner text, use regex to erase them
            nodetext = nodetext.replace(/<\/?[^>]+>/g,"");
            nodetext = nodetext.replace(/&nbsp;/ig, "");

            // btw: Jekyll generates id for each header.
            var nodeid = $this.attr("id");
            if(!nodeid) {
                nodeid = "top";
            }

            var item_a = jQuery("<a></a>");
            item_a.attr("href", "#" + nodeid);
            item_a.text(nodetext);

            var ret_li;
            // wrapper: ul ( in the template, outside this code )
            // h1: layer 1: li - a
            // h2: layer 2: ul - li - a
            // h3: layer 3: ul - ul - li - a
            switch($this.get(0).tagName) {
            case "H1":
                var li_a = jQuery("<li></li>").append(item_a);
                ret_li = li_a;
                break;
            case "H2":
                var li_a = jQuery("<li></li>").append(item_a);
                var nav_li_a = jQuery("<ul class=\"nav\"></ul>").append(li_a);
                ret_li = nav_li_a;
                break;
            case "H3":
                var li_a = jQuery("<li></li>").append(item_a);
                var nav_li_a = jQuery("<ul class=\"nav\"></ul>").append(li_a);
                var nav_nav_li_a = jQuery("<ul class=\"nav\"></ul>").append(nav_li_a);
                ret_li = nav_nav_li_a;
                break;
            }

            if(!ret_li) {
                // do nothing
            } else {
                ulSideNav.append(ret_li);
            }
        })  // end of each

    } //end of createBlogDirectory:function()

};


jQuery(document).ready(function(){
        // Generate the side navigation `ul` elements
        BlogDirectory.createBlogDirectory(jQuery("#sideNav"), jQuery(".bs-docs-container"));

        // caculate affixing
        BlogDirectory.setSideNavAffixing();
});
