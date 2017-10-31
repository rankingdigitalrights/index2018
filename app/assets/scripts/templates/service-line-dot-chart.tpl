<div class="dotchart--<%= className %>">
  <label class="dotchart--label dotchart--label_left">0%</label>
  <label class="dotchart--label dotchart--label_right">100%</label>
  <div class="dotchart--baseline"></div>
  <% dots.forEach(function(dot) { %>
    <% if(dot[0].className == 'highlight') { %>
        <span class="dot <%= dot[0].className %>"
              data-val="<%= dot[0].t %>"
              style="left: <%= +dot[0].t %>%">
              <%= dot[0].rank %>
        </span>
    <% } else { %>
        <span class="dot <%= dot[0].className %>"
              data-val="<%= dot[0].t %>"
              style="left: <%= +dot[0].t %>%">
        </span>
  <% }}); %>
  <label class="dotchart--label dotchart--label_highlight"
    style="left: <%= highlight.t %>%">
    <span class="collecticon collecticon-arrow-down"></span>
  </label>
  <div class="dotchart--tooltip off-screen">
  </div>
</div>
