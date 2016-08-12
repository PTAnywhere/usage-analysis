
<#if loader.load("jquery")>
    <!-- jQuery -->
    <script src="http://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script>
        if (!window.jQuery) {
            document.write('<script src="${dependencies}/jquery.min.js"><\/script>');
        }
    </script>
</#if>
