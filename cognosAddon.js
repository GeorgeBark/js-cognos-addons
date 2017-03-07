//"use strict";


(function (w,jq,initialConfig){
  /**
  * Main function
  * @param {object} jq - jQuery instance used in cognosAddon.
  * @param {object} initialConfig - configuration object to override the defaults.
  */
  function cognosAddon(jq, initialConfig){

    var constants = {
      searchTypes: {
        'startsWith':'^=',
        'endsWith':'$=',
        'contains':'*=',
        'equalTo':'='
      },
      cognosDOM: {
        RSNameAtrr : 'lid'
      }
    },
    defaultConfigs = {
      expandCollapse: {
        sectionPartialName: '_collapsable_section',
        buttonPartialName: 'collapse_button',
        transition: 'slow',
        partialNameSearch: 'contains',
        startCollapsed:true,
        hasImages:false,
        images:{
          whenExpanded:'',
          whenCollapsed: ''
        }
      }
    },
    globalConfig = {
      cognosHeaders:{
        jqSelector: '.mainViewerTable > tbody > tr > .topRow',
        hide:false
      }
    };

    //function addFunction(fn){
    //  this[fn] = fn;
    //}

    function setGlobalConfig(newConfig){
      jq.extend(true,globalConfig,newConfig);
    }

    function getGlobalConfig(){
      return globalConfig;
    }


    function init(jq,newConfig){

      if(jq === undefined){
        console.log("Cognos Add-on requires an instance of jQuery to run");
        return;
      }
      setGlobalConfig(newConfig || {});

      //add new functions to jq
      (function ($) {
      jq.fn.inlineStyle = function (prop) {
          return this.prop("style")[$.camelCase(prop)];
      };
      }(jq));

      if(!jq.browser){
        jq.browser = {};
        jq.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit{4}/.test(navigator.userAgent.toLowerCase());
        jq.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        jq.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        jq.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
      }

      if(globalConfig.cognosHeaders.hide){
        hideCognosHeaders();
      }

    }
    function changePaddingWebkit(val){
      function increasePx(i,curValue) {
        return (parseInt(curValue) + val + 'px');
      }

      if(jq.browser.webkit){
        jq('table.tb td').css({
          paddingLeft: increasePx,
          paddingRight: increasePx,
          paddingTop: increasePx,
          paddingBottom: increasePx
        });
      }
    }

    function createDOMSelector(searchItem,searchType){

      searchType = searchType || 'equalTo';

      var selector = "["
        + constants.cognosDOM.RSNameAtrr
        + constants.searchTypes[searchType]
        + "'"
        + searchItem
        + "']";

      return selector;

    }

    function applyExpandCollapse(options){

      options = jq.extend(true,{},defaultConfigs.expandCollapse,options);

      var $sections = jq(createDOMSelector(options.sectionPartialName,options.partialNameSearch));

      $sections.each(function(i,e){

        var $table = jq(e),
            $header = $table.find('tr').first(),
            $section = $header.next(),
            $button = $table.find(createDOMSelector(options.buttonPartialName,options.partialNameSearch));


        if(options.hasImages){
          $button.on('click',function(){

            var _$section = $section,
                _$button = jq(this),
                $image = _$button.find('img');

            _$section.toggle(options.transition,function(){

              var _$section = jq(this),
                  _$image = $image;
              if(_$section.css('display') === "none"){
                _$image.attr('src',options.images.whenCollapsed);
              }
              else{
                _$image.attr('src',options.images.whenExpanded);
              }
            });
          });
        }
        else{
          $button.on('click',function(){
            var _$section = $section;
            _$section.toggle(options.transition);
          });
        }
      });
    }

    function hideCognosHeaders(){
      jq(globalConfig.cognosHeaders.jqSelector).hide();
    }

    function showCognosHeaders(){
      jq(globalConfig.cognosHeaders.jqSelector).show();
    }

    function prepareForSorting(tableName,config){

      var defaultConfig = {
      	numHeaders: 1,
        numFooters: 0,
      	sortableColumns:[0,0,0,0],
      	defaultSorting:{ //If it comes already sorted from Cognos.
      		index:0, //Column index, starting (zero-based)
      		type:1 //-1 descending, 0 no sort, 1 ascending
      	}
      }

      config = jq.extend(true,{},defaultConfig,config)

      var numHeaders, numFooters;

    	var sc = config.sortableColumns;//0- no sort, 1-number, 2-text, 3-numeric-key, 4-text-key
      var ds = config.defaultSorting;

    	numHeaders = config.numHeaders;
    	numFooters = config.numFooters;

      var $table = jq(createDOMSelector(tableName,'startsWith'))

    	var $headerRow = $table.find('tr:first');

    	$headerRow.find('td').each(function(index){

    	    if(sc[index]>0){

    			var $this = jq(this);
    			var defClass  = ds.index != index?'orderNone':ds.type==1?'orderAsc':'orderDesc';
      			$this.append('<span class=img></span>').addClass(defClass);//.attr('data-sortType',sc[index]);

    			$this.click(function(){

    				var orderType = 0;

    				if($this.hasClass('orderAsc')){
    					orderType = -1;
    					$this.removeClass('orderAsc').addClass('orderDesc');
    				}else{
    					orderType = 1;
    					$this.removeClass('orderDesc').removeClass('orderNone').addClass('orderAsc');
    				}

    				$this.siblings().removeClass('orderDesc').removeClass('orderAsc').addClass('orderNone');

    				sortTable($this,orderType,index,sc[index],numHeaders,numFooters);

    				//configTableLayout(elem,config);

    			});
    		}
    	});


    }

    function sortTable(clickedElem,orderType,columnIndex,sortingType,numHeaders,numFooters){


    	var $table = jq(clickedElem).closest('table');

      //var $table = jq(cognosAddon.extras.createDOMSelector('LST_SHIFT_TO','startsWith'))
    	var $rows = $table.find('tr');
    	var $rowsToSort = $rows.filter(':lt('+($rows.length-numFooters)+'):gt('+(numHeaders-1)+')');



    	$rowsToSort.sort(function(a, b) {

    		var A,B;

    		if(sortingType < 3) //the inner text is the sort-key
    		{
    			A = jq(a).children('td').eq(columnIndex).find(':not(.filterKey)').text();
    			B = jq(b).children('td').eq(columnIndex).find(':not(.filterKey)').text();
    		}else if(sortingType < 5){ //based on sorting key
    			A = jq(a).children('td').eq(columnIndex).find('.sortingKey').text();
    			B = jq(b).children('td').eq(columnIndex).find('.sortingKey').text();
    		}else{ //based on sorting key
    			A = jq(a).children('td').eq(columnIndex).find('.filterKey').text();
    			B = jq(b).children('td').eq(columnIndex).find('.filterKey').text();
    		}

    		if(sortingType == 1 || sortingType == 3 || sortingType == 5){ //number, number-key or number-code
    			A = parseFloatLocale(A,'en');
    			B = parseFloatLocale(B,'en');
    		}
    		if(A < B) {
    			return -1*orderType;
    		}
    		if(A > B) {
    			return 1*orderType;
    		}else{
    			return 0;
    		}

    	});

      jq($rowsToSort).detach().insertAfter($table.find('tr:lt('+(numHeaders)+')'));

    }

    function parseFloatLocale(text,locale){

    	//try to pick it up from the LocalizationServices object
    	var	localeNumberFormats={
    			en:{thousandsSep:",",decimalPoint:"."},
    			fr:{thousandsSep:" ",decimalPoint:","},
    			pt:{thousandsSep:" ",decimalPoint:","},
    			es:{thousandsSep:".",decimalPoint:","},
    			de:{thousandsSep:".",decimalPoint:","},
    			it:{thousandsSep:".",decimalPoint:","}
    		};

    	var num;

    	locale = locale.substring(0,2).toLowerCase();

    	localeConfig = typeof(localeNumberFormats[locale]) === 'undefined' ? localeNumberFormats.en : localeNumberFormats[locale];

    	text = text.replace(new RegExp(String.fromCharCode(160),"g"),' ') //convert 160's in normal spaces.
    				.replace(new RegExp('\\'+localeConfig.thousandsSep,'g'),'')
    				.replace(new RegExp('\\'+localeConfig.decimalPoint,'g'),'.');

        num = parseFloat(text);

    	num = isNaN(num)?Infinity:num;

        return(num);

    }

    init(jq,initialConfig);
    /**
    * @return {object} Functions to be used.
    */
    return {
      getGlobalConfig: getGlobalConfig,
      setGlobalConfig: setGlobalConfig,
      init: init,
      applyExpandCollapse: applyExpandCollapse,
      appplySorting: prepareForSorting,
      cognosHeaders: {
        show:showCognosHeaders,
        hide:hideCognosHeaders
      },
      extras:{
        createDOMSelector: createDOMSelector,
        changePaddingWebkit: changePaddingWebkit
      }
    };
  }

  w.cognosAddon = cognosAddon(jq,initialConfig);

})(window,jq,{cognosHeaders:{hide:true}});
