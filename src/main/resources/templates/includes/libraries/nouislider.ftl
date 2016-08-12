
<#if loader.load("nouislider")>
    <@loader.printHtml
        libraryName = "noUiSlider"
        cdnCheck = "!window.noUiSlider"
        cdnJs = ["https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.5.1/nouislider.min.js"]
        cdnCss = ["https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.5.1/nouislider.min.css"]
        localJs = ["${dependencies}/nouislider.min.js"]
        localCss = ["${dependencies}/nouislider.min.css"] />
</#if>
