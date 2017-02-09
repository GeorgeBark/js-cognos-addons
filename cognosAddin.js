//"use strict";
var cognosAddin = {
  constants: {
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

  init: function(props){
    //window.jq = window.jq || jQuery.noConflict();
    props = props || {};

    if(props.timeout){
      setTimeout(cognosAddin.init,props.timeout);

    }else{
      cognosAddin.applyExpandCollapse(allOptions.sectionTealExpandCollapseOptions);
      cognosAddin.applyExpandCollapse(allOptions.sectionOrangeExpandCollapseOptions);
    }
  },
  createDOMSelector: function(searchItem,searchType){

    searchType = searchType || 'equalTo';

    var selector = "["
      + cognosAddin.constants.cognosDOM.RSNameAtrr
      + cognosAddin.constants.searchTypes[searchType]
      + "'"
      + searchItem
      + "']";

    return selector;

  },

  applyExpandCollapse: function(options){

    var sectionSuffix = options.sectionSuffix || '_collapsable_section',
        buttonSuffix = options.buttonSuffix || '_collapse_button',

        $sections = jq(cognosAddin.createDOMSelector(sectionSuffix,'contains'));

    $sections.each(function(i,e){

      var $table = jq(e),
          $header = $table.find('tr').first(),
          $section = $header.next(),
          $button = $table.find(cognosAddin.createDOMSelector(buttonSuffix,'contains'));


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

cognosAddin.init();
