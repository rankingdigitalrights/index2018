<% if ( indicator_type == 'g' ) { %>
  <div id="bar--container"></div>
<% } else { %>
  <div class="col-6 container--left">
    <div class="company-type">
      <i class="fa fa-circle"></i> Internet and mobile companies
    </div>
    <div id="bar--container--internet"></div>
  </div>
  <div class="col-6 container--right">
    <div class="company-type">
      <i class="fa fa-circle"></i> Telecomunications companies
    </div>
    <div id="bar--container--telco"></div>
  </div>
<% }%>