import {Component, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {MagicEngine} from "./magic/src/services/magic.engine";
import {ComponentsList} from './ComponentList';
import {BaseTaskMagicComponent} from "./magic/src/ui/app.baseMagicComponent";

declare let myExtObject: any;

@Component({
  selector: 'app-root',
  template: `

 `
})
export class AppComponent
{//extends BaseTaskMagicComponent implements OnInit {
	constructor(protected magic: MagicEngine,
	            private componentFactoryResolver: ComponentFactoryResolver,
	            private viewContainerRef: ViewContainerRef) {
		
		this.initializeMagic();
		BaseTaskMagicComponent.componentListBase = new ComponentsList();
		
		magic.startMagic();
	}
	
	initializeMagic() {
		this.magic.registerOpenFormCallback(formName => {
			this.InjectComponent(formName);
		});
		
		this.magic.registerShowMessageBox(msg => {
			alert(msg);
		});
	}
	
	private InjectComponent(formName: string) {
		const factory = this.componentFactoryResolver.resolveComponentFactory(ComponentsList.compHash[formName]);
		const ref     = this.viewContainerRef.createComponent(factory);
		ref.changeDetectorRef.detectChanges();
	}
}

