# How to make this super amazing app work
1. Stand on one foot.
2. Close one eye.
3. Spin in circles 3 times.
4. Chant. Just chant. Anything is fine.
5. Realize this was unnecessary.

# How to really make this app work...
1. Install MySQL
2. Run database creation script:
    * `sudo mysql < mkdb.sql`

3. Run `npm install`
4. Create tables:
    * `node_modules/sequelize-cli/bin/sequelize db:migrate`
    * `node_modules/sequelize-cli/bin/sequelize db:migrate --env=test`

5. Create default admin user:
    * `node_modules/sequelize-cli/bin/sequelize db:seed:all`
    * `node_modules/sequelize-cli/bin/sequelize db:seed:all --env=test`

6. Run a quick test with mocha:
    * `node_modules/mocha/bin/mocha`

7. Transpile the Javascript/React:
    * `node node_modules/gulp/bin/gulp.js build`

8. Start app:
    * `DEBUG=survey:* npm start`

9. Now you can visit the site in your browser of choice at `http://localhost:3000`

# Some notes
1. The gulp build process seems like it's hanging, but it's not. I'll finish.
   It's running async on a few files to separate the concerns into multiple
   js files instead of one big file.  This isn't ideal, but I wanted separate
   sections of the site instead of a single page application.
2. It's possible someone can circumvent the session and answer a survey question
   more than once. The only real way to prevent this is to require a login for
   the users. However, the directions said "guest," so with that terminology,
   I'm guessing you didn't want the guests to have to login. We can't use IP
   filtering because multiple users behind a proxy or firewall would not be
   able to take the survey.
