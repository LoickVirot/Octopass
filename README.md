# Octopass
Free and open source password manager, easy to use, client-side decryption.

## How does it work ?
To better understand how Octopass works, here is an activity diagram.
![activity diagram](https://img.ziggi.org/4XjOshkS.png)

With this process, the server never know any passwords from client or user : it always recieve encrypted password.
To protect users from non-official clients wich decided to save passwords in clear into database (why not), the server also encrypt data.
