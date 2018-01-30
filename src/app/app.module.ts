import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {MagicModule} from "./magic/magic.core.module";
import {AppComponent} from "./app.component";
import {DynamicModule} from "ng-dynamic-component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatFormFieldModule,
	MatInputModule
} from "@angular/material";
import {ComponentsList} from "./ComponentList";


const comps = ComponentsList.getAllComponents();

@NgModule({
	declarations: [AppComponent, ...comps],
	imports     : [
		BrowserModule,
		FormsModule,
		HttpModule,
		JsonpModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		DynamicModule.withComponents(comps),
		MagicModule.forRoot(),
		// Angular Material
		MatButtonModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatCardModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatInputModule
	],
	exports     : [FormsModule, ReactiveFormsModule],
	providers   : [],
	
	bootstrap: [AppComponent]
})
export class AppModule
{
	constructor() {}
}
