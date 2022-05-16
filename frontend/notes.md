# Various issues / fixes notes

### problems adding new component

```
More than one module matches. Use the '--skip-import' option to skip importing the component into the closest module or use the module option to specify a module.
```

fix, specify the module

`ng g c components/unauthorized --module app`