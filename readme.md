# rm-node-modules

> WIP should become yet another npm module

## why?

- Because not everyone is a bash ninja
- Because not everyone has 1TB ssd
- Because I tend to abuse `npm i`

and of course because:

![node modules are heavier then neutron stars](http://devhumor.com/content/uploads/images/August2017/node-modules.jpg)


## usage
As now:
```
node rm-node-modules /target/dir (args)
```
Will look into `/target/dir` for every first level `node_modules` folder and delete it.
So use at your own risk, this does `rm -rf` a lot of things.

Args as now:
```
-s // will only remove node modules if package.json is present
-ss // will only remove node modules if package.json && package-json.lock is present
```