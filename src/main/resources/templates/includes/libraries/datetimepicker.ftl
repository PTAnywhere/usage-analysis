
<#if loader.load("datetimepicker")>
    <#include "jquery.ftl">
    <#include "moment.ftl">
    <#include "bootstrap.ftl">

    <@loader.printHtml
        libraryName = "Bootstrap Datetimepicker"
        cdnCheck = "!$.fn.datetimepicker"
        cdnJs = ["https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/js/bootstrap-datetimepicker.min.js"]
        cdnCss = ["https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css"]
        localJs = ["${dependencies}/bootstrap-datetimepicker.min.js"]
        localCss = ["${dependencies}/bootstrap-datetimepicker.min.css"] />

    <!-- Datetimepicker AngularJS module -->
    <script src="https://rawgit.com/atais/angular-eonasdan-datetimepicker/0.3.5/dist/angular-eonasdan-datetimepicker.min.js"></script>
    <script>
        try {
            angular.module('ae-datetimepicker');
        } catch(err) {
            console.log("Error loading Angular datetimepicker route module from CDN, including local copy.");
            document.write('<script src="${dependencies}/angular-eonasdan-datetimepicker.min.js"><\/script>');
        }
    </script>
</#if>