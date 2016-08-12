
<#if loader.load("visjs")>
    <@loader.printHtml
        libraryName = "Vis.js"
        cdnCheck = "!window.vis"
        cdnJs = ["https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.js"]
        cdnCss = ["https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.css"]
        localJs = ["${dependencies}/vis.min.js"]
        localCss = ["${dependencies}/vis.min.css"] />
</#if>
