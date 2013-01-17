<a href="<%=image.id%>">
  <img class="img" src="<%=image.src%>" alt="<%-image.text%>" title="<%-image.text%>" 
    style="height: <%=image.height%>px;width: <%=image.width%>px;"/>
  <% if (canvas) { %>
    <canvas class="canvas" height="<%=canvas.height%>" width="<%=canvas.width%>"></canvas>
    <img src="img/video.svg" class="videoIcon" alt="video"/>
  <% } %>
  <% _.each(messages, function(msg) { %>
    <div class="message <%=msg.where%>-center"><%=msg.lines%></div>
  <% }); %>
</a>
<div class="vote"></div>
