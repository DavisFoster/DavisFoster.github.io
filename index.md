---
layout: default
title: Home
---
<p>Hey there! You've landed on my blog where I share code experiments and other random bits. Check out the latest posts below.</p>
<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <h2 class="post-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p class="post-date">{{ post.date | date_to_string }}</p>
      <p>{{ post.excerpt }}</p>
    </li>
  {% endfor %}
</ul>
