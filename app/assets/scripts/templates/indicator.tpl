<% if (label) { %>
<label><%= label %></label>
<% } %>

<% if (categoryTitle) { %>
  <h2 class="page--subtitle">
    <%= categoryTitle.display %>  
    <!--
    <a href="<%= baseurl %>/categories/<%= categoryTitle.src %>">
      <%= categoryTitle.display %>  
    </a>
    -->
  </h2>
<% } %>
<h3>
  <%= name %>
  <!--<a href="<%= baseurl %>/indicators/<%= indicator %>"><%= name %></a>-->
</h3>
<p><%- text %></p>

<% if (indicator_type=='G') { %>
  <div class="bar--container"></div>
<% } else { %>
<% if (no_internet) { %>
<div class="container--right">
    <div class="company-type">
      <i class="fa fa-circle"></i> Telecomunications companies
    </div>
    <div class="bar--container--telco"></div>
  </div>
<%} else if (no_telco) { %>
<div class="container--left">
    <div class="company-type">
      <i class="fa fa-circle"></i> Internet and mobile companies
    </div>
    <div class="bar--container--internet"></div>
  </div>
<% } else { %>

  <div class="container--left">
    <div class="company-type">
      <i class="fa fa-circle"></i> Internet and mobile companies
    </div>
    <div class="bar--container--internet"></div>
  </div>
  <div class="container--right">
    <div class="company-type">
      <i class="fa fa-circle"></i> Telecomunications companies
    </div>
    <div class="bar--container--telco"></div>
  </div>
  <% } %>
<% }%>