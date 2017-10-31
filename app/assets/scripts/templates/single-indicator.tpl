<% data.forEach(function (company) { %>
<div class="survey-row">

  <h3 class="score--overall>
    <span class="score--tier score--tier_<%= company.tier %>"><%= company.overall %></span>
    <span class="score--name">
      <a href="/companies/<%= company.href %>"><%= company.display %></a>
    </span>&nbsp;<label class="inlinelabel"><%= company.type %></label>
  </h3>

  <div>
    <% company.services.forEach(function (service) { %>
    <div class="score">
      <span class="score--tier score--tier_<%= service.tier %>"><%= service.score %></span>
      <span class="score--name"><%= service.name %>
        &nbsp;
        <% if (service.type.length) { %>
          (<%= service.type %>)
        <% } %>
      </span>
    </div>
    <% }); %>
  </div>
</div>
<% }); %>
