<div class="col-6 container--left">
	<% indicators_left.forEach(function (i) { %>
		<div class="indicator-item">
			<h3>
			  <a href="<%= i.baseurl %>/indicators/<%= i.indicator.toLowerCase() %>"><%= i.name %></a>
			  <!--<%= i.name %>-->
			</h3>
			<% i.text.forEach(function (t) { %>
			  <p><%= t %></p>
			<% }); %>
		</div>
	<% }); %>
</div> <!-- left column -->

<div class="col-6 container--right">
	<% indicators_right.forEach(function (i) { %>
		<div class="indicator-item">
			<h3>
			  <a href="<%= i.baseurl %>/indicators/<%= i.indicator.toLowerCase() %>"><%= i.name %></a>
			  <!--<%= i.name %>-->
			</h3>
			<% i.text.forEach(function (t) { %>
			  <p><%= t %></p>
			<% }); %>
		</div>
	<% }); %>
</div> <!-- right column -->