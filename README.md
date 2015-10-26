# CapitalOne-Instagram

In this project, I used the Instagram API to find all recent posts tagged with #CapitalOne. I organized the data in two different ways - with images and with a table.

In the image view, the most recent images are laid out in a grid. By hovering over the images, a small description of the post can be seen, including the username, date, caption, and number of likes. By clicking on the username, you are redirected to the user's instagram profile. Furthermore, by hovering over the user's image, you can see the number of posts, followers, and people they are following. Lastly, a general sentiment of the post caption can be seen on the top left corner, which was calculated using Sentiment, a Node.js module. 

In the table view, the data is laid out in a simpler manner. All the data is still accessible, and a tally of the total number of positive, neutral, and negative posts is kept. A more specific description of the sentiment calculation is also shown. 

See some screenshots here: http://imgur.com/a/NGRTz
The site is also deployed at https://capitalone-instagram.herokuapp.com/