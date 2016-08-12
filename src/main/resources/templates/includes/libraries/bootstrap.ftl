
<#if loader.load("bootstrap")>
    <#include "jquery.ftl">

    <@loader.printHtml
        libraryName = "Bootstrap"
        cdnCheck = "!(typeof $().emulateTransitionEnd == 'function')"
        cdnJs = ["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"]
        cdnCss = [ "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
                   "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" ]
        localJs = ["${dependencies}/js/bootstrap.min.js"]
        localCss = ["${dependencies}/css/bootstrap.min.css", "${dependencies}/css/bootstrap-theme.min.css"] />
</#if>
