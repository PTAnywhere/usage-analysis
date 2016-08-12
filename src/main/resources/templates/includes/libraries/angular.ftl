
<#if loader.load("angular")>
    <@loader.printHtml
        libraryName = "AngularJS"
        cdnCheck = "!window.angular"
        cdnJs = ["https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"]
        cdnCss = []
        localJs = ["${dependencies}/angular.min.js"]
        localCss = [] />
</#if>
