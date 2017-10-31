<% if (categoryTitle) { %>
  <h2 class="spaced-row"><a href="<%= baseurl %>/categories/<%= categoryTitle.src %>"><%= categoryTitle.display %></a></h2>
<% } %>

<% if (label.length) { %>
  <label class="blocklabel"><%= label %></label>
<% } %>

<div class="score">
  <h3 class="survey--item_title"><a href="<%= baseurl %>/<%= dir %>/<%= href %>"><%= name %></a></h3>
  <h4 class="score--tier score--tier_<%= cat %>"><%= overall %></h4>
</div>

<% if (text) { %>
  <p class="survey--question_text"><%= text %></p>
<% } %>

<div class="medium-up">
  <p class="trigger js--table_trigger">
    <a class="js--expand">Expand <span class="collecticon collecticon-sm-triangle-down"></span></a>
    <a class="js--collapse">Collapse <span class="collecticon collecticon-sm-triangle-up"></span></a>
  </p>
  <div class="collapse--target js--table_collapse">
    <table class="spaced-row table table--scores table--span_<%= length %>">

      <% if (isCommitment) { %>
        <thead>
          <tr>
            <th></th>
            <% for (var i = 0, ii = services.length; i < ii; i += 2) { %>
              <th colspan="2" class="col_<% print(i / 2 % 2) %>">
                <span class="table--service_label"><%= services[i].type %></span>
                <%= services[i].name %>
              </th>
            <% } %>
          </tr>
          <tr class="thead--end">
            <th></th>
            <% for (var i = 0, ii = services.length; i < ii; ++i) { %>
              <% if (i % 2) { %>
                <th class="col_<% print(Math.floor(i / 2 % 2)) %>">Privacy</th>
              <% } else { %>
                <th class="col_<% print(Math.floor(i / 2 % 2)) %>">Freedom of Expression</th>
              <% } %>
            <% } %>
          </tr>
        </thead>
        <tbody>

          <% levels.forEach(function (level, k) { %>
            <% if (level.text !== 0) { %>
              <tr>
                <td><%= level.text %></td>
                <% level.scores.forEach(function (score, i) { %>
                <td class="col_<% print(Math.floor(i / 2 % 2)) %>"><%= score.score %></td>
                <% }); %>
              </tr>
            <% } %>

            <% if (follow && k === 0) { %>
              </tbody></table>
              <p class="spaced-row label--insufficient">If no/insufficient evidence, then:</p>
              <table class="spaced-row table table--scores table--span_<%= length %>">
                <thead>
                  <tr>
                    <th></th>
                    <% for (var i = 0, ii = services.length; i < ii; i += 2) { %>
                      <th colspan="2" class="col_<% print(i / 2 % 2) %>"><%= services[i].name %></th>
                    <% } %>
                  </tr>
                  <tr class="thead--end">
                    <th></th>
                    <% for (var i = 0, ii = services.length; i < ii; ++i) { %>
                      <% if (i % 2) { %>
                        <th class="col_<% print(Math.floor(i / 2 % 2)) %>">Privacy</th>
                      <% } else { %>
                        <th class="col_<% print(Math.floor(i / 2 % 2)) %>">Freedom of Expression</th>
                      <% } %>
                    <% } %>
                  </tr>
                </thead>
                <tbody>

            <%  } %>
          <% }); %>

          <tr class="table--footer">
            <td>Average Score</td>
            <% services.forEach(function (service, i) { %>
              <td class="col_<% print(Math.floor(i / 2 % 2)) %>"><span class="score--tier score--tier_<%= cat %>"><%= service.displayScore %></span></td>
            <% }); %>
          </tr>
        </tbody>

      <% } else { %>
        <thead>
          <tr class="thead--end">
            <th></th>
            <% services.forEach(function (service, i) { %>
              <th class="col_<% print (i % 2) %>">
                <span class="table--service_label"><%= service.type %></span>
                <%= service.name %>
              </th>
            <% }); %>
          </tr>
        </thead>
        <tbody>
          <% levels.forEach(function (level, k) { %>
            <% if (level.text !== 0) { %>
              <tr>
                <td><%= level.text %></td>
                <% level.scores.forEach(function (score, i) { %>
                <td class="col_<% print(i % 2) %>"><%= score.score %></td>
                <% }); %>
              </tr>
            <% } %>

            <% if (follow && k === 0) { %>
              </tbody></table>
              <p class="spaced-row label--insufficient">If no/insufficient evidence, then:</p>
              <table class="spaced-row table table--scores table--span_<%= length %>">
                <thead>
                  <tr class="thead--end">
                    <th></th>
                    <% services.forEach(function (service, i) { %>
                      <th class="col_<% print (i % 2) %>"><%= service.name %></th>
                    <% }); %>
                  </tr>
                </thead>
                <tbody>
            <% } %>

          <% }); %>
          <tr class="table--footer">
            <td>Average Score</td>
            <% services.forEach(function (service, i) { %>
              <td class="col_<% print(i % 2) %>"><span class="score--tier score--tier_<%= cat %>"><%= service.displayScore %></span></td>
            <% }); %>
          </tr>
        </tbody>
      <% } %>
    </table>

    <% if (custom.length) { %>
      <div class="spaced-row displaytext">
        <h3><%= customId.toUpperCase() %>&nbsp;Expanded Responses</h3>
        <ul>
        <% custom.forEach(function(item) { %>
          <li><%= item.text %>&nbsp;Possible score:&nbsp;<%= item.score %></li>
        <% }); %>
        </ul>
      </div>
    <% } %>

  </div>
</div>

<div class="small-only">

  <p class="trigger js--levels_trigger_small">
    <a class="js--expand">Expand <span class="collecticon collecticon-sm-triangle-down"></span></a>
    <a class="js--collapse">Collapse <span class="collecticon collecticon-sm-triangle-up"></span></a>
  </p>

  <div class="collapse--target js--levels_collapse_small">
    <% levels.forEach(function (level, k) { %>
      <div class="spaced-row">
        <% if (level.text) { %>
          <p><%= level.text %></p>
        <% } %>

        <% level.scores.forEach(function (score, i) { %>
          <p class="survey--inline">
            <span class="score--tier score--tier_<%= cat %>"><%= score.score %></span>&nbsp;
            <span class="survey--inline_name"><%= services[i].name %>&nbsp;
              <% if (isCommitment) { %>
                <% if (i % 2) { %>
                  (Privacy)
                <% } else { %>
                  (Freedom of Expression)
                <% } %>
              <% } %>
            :&nbsp;</span><%= score.response %></p>
        <% }); %>
        <% if (follow && k === 0) { %>
          <p class="spaced-row label--insufficient">If no/insufficient evidence, then:</p>
        <% } %>
      </div>
    <% }); %>

    <% if (custom.length) { %>
      <div class="spaced-row displaytext">
        <h3><%= customId.toUpperCase() %>&nbsp;Expanded Responses</h3>
        <ul>
        <% custom.forEach(function(item) { %>
          <li><%= item.text %>&nbsp;Possible score:&nbsp;<%= item.score %></li>
        <% }); %>
        </ul>
      </div>
    <% } %>

  </div>
</div>
