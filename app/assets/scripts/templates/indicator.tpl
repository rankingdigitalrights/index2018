<section class="company--table <%= p_name %>">
    <h2>
        <a id="<%= item.id %>"></a>
        <%= item.name %>
        <span class="percent"><%= score %></span>
    </h2>
    <div class="overflow-for-table">
    <table>
        <thead>
            <tr>
                <th class="cell--first"><%= name %></th>
                <% item.headers.forEach(function(item) { %>
                <th><%= item.text %></th>
                <% }); %>
            </tr>
        </thead>
        <tbody>
            <% item.rows.forEach(function(row) { %>
            <tr>
                <% row.cells.forEach(function(data) { %>
                    <td><%= data.value %></td>
                <% }); %>
            </tr>
            <% }); %>
        </tbody>
        <tfoot>
            <tr>
                <td>Average score</td>
                <% item.average.forEach(function(item) { %>
                <% if (item.value == 'N/A') { %>
                <td>N/A</td>
                <% } else { %>
                <td><%= Math.round(item.value*100)/100 %></td>
                <% } %>

                <% }); %>
            </tr>
        </tfoot>
    </table>
    </div>
</section>