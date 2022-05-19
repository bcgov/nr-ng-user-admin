# Various issues / fixes notes

### problems adding new component

```
More than one module matches. Use the '--skip-import' option to skip importing the component into the closest module or use the module option to specify a module.
```

fix, specify the module

`ng g c components/unauthorized --module app`

# Angular Notes:

## Two way data binding - ngModel

* required the FormsModule (ngModel) add to app.module.ts
* syntax:
`<input [(ngModel)]="nameVariable"> <p>{{nameVariable}}`

combination of square / round brackets creates two way binding.
if nameVariable is changed somewhere else it will be updated in
both the input and the {{}}

## ngTemplate  custom element
```
<ng-template [ngIf]="clickcounter > 4" [ngIfElse]="none">
</ng_template>

<ng-template #none>
<p> this text is show if click counter is not greater than 4 </p>
</ng-template>
```

## Class / Style binding

inline css applied to elements
```
<div class='some-class' [style.background-color]="clickCounter > 4 ? 'yellow' : 'lightgray'">
<p>
    background is controlled by the clickcounter, if its > 4 then its
    yellow if not its lightgray
</p>
</div>
```

OR if you want to change multiple css values

<div class="some-class" [ngStyle]="{
    'background-color': clickCounter > 4 ? 'yellow' : 'lightgray',
    'border': clickcounter > 4 ? '4px solid black' : 'none'}">
<p> text effected by the ngStyle </p>
</div>

OR class binding

<div class="some-class" [class.active]="clickCounter > 4">
  <p> applies the class called active when clickCounter is > 4 </p>
</div>

OR multiple classes

<div class="some-class" [ngClass]="setClasses()">
 <p> class is set by whatever the method setClasses returns </p>
</div >

code:
...
setClasses() {
    let myClasses = {
        active: this.clickCounter > 4,
        notactive: this.clickCounter <=4>,
    }
    return MyClasses;
}


## Passing data between components

