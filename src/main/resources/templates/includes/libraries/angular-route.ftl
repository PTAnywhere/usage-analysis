
<#if loader.load("angularRoute")>
    <!-- AngularJS Route -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-route.min.js"></script>
    <script>
        try {
            angular.module('ngRoute');
        } catch(err) {
            console.log("Error externally loading Angular route module from CDN, including local copy.");
            document.write('<script src="${dependencies}/angular-route.min.js"><\/script>');
        }
    </script>
</#if>
