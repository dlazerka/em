<img src="img/avatar.jpg" class="avatar">
<div class="rightSide">
  <div>
    <span class="user"><%=user%></span>
    <span class="timestamp"><%=(new Date(timestamp)).toLocaleDateString()%>, 
      <%=(new Date(timestamp)).toLocaleTimeString()%></span></div>
    <span><%-text%></span>
  </div>
</div>