        <ol class="breadcrumb">
            <#list breadcrumb as el>
                <#if el_has_next>
                    <#if el.url??>
                       <li><a href="${base}/a/${el.url}">${el.name}</a></li>
                    <#else>
                        <li>${el.name}</li>
                    </#if>
                <#else>
                    <li class="active">${el.name}</li>
                </#if>
            </#list>
        </ol>