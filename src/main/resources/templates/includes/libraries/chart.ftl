
<#if loader.load("chartjs")>
    <#include "moment.ftl">

    <@loader.printHtml
        libraryName = "Chart.js"
        cdnCheck = "!window.Chart"
        cdnJs = ["https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js"]
        cdnCss = []
        localJs = ["${dependencies}/Chart.min.js"]
        localCss = [] />
</#if>
