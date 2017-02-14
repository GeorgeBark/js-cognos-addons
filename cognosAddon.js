//"use strict";

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
      jqSelector: '.mainViewerTable > tbody > tr > .topRow'
    }
  };

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

    // var i;
    //
    // for(i=0,i<initQueue,i++){
    //   if(props.timeout){
    //     setTimeout(cognosAddon.init,props.timeout);
    //
    //   }else{
    //
    //   }
    // }

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

  init(jq,initialConfig);

  return {
    getGlobalConfig: getGlobalConfig,
    setGlobalConfig: setGlobalConfig,
    init: init,
    applyExpandCollapse: applyExpandCollapse,
    cognosHeaders: {
      show:showCognosHeaders,
      hide:hideCognosHeaders
    },
    extras:{
      createDOMSelector: createDOMSelector
    }
  };
}

var allOptions = {
  sectionTealExpandCollapseOptions:{
    sectionPartialName: 'COLLAP_SEC_TEAL_',
    buttonPartialName: 'COLLAP_BTN_TEAL',
    hasImages:true,
    images:{
      whenExpanded:'../samples/images/GSM Images/arrow_teal_up.png',
      whenCollapsed: '../samples/images/GSM Images/arrow_teal_down.png'
    }
  },
  sectionOrangeExpandCollapseOptions:{
    sectionPartialName: 'COLLAP_SEC_ORANGE_',
    buttonPartialName: 'COLLAP_BTN_ORANGE_',
    hasImages:false,
    images:{
      whenExpanded:'../samples/images/GSM Images/arrow_orange_up.png',
      whenCollapsed: '../samples/images/GSM Images/arrow_orange_down.png'
    }
  }
};
var cog = cognosAddon(jq);

cog.cognosHeaders.hide();
cog.applyExpandCollapse(allOptions.sectionTealExpandCollapseOptions);
cog.applyExpandCollapse(allOptions.sectionOrangeExpandCollapseOptions);
