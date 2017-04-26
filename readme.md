# nodepop

Nodepop is an api where the users can post and find ads of a huge variety.

## Api usage

### Users
    
#### Register

Send a Post to users/register with the keys in the body: name, email and password. The email must be unique into the whole app.

#### Login

Send a Post to users/login with the keys 'email' and 'password' in the body.
When you finish your login you will receive a authentication token, which you should keep for being able to watch the ads.


### Ads
You won´t be able to see anything in /api if you don´t send your authentication token in each petition.
You can send this in three ways:
* In the body of a Post method with the key 'token'.
* In a header of a Get method with the key 'token'.
* In a Get method, adding the token after of api/ads. Example: api/ads?token='token1'.
#### Search with filters

Send a Get to api/ads and you will find all the ads in the app.

You can use several filters adding to the end '?'. 
You can concat as many of the following as you want with '&'.

* Name filter: Using name='string' you will find all the ads whose name start with 'string'.
* On sale filter: You could find just the ads on sale using on_sale=true, or the opposite with on_sale=false.
* Tags filter: Adding tags='tag1' you fill find all the ads with this tag. Also, you could search ads with 'tag1' or 'tag2' if you separate with commas these tags.
* Price filter: You have 4 differents ways to use this filter. 
    * Filtering ads with litter or equal price: You can use price=-'price' .Example: price=-15
    * Filtering ads with greater or equal price: You can use price='price'- .Example: price=15-
    * Filtering ads with price in a range: You can use price='price1'-'price2' . Example: price=15-50 (or price=50-15).
    * Filtering ads with a equal price: You can use price='price'. Example: price=15

Besides you can use some extra parameters like:

* Sort: With sort='field' you could sort the ads by a specific field from lowest to highest. Example: sort=name
* Limit: With limit=2 you will see 2 ads for each page (default value: 2).
* Page: With page=3 you will see the page 3 of the ads (default value: 1).

Examples:
1- Searching ads with tags 'motor' or 'mobile', a price lower than 100 and sort by name:
Get method to: api/ads?tags=motor,mobile&price=-100&sort=name




