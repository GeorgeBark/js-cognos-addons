//"use strict";

function cognosAddon(){
  var constants: {
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
  config = {},
  initQueue = [];

  function setConfig(newConfig){
    config = jq.extend({},newConfig,true);
  };

  function getConfig(){
    return config;
  };

  function addToInit(fn,props){
    props = props || {};
    initQueue.push({fn:fn,props:props});
  }

  function init(props){
    //window.jq = window.jq || jQuery.noConflict();
    props = props || {};

    var i;

    for(i=0,i<initQueue,i++){
      if(props.timeout){
        setTimeout(cognosAddon.init,props.timeout);

      }else{
        cognosAddon.applyExpandCollapse(allOptions.sectionTealExpandCollapseOptions);
        cognosAddon.applyExpandCollapse(allOptions.sectionOrangeExpandCollapseOptions);
      }
    }

  };

  function createDOMSelector(searchItem,searchType){

    searchType = searchType || 'equalTo';

    var selector = "["
      + cognosAddon.constants.cognosDOM.RSNameAtrr
      + cognosAddon.constants.searchTypes[searchType]
      + "'"
      + searchItem
      + "']";

    return selector;

  },

  function applyExpandCollapse(options){

    var sectionSuffix = options.sectionSuffix || '_collapsable_section',
        buttonSuffix = options.buttonSuffix || '_collapse_button',

        $sections = jq(cognosAddon.createDOMSelector(sectionSuffix,'contains'));

    $sections.each(function(i,e){

      var $table = jq(e),
          $header = $table.find('tr').first(),
          $section = $header.next(),
          $button = $table.find(cognosAddon.createDOMSelector(buttonSuffix,'contains'));


      if(options.hasImages){
        $button.on('click',function(){

          var _$section = $section,
              _$button = jq(this),
              $image = _$button.find('img');

          _$section.toggle('slow',function(){

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
          _$section.toggle('slow');
        });
      }
    });
  }
  };


  return {
    init: init,
    applyExpandCollapse: applyExpandCollapse
  }
}

var allOptions = {
  sectionTealExpandCollapseOptions:{
    sectionSuffix: '_collapsable_section_teal',
    buttonSuffix: 'collapse_button',
    hasImages:true,
    images:{
      whenExpanded:'../samples/images/GSM Images/arrow_teal_up.png',
      whenCollapsed: '../samples/images/GSM Images/arrow_teal_down.png'
    }
  },
  sectionOrangeExpandCollapseOptions:{
    sectionSuffix: '_collapsable_section_orange',
    buttonSuffix: 'collapse_button',
    hasImages:false,
    images:{
      whenExpanded:'../samples/images/GSM Images/arrow_orange_up.png',
      whenCollapsed: '../samples/images/GSM Images/arrow_orange_down.png'
    }
  }
};

cognosAddon.init();
