<section class="service--section">
  <div class="contain spaced-row row">

    <div class="title-section">
      <div class="overall-score service">
        <label>Service</label>
        <div class="overall-score-value"><%= service %></div>
      </div>
      <div class="overall-score company">
        <label>Company</label>
        <div class="overall-score-value"><%= company %></div>
      </div>
    </div>

    <div class="container--left">        
      <p><%= text %></p>
    </div>

    <div class="container--right">
      <div class="comp--industry">
        <div class="rank--section">
            <label>Rank</label>
            <div class="rank--section_rank_value">
                <span><%= rank %></span>
            </div>
        </div>

        <div class="score--section">
          <label>Score</label>
          <div class="overall-score"><%= total  %></div>
        </div>

        <div class="difference--section">
            <label>Difference</label>
            <div id="total_difference" class="difference--value">
              <%= Math.abs(Math.round(difference)) %>
              <% if (difference >= 0) { %><i class="fa fa-chevron-up up-arrow-green" aria-hidden="true"></i><% } %>
              <% if (difference < 0) { %><i class="fa fa-chevron-down down-arrow-red" aria-hidden="true"></i><% } %>
            </div>
          </div>
      </div>
      <div class="comp--mark">
        <label>Position among other services</label>
        <div id="<%= service.slice(0,2) + rank %>-dot-chart"> </div>
      </div>
    </div>

  </div>
</section>