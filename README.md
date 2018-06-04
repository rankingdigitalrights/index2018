# Ranking Digital Rights

## Overview
Development of the web app for 2018 Corporate Accountability Index. Ranking Digital Rights.

## Gulp for building
The gulpfile is based on the [gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) yeoman generator. The build system currently supports:

- Image optimization
- Sass compilation
- Watchify for JS bundling
- Minification/uglification where appropriate
- Serving and live reloading of pages

There are two commands, both run via npm.

- `npm run build` or `gulp build` or `gulp` - clean & build everything and put it into dist folder
- `npm run serve` or `gulp serve` - serve the pages and utilize live reload on changes to styles, fonts, images, scripts and HTML.


## Assets Structure

```
app/assets/
|
+- Graphics / Images used in the report and small illustrated icons.
|
+- Scripts /
|
+- Static / Json files.
|
+- Styles / The sass styles

```


### Configurations and environment variables

At times, it may be necessary to include options/variables specific to `production`, `staging` or `local` in the code. To handle this, there is a master config.js file. This file should not be modified.  Instead, modify one of:

- `config/production.js` - production settings
- `config/staging.js` - overrides the production settings for staging server (basically Travis not on the DEPLOY branch)
- `config/local.js` - local (development) overrides. This file is gitignored, so you can safely change it without polluting the repo.

When developing locally with `gulp serve`, the default will be to use `production` (with overrides from `local.js`).  However, if you need to run with the staging settings, use: `DS_ENV=staging gulp serve` from the command line.


### How scripts are built

The script build, which uses `browserify`, outputs two js files: `bundle.js` and
`vendor.js`:
 - `bundle.js`, created by the `javascript` task in deployment and by
   `watchify` during development, contains all the app-specific code:
   `app/scripts/main.js` and all the scripts it `require`s that are local to
   this app.
 - `vendor.js`, created by the `vendorBundle` task, contains all the external
   dependencies of the app: namely, all the packages you install using `npm
   install --save ...`.

### Json's creation.

- RDRIndex/2018data 2018 raw data
- convert_all_csvs_to_json Improved data for parsing indicators.
- master/csv_json_converters python converters, csv's to JSON

## Travis for testing and deployment
The .travis.yml file enables the usage of [Travis](http://travis.org) as a test and deployment system. In this particular case, Travis will be looking for any changes to the repo and when a change is made to the `master` branch, Travis will build the project and deploy it to the `gh-pages` branch.

## semistandard for linting
We're using [semistandard](https://github.com/Flet/semistandard) for linting.

- `npm run lint` - will run linter and warn of any errors.

There are linting plugins for popular editors listed in the semistandard repo.

## Deploy workflow

Any push to the `master` branch triggers a production deploy and every push to the `staging` branch triggers a staging deploy. The ideal work flow would look something like this:

Work locally on your developer machine and use the local developer setup to test any changes immediately.

```
gulp serve
```

This will build the site locally and make the site available on `http://localhost:3000`.

Once everything works locally, do a regular commit.

```
git add -A
git commit -m "Describe the change."
```

To test the changes on staging run:

```
git push -f origin master:staging
```

The `-f` flag forces a push to the branch and overwrites the history of the remote. `origin` points to the remote at Github. Use `git remote -v` to verify:

```
git remote -v
origin  git@github.com:rankingdigitalrights/index2018.git (fetch)
origin  git@github.com:rankingdigitalrights/index2018.git (push)
```

`master:staging` can be read as *push from the local master branch to the remove staging branch*.

This will use travis to build and deploy to staging. You can visit `https://rankingdigitalrights.org/index2018-stg` to view your changes. If all looks good push your changes to trigger a production deploy.

```
git push
```
