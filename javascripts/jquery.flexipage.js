// 
//  jquery.flexipage.js
//  A jQuery plugin por paginate content
//  
//  Created by Javier Sánchez - Marín (vieron) 
//  http://github.com/vieron/flexipage
//  Free distribution.
// 

(function($) {

  $.fn.flexipage = function(options) {

    // build main options before element iteration
    var opts = $.extend({}, $.fn.flexipage.defaults, options);
    $.fn.flexipage.options = opts;
    
    
    //builds pager 
    function buildPager($target, HTML){
      if (opts.pager_selector == false) {
        $target.after('<ul class="pager">'+HTML+'</ul>')
        opts.pager_selector = ".pager"
      }else{
        $(opts.pager_selector , $.fn.flexipage.options.parent_cont ).html(HTML)
      }
    }

    // iterate and reformat each matched element

    return this.each(function() {   
      if (opts.pager == true) opts.navigation == false;
      if (opts.navigation == true) opts.pager == false;
      
      var $target = $(this);
      $target.data("opts", opts)

      opts.wrapper = $target.closest(opts.parent)
      opts.actual = opts.firstpage;
      opts.total_pages = Math.ceil(($(opts.element , $target).length)/opts.perpage);
      
      if (opts.pager == true) opts.navigation == false;
      if (opts.navigation == true) opts.pager == false;
      
      // if pager is set to true
      if (opts.pager == true) {
         (opts.showcounter == true)? opts.showcounter ='<li><span class="actual"></span>/<span class="total">'+opts.total_pages+'</span></li>' : opts.showcounter = ' ';
         var pagerHTML = '<li class="prev"><a href="#">'+opts.prev_txt+'</a></li>'+
                             opts.showcounter+
                             '<li class="next"><a href="#">'+opts.next_txt+'</a></li>';
                             
         buildPager($target, pagerHTML)

        //click event for next page 
        $(opts.pager_selector+' li.next a', opts.wrapper).click(function(e){
          e.preventDefault();

          if (opts.actual <= (opts.total_pages-1)) {
            $target.selectPage( opts.actual+1 );
          };
        });

        //click event for prev page 
        $(opts.pager_selector+' li.prev a', opts.wrapper).click(function(e){
          e.preventDefault();

          if (opts.actual <= (opts.total_pages+1)) {
            $target.selectPage( opts.actual-1 );
          };
        })
      };

      //if navigation is set to true
      if (opts.navigation == true) {
        var navigationHTML = "";
        var actual;

        for (var i = 1; i <= opts.total_pages; i++){
          (opts.firstpage == i)? actual = ' class="active" ' : actual = '';
          navigationHTML += '<li'+actual+'><a rel="'+i+'" href="#">'+i+'</a></li>';
        };
        
        buildPager($target, navigationHTML)

        // CLICK EVENTS
        $(opts.pager_selector+' li a', opts.wrapper).click(function(e){
          e.preventDefault();
          var topage = $(this).attr('rel');
          if (topage <= opts.total_pages && topage > 0) {
            $target.selectPage(topage);
          };
        })
      };

      //if carousel set to true
      if (opts.carousel == true) {
        opts.elements = $(opts.element, $target);
        $target.wrap('<div class="flexiwrap"></div>')
        $target.parent().css({overflow:'hidden', position: 'relative'})
        $target.css({overflow:'hidden', position: 'absolute', top: '0px', left: '0px' })
        opts.distances = [];
        
        for (var i = 0; i <= opts.total_pages; i++){
          opts.distances[i] =  (i*opts.perpage)*$($(opts.elements[i]), $target).width();
        };
      };

      //show first page, first time
      $target.selectPage(opts.firstpage);

    });
  }; 


  //show pages function
  $.fn.selectPage = function(n){
    var parent = $(this)
    var opts = parent.data('opts')
    

    if (n =="next"){
       (opts.actual < opts.total_pages) ? n = opts.actual+1  :  n = opts.total_pages;
    }

    if (n =="prev"){
      if (opts.actual > 0) n = opts.actual-1 ;
    }

    if (n==0 || n==undefined)  n = 1 ;

    if (n > 1)
      var $selected_items = $(opts.element+':lt('+(n*opts.perpage)+'):gt('+(((n-1)*opts.perpage)-1)+')', parent);
    else
      var $selected_items = $(opts.element+':lt('+(n*opts.perpage)+')', parent);  

    if (opts.carousel == true) {
      parent.animate({ left: '-'+opts.distances[n-1]+'px' }, opts.speed, opts.animation)
    }else{
      $selected_items.css(opts.visible_css)
      $(opts.element, parent).not($selected_items).css(opts.hidden_css)
    }

    if (opts.navigation == true) {
      $(opts.pager_selector + ' li', opts.wrapper).removeClass('active')
      $(opts.pager_selector + ' li:eq('+(n-1)+')', opts.wrapper).addClass('active')
    };

    if (opts.pager == true) {
      $(opts.pager_selector+' .actual', opts.wrapper).html(n);
      $(opts.pager_selector+' .disabled', opts.wrapper).removeClass('disabled');
      if (n == opts.total_pages )
      $(opts.pager_selector+' .next,', opts.wrapper).addClass('disabled');
      if (n == 1 ) 
      $(opts.pager_selector+' .prev', opts.wrapper).addClass('disabled');
    };
    opts.actual = parseInt(n);
  };


	



  // plugin defaults
  $.fn.flexipage.defaults = {
  	parent : "div",
    element : "li",
    pager : true,
    next_txt : "Next &raquo;",
    prev_txt : "&laquo; Prev",
    pager_selector : false,
    perpage : 5,
    showcounter : true,
    hidden_css : {display:'none'},
    visible_css : {display:'block'},
    firstpage : 1,
    navigation: false,
    carousel: false,
    speed: 300,
    animation: 'linear'
  };


})(jQuery);
