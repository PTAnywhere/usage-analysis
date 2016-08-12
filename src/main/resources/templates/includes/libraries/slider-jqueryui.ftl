
<#if loader.load("jqueryui")>
    <#include "jquery.ftl">

    <@loader.printHtml
        libraryName = "jQuery-UI slider"
        cdnCheck = "!window.jQuery"
        cdnJs = ["http://code.jquery.com/ui/1.12.0/jquery-ui.min.js"]
        cdnCss = ["http://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.min.css"]
        localJs = ["${dependencies}/jquery-ui.min.js"]
        localCss = ["${dependencies}/jquery-ui.min.css"] />
</#if>
