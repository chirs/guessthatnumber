## Guess That Number! 

The dumbest guessing game I can imagine.

#### History

While on a rickety bus ride from Delhi to Dharamsala with my friend Miryam, we made up this game to entertain ourselves and pass the time.


#### Rules

* Pick a number. There will be this many possible numbers.
* Guess a number. If you're right, you win!
* If you're wrong, guess again. 
* Repeat until you get it right.
* There are no clues.

#### setup

Point nameservers to the correct IP address.

```
sudo cp etc/nginx/guessthatnumber /etc/nginx/sites-available/guessthatnumber
sudo ln -s /etc/nginx/sites-available/guessthatnumber /etc/nginx/sites-enabled/
sudo /etc/init.d/nginx/reload
```

Enjoy! 

#### todo

* Better reward when you guess right (doesn't update text if it's the last number)
* Make it dumber somehow