# How to make this super amazing app work
1. Stand on one foot.
2. Close one eye.
3. Spin in circles 3 times.
4. Chant. Just chant. Anything is fine.
5. Realize this was unnecessary.

# How to really make this app work...
1. Install MySQL
2. Run database creation script:
    sudo mysql < mkdb.sql
3. Run `npm install`
4. Create tables:
    node_modules/sequelize-cli/bin/sequelize db:migrate
    node_modules/sequelize-cli/bin/sequelize db:migrate --env=test
5. Create default admin user:
    node_modules/sequelize-cli/bin/sequelize db:seed:all
    node_modules/sequelize-cli/bin/sequelize db:seed:all --env=test
6. Run a quick test with mocha:
    node_modules/mocha/bin/mocha
7. Transpile the Javascript/React:
    node node_modules/gulp/bin/gulp.js build
8. Start app:
    DEBUG=survey:* npm start
9. Now you can visit the site in your browser of choice at http://localhost:3000
