<#if !(loaded??)>
    <#assign loaded = [] />
</#if>

<#function load moduleName>
    <#local alreadyLoaded = loaded?seq_contains(moduleName) />
    <#if !(alreadyLoaded)>
        <#assign loaded = loaded + [ moduleName ] />
    </#if>
    <#return !(alreadyLoaded)>
</#function>

<#macro printHtml libraryName cdnCheck cdnJs=[] cdnCss=[] localJs=[] localCss=[]>
    <!-- ${libraryName} -->
    <#list cdnJs as jsFile>
    <script src="${jsFile}"></script>
    </#list>
    <#list cdnCss as cssFile>
    <link rel="stylesheet" href="${cssFile}" />
    </#list>

    <#-- Fallback plan in case CDN fails (or we are not connected to the network) -->
    <#-- Assumption: CSS are not loaded if JS is not loaded properly because they are hosted by the same CDN. -->
    <script>
        if (${cdnCheck}) {
            console.log("Error loading ${libraryName} from CDN, including local copy.");
            <#list localJs as jsFile>
            document.write('<script src="${jsFile}"><\/script>');
            </#list>
            <#list localCss as cssFile>
            document.write('<link rel="stylesheet" href="${cssFile}">');
            </#list>
        }
    </script>
</#macro>