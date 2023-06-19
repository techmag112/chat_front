<?php

$list = '[{"id":1,"chat_id":35,"alarm":1,"lasttime":"12:31","group_status":0,"email":"hairullin@cg.ru","username":"Tetra","avatar":"avatar-m.png","email_status":0},{"id":2,"chat_id":40,"alarm":1,"lasttime":"05:06","group_status":0,"email":"abc@cg.ru","username":"Super","avatar":"avatar-m.png","email_status":0}]';

echo json_decode($list);