<!--<h3><%= category %></h3>-->
<div class="dotchart--<%= className %>">
  <label class="dotchart--label dotchart--label_left">0%</label>
  <label class="dotchart--label dotchart--label_right">100%</label>
  <div class="dotchart--baseline"></div>
  <% dots.forEach(function(dot) { %>
  <span class="dot <%= dot[0].className %>"
    data-val="<%= dot[0].val %>"
    style="left: <%= +dot[0].val %>%"></span>
  <% }); %>
  <label class="dotchart--label dotchart--label_highlight"
    style="left: <%= highlight.val %>%">
    <span class="collecticon collecticon-arrow-down"></span>
  </label>
  <div class="dotchart--tooltip off-screen">
  </div>
</div>
