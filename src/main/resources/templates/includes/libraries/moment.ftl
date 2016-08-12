
<#if loader.load("momentjs")>
    <@loader.printHtml
        libraryName = "Moment.js"
        cdnCheck = "!window.moment"
        cdnJs = ["https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"]
        cdnCss = []
        localJs = ["${dependencies}/moment.min.js"]
        localCss = [] />
</#if>
