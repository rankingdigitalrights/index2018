<% if ( indicator_type == 'g' ) { %>
  <div id="bar--container"></div>
<% } else { %>
  <% if ( !display_i ) { %>
  <div class="col-6 container--left">
    <div class="company-type">
      <i class="fa fa-circle"></i> Internet and Mobile Ecosystems Companies
    </div>
    <div id="bar--container--internet"></div>
  </div>
  <% } %>
  <% if ( !display_t ) { %>
  <div class="col-6 container--right">
    <div class="company-type">
      <i class="fa fa-circle"></i> Telecommunications companies
    </div>
    <div id="bar--container--telco"></div>
  </div>
  <% } %>
<% }%>