<img src="/img/avatar.jpg" class="avatar">
<div class="rightSide">
  <span class="user"><%=user%></span>
  <span class="timestamp"><%=(new Date(timestamp)).toLocaleDateString()%>, 
    <%=(new Date(timestamp)).toLocaleTimeString()%></span>
  <div class="text"><%-text%></div>
</div>
