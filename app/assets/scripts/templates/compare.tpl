<section class="item">
  <a id="<%= name.toLowerCase().replace('&', '').replace('.', '').replace(' ', '') %>"></a>
  <div class="main-content-with-padding">
    <div class="contain spaced-row row">
      <div class="container--score">
        <% if (total_difference>0) { %>
        <span class="positive">
          +<%= total_difference %>
        </span>
        <% } %>
        <% if (total_difference<0) { %>
        <span class="negative">
          <%= total_difference %>
        </span>
        <% } %>
        <% if (total_difference==0) { %>
        <span class="zero">
          <%= total_difference %>
        </span>
        <% } %>
      </div>
      <div class="container--title">
        <h2><%= name %></h2>
      </div>
      <div class="container--body">
        <p><%= description %></p>
        <a href="#top"><i class="fa fa-angle-double-up" aria-hidden="true"></i></a>
      </div>
    </div>
  </div>
</section>