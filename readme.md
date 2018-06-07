# rm-nm

[![circleci](https://circleci.com/gh/MattAndDev/rm-nm/tree/master.svg?style=shield&circle-token=12aedd82a9a427ca644f90be5404e1a7232da500)](https://circleci.com/gh/MattAndDev/rm-nm)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Remove any `node_modules` folder in the given directory.
Or globally if you wish.

## usage

```
npm i -g rm-nm
rm-nm [target-folder] [args]
```

### example
```
rm-nm ./code/
```

### args
```
-s // only node_modules with package.json siblings
-ss // only node_modules with package.json && package-lock.json siblings
```

## why?

Because `find . -name "node_modules" -exec rm -rf '{}' +` in the shell is too easy.
**And of course because:**
![node modules are heavier then neutron stars](http://devhumor.com/content/uploads/images/August2017/node-modules.jpg)

