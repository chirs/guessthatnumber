
### Guess that number

A very simple game written in javascript.


#### Rules

Pick a number to select the domain. There will be this many possible numbers.

Guess a number. If you're right, you win!
If you're wrong, guess again. 
Repeat until you get it right.


#### setup

Point nameservers to the correct IP address.
sudo cp etc/nginx/guessthatnumber /etc/nginx/sites-available/guessthatnumber
sudo ln -s /etc/nginx/sites-available/guessthatnumber /etc/nginx/sites-enabled/
sudo /etc/init.d/nginx/reload


