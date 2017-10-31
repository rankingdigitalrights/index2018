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
        <label>Score within the service</label>
        <div class="rank--section">
          <span class="rank--section_rank_value">
            <span><%= rank %></span>
          </span>
          <div class="overall-score"><%= total  %></div>
        </div>
      </div>
      <div class="comp--mark">
        <label>Position among other services</label>
        <div id="<%= service.slice(0,2) + rank %>-dot-chart"> </div>
      </div>
    </div>

  </div>
</section>